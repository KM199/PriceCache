const express = require('express');
const stockController = require('../controllers/stockController');

const router = express.Router();

router.get('/targets', stockController.getStockTargets);
router.get('/price/:symbol', stockController.getStockPrice);
router.get('/ticker/:ticker', stockController.getTickerInfo);

module.exports = router;
