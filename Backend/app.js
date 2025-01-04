require('events').EventEmitter.defaultMaxListeners = 15;

const dotenv = require('dotenv')
dotenv.config()
const cors = require('cors')
const express = require('express')
const app = express();
const userRoutes = require('./routes/user.route.js')
const captainRoutes = require('./routes/captain.route.js')
const cookieParser = require('cookie-parser');
const mapsRoutes = require('./routes/maps.route.js')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

app.get('/',(req, res)=>{
    res.send("Hello World")
})

app.use('/users', userRoutes)
app.use('/captains', captainRoutes)
app.use('/maps', mapsRoutes)


module.exports = app;
