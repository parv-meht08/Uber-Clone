const socketIO = require("socket.io");
const jwt = require("jsonwebtoken");
const captainModel = require("./models/captain.model");
const userModel = require("./models/user.model");

let io;

const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174'
      ],
      methods: ["GET", "POST"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"]
    },
    transports: ['polling', 'websocket'],
    pingTimeout: 60000,
    pingInterval: 25000,
    allowEIO3: true
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization;
      
      if (!token) {
        return next(new Error("Authentication token required"));
      }

      // Remove Bearer prefix if present
      const tokenString = token.startsWith('Bearer ') ? token.slice(7) : token;

      const decoded = jwt.verify(tokenString, process.env.JWT_SECRET || 'your-secret-key');
      if (!decoded) {
        return next(new Error("Invalid token"));
      }

      socket.userId = decoded.id;
      socket.userType = decoded.userType;
      next();
    } catch (error) {
      console.error("Socket authentication error:", error);
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", async (socket) => {
    console.log("New client connected:", socket.id);
    console.log("User type:", socket.userType);
    console.log("User ID:", socket.userId);
    
    try {
      // If it's a captain, update their socket ID immediately
      if (socket.userType === 'captain') {
        console.log(`Updating captain ${socket.userId} with socket ID ${socket.id}`);
        const captain = await captainModel.findByIdAndUpdate(
          socket.userId,
          { 
            socketId: socket.id,
            status: 'active'
          },
          { new: true }
        );
        
        if (captain) {
          console.log(`Captain ${captain._id} socket ID updated successfully`);
          socket.emit('join_response', { 
            success: true, 
            message: 'Connected successfully',
            captain: {
              id: captain._id,
              name: `${captain.fullname.firstname} ${captain.fullname.lastname}`,
              socketId: socket.id
            }
          });
        }
      }
    } catch (error) {
      console.error("Error updating captain socket ID:", error);
      socket.emit('error', { message: error.message });
    }

    socket.on("disconnect", async () => {
      console.log("Client disconnected:", socket.id);
      try {
        if (socket.userType === 'captain') {
          await captainModel.findByIdAndUpdate(
            socket.userId,
            { 
              socketId: null,
              status: 'inactive'
            }
          );
          console.log(`Captain ${socket.userId} marked as inactive`);
        }
      } catch (error) {
        console.error("Error handling disconnect:", error);
      }
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

const sendMessageToSocketId = (socketId, event, data) => {
  try {
    const socket = getIO();
    if (socket) {
      console.log(`Sending ${event} to socket ${socketId}`);
      socket.to(socketId).emit(event, data);
    }
  } catch (error) {
    console.error(`Error sending message to socket ${socketId}:`, error);
  }
};

module.exports = {
  initializeSocket,
  getIO,
  sendMessageToSocketId
};