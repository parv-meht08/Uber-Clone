const http = require('http')
const app = require('./app.js');
require('dotenv').config();
const connectToDB = require('./db/db.js');
const port = process.env.PORT || 3000;

connectToDB();

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server running on port ${port}`)
})