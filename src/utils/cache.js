const NodeCache = require('node-cache');
const CACHE_TTL = parseInt(process.env.CACHE_TTL) || 3600; // Cache time to live (TTL) in seconds

const cache = new NodeCache({ stdTTL: CACHE_TTL });

exports.get = (key) => cache.get(key);

exports.set = (key, value) => cache.set(key, value);
