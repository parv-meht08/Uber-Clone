const http = require('http');
const app = require('./app');
const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(4000, () => {
    console.log(`Server running on port ${process.env.PORT || 4000}`);
})

