
const axios = require('axios');
const BASE_URL = 'https://finnhub.io/api/v1/quote';
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

exports.fetchStockPrice = async (symbol) => {
    const url = `${BASE_URL}?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
    const response = await axios.get(url);
    return response.data.c;
};
