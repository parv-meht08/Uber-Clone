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
const rideRoutes = require('./routes/ride.route.js')

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

app.get('/',(req, res)=>{
    res.send("Hello World")
})

// Mount routes
app.use('/users', userRoutes)
app.use('/captains', captainRoutes)
app.use('/maps', mapsRoutes)
app.use('/ride', rideRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

module.exports = app;
