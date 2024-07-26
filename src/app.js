
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const stockRoutes = require('./routes/stockRoutes');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Use morgan for logging
app.use(morgan('combined'));

// Routes
app.use('/stock', stockRoutes);

module.exports = app;
