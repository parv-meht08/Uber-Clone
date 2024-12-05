const mongoose = require("mongoose");

function connectToDB() {
  mongoose
    .connect(process.env.MONGODB_URI || "mongodb://localhost/uberclone", {
      serverSelectionTimeoutMS: 30000, // 30 seconds timeout
    })
    .then(() => {
      console.log("✅ Connected to MongoDB successfully.");
    })
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err.message);
      process.exit(1); // Exit process with failure
    });

  // Event listeners for additional debugging
  mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to the database.");
  });

  mongoose.connection.on("error", (err) => {
    console.error("Mongoose connection error:", err.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("Mongoose connection disconnected.");
  });

  // Graceful shutdown
  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("Mongoose connection closed due to application termination.");
    process.exit(0);
  });
}

module.exports = connectToDB;
