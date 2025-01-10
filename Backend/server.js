const http = require('http');
const app = require('./app.js');
const { initializeSocket } = require('./socket.js');
require('dotenv').config();
const connectToDB = require('./db/db.js');
const port = process.env.PORT || 3000;

connectToDB();

const server = http.createServer(app);
initializeSocket(server); // Correct function call

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
