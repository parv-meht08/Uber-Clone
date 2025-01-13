const http = require('http');
const app = require('./app.js');
const { initializeSocket } = require('./socket.js');
require('dotenv').config();
const connectToDB = require('./db/db.js');
const port = process.env.PORT || 4000;

connectToDB();

const server = http.createServer(app);

// Initialize Socket.IO with the server
const io = initializeSocket(server);

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
