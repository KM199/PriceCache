const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const CACHE_TTL = parseInt(process.env.CACHE_TTL) || 3600; // Cache time to live (TTL) in seconds
const cache = new NodeCache({ stdTTL: CACHE_TTL });
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const BASE_URL = 'https://finnhub.io/api/v1/quote';

// Enable CORS for all routes
app.use(cors());

// Use morgan for logging
app.use(morgan('combined'));

// Helper function to fetch stock price
async function fetchStockPrice(symbol) {
    const url = `${BASE_URL}?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
    const response = await axios.get(url);
    return response.data.c;
}

// Endpoint to get stock price
app.get('/stock/:symbol', async (req, res) => {
    const symbol = req.params.symbol.toUpperCase();
    const cachedPrice = cache.get(symbol);

    if (cachedPrice) {
        console.log(`Cache hit for ${symbol}`);
        return res.json({ symbol, price: cachedPrice, source: 'cache' });
    }

    try {
        const price = await fetchStockPrice(symbol);
        cache.set(symbol, price);
        console.log(`Fetched and cached price for ${symbol}`);
        res.json({ symbol, price, source: 'api' });
    } catch (error) {
        console.error(`Failed to fetch stock price for ${symbol}`, error);
        res.status(500).json({ error: 'Failed to fetch stock price' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
