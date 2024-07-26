const stockService = require('../services/stockService');
const googleSheetsService = require('../services/googleSheetsService');
const cache = require('../utils/cache');

exports.getStockPrice = async (req, res) => {
    const symbol = req.params.symbol.toUpperCase();
    const cachedPrice = cache.get(symbol);

    if (cachedPrice) {
        console.log(`Cache hit for ${symbol}`);
        return res.json({ symbol, price: cachedPrice, source: 'cache' });
    }

    try {
        const price = await stockService.fetchStockPrice(symbol);
        cache.set(symbol, price);
        console.log(`Fetched and cached price for ${symbol}`);
        res.json({ symbol, price, source: 'api' });
    } catch (error) {
        console.error(`Failed to fetch stock price for ${symbol}`, error);
        res.status(500).json({ error: 'Failed to fetch stock price' });
    }
};

exports.getStockTargets = async (req, res) => {
    const spreadsheetId = '1MeXrCVfwiTujTs-2AepzUQMiSiQkAHizRcIMA4zH0gQ';
    const range = 'Sheet1!A2:D'; // Fetch all rows from A2 to D
    try {
        const data = await googleSheetsService.getSheetData(spreadsheetId, range);
        const formattedData = data.map(row => ({
            ticker: row[0],
            currentPrice: row[1],
            priceTarget: row[2],
            return: row[3]
        }));
        cache.set('allTargets', formattedData);
        res.json({ data: formattedData });
    } catch (error) {
        console.error('Failed to fetch stock targets from Google Sheets', error);
        res.status(500).json({ error: 'Failed to fetch stock targets' });
    }
};

exports.getTickerInfo = async (req, res) => {
    const ticker = req.params.ticker.toUpperCase();
    const cachedData = cache.get('allTargets');

    if (cachedData) {
        const tickerInfo = cachedData.find(item => item.ticker === ticker);
        if (tickerInfo) {
            return res.json({ data: tickerInfo });
        } else {
            return res.status(404).json({ error: 'Ticker not found' });
        }
    }

    try {
        // If cache is empty, fetch data from Google Sheets
        const spreadsheetId = '1MeXrCVfwiTujTs-2AepzUQMiSiQkAHizRcIMA4zH0gQ';
        const range = 'Sheet1!A2:D'; // Fetch all rows from A2 to D
        const data = await googleSheetsService.getSheetData(spreadsheetId, range);
        const formattedData = data.map(row => ({
            ticker: row[0],
            currentPrice: row[1],
            priceTarget: row[2],
            return: row[3]
        }));
        cache.set('allTargets', formattedData);
        const tickerInfo = formattedData.find(item => item.ticker === ticker);
        if (tickerInfo) {
            res.json({ data: tickerInfo });
        } else {
            res.status(404).json({ error: 'Ticker not found' });
        }
    } catch (error) {
        console.error('Failed to fetch stock targets from Google Sheets', error);
        res.status(500).json({ error: 'Failed to fetch stock targets' });
    }
};
