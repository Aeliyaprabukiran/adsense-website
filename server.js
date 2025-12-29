const express = require('express');
const cors = require('cors');
const axios = require('axios');
const NodeCache = require('node-cache');

const app = express();
const cache = new NodeCache({ stdTTL: 60 }); // 60 second cache

app.use(cors());
app.use(express.json());

// Store last updated timestamp
let lastUpdated = {};

// Fetch 24K Gold Price from API
async function fetchGoldPrice24K() {
  try {
    // Using metals-api.com free tier
    const response = await axios.get('https://metals-api.com/api/latest', {
      params: {
        base: 'XAU',
        symbols: 'INR',
        access_key: 'process.env.METALS_API_KEY || default-key'
      }
    });
    
    // If API fails, use fallback with exchange rates
    if (!response.data.rates || !response.data.rates.INR) {
      return await fallbackGoldPrice();
    }
    
    // Metals API returns price per troy ounce
    // Convert to grams: 1 troy oz = 31.1035 grams
    const pricePerTroyOz = response.data.rates.INR;
    const pricePerGram = pricePerTroyOz / 31.1035;
    
    lastUpdated.gold = new Date();
    return {
      price: Math.round(pricePerGram * 100) / 100,
      timestamp: lastUpdated.gold,
      purity: '24K'
    };
  } catch (error) {
    console.error('Gold API Error:', error.message);
    return await fallbackGoldPrice();
  }
}

// Fallback gold price using exchange rates
async function fallbackGoldPrice() {
  try {
    // Gold price in USD per troy oz (approximate current market)
    const goldPriceUSD = 1950; // Example price
    
    // Get USD to INR rate
    const rateResponse = await axios.get('https://open.er-api.com/v6/latest/USD');
    const usdToInr = rateResponse.data.rates.INR;
    
    // Convert to INR
    const pricePerTroyOz = goldPriceUSD * usdToInr;
    const pricePerGram = pricePerTroyOz / 31.1035;
    
    lastUpdated.gold = new Date();
    return {
      price: Math.round(pricePerGram * 100) / 100,
      timestamp: lastUpdated.gold,
      purity: '24K'
    };
  } catch (error) {
    console.error('Fallback Gold API Error:', error.message);
    return {
      price: 0,
      error: 'Unable to fetch gold price',
      timestamp: new Date()
    };
  }
}

// Convert 24K to 22K gold price
function convert24KTo22K(price24K) {
  // 22K is 91.67% pure gold
  return (price24K / 24) * 22;
}

// API Endpoint: Get 22K Gold Price
app.get('/api/prices/gold-22k', async (req, res) => {
  try {
    let cachedPrice = cache.get('gold_22k');
    
    if (cachedPrice) {
      return res.json(cachedPrice);
    }
    
    const gold24K = await fetchGoldPrice24K();
    const gold22K = convert24KTo22K(gold24K.price);
    
    const result = {
      price: Math.round(gold22K * 100) / 100,
      purity: '22K',
      currency: 'INR',
      unit: 'per gram',
      timestamp: gold24K.timestamp,
      lastUpdated: lastUpdated.gold
    };
    
    cache.set('gold_22k', result);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gold price', details: error.message });
  }
});

// Fetch Silver Price
async function fetchSilverPrice() {
  try {
    // Using free exchange rate API for silver calculation
    const response = await axios.get('https://api.metals.live/v1/spot/silver');
    
    if (!response.data || !response.data.price) {
      return await fallbackSilverPrice();
    }
    
    // Price is in USD per troy ounce
    const silverPriceUSD = response.data.price;
    
    // Get USD to INR rate
    const rateResponse = await axios.get('https://open.er-api.com/v6/latest/USD');
    const usdToInr = rateResponse.data.rates.INR;
    
    // Convert to INR per gram
    const pricePerTroyOz = silverPriceUSD * usdToInr;
    const pricePerGram = pricePerTroyOz / 31.1035;
    
    lastUpdated.silver = new Date();
    return {
      price: Math.round(pricePerGram * 100) / 100,
      timestamp: lastUpdated.silver
    };
  } catch (error) {
    console.error('Silver API Error:', error.message);
    return await fallbackSilverPrice();
  }
}

// Fallback silver price
async function fallbackSilverPrice() {
  try {
    const silverPriceUSD = 25; // Example price per troy oz
    const rateResponse = await axios.get('https://open.er-api.com/v6/latest/USD');
    const usdToInr = rateResponse.data.rates.INR;
    
    const pricePerTroyOz = silverPriceUSD * usdToInr;
    const pricePerGram = pricePerTroyOz / 31.1035;
    
    lastUpdated.silver = new Date();
    return {
      price: Math.round(pricePerGram * 100) / 100,
      timestamp: lastUpdated.silver
    };
  } catch (error) {
    return { price: 0, error: 'Unable to fetch silver price' };
  }
}

// API Endpoint: Get Silver Price
app.get('/api/prices/silver', async (req, res) => {
  try {
    let cachedPrice = cache.get('silver');
    
    if (cachedPrice) {
      return res.json(cachedPrice);
    }
    
    const silver = await fetchSilverPrice();
    
    const result = {
      price: silver.price,
      currency: 'INR',
      unit: 'per gram',
      timestamp: silver.timestamp,
      lastUpdated: lastUpdated.silver
    };
    
    cache.set('silver', result);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch silver price', details: error.message });
  }
});

// Fetch USD to INR Exchange Rate
async function fetchUSDtoINR() {
  try {
    const response = await axios.get('https://open.er-api.com/v6/latest/USD');
    
    if (!response.data || !response.data.rates || !response.data.rates.INR) {
      throw new Error('Invalid response from API');
    }
    
    lastUpdated.usdInr = new Date();
    return {
      rate: parseFloat(response.data.rates.INR.toFixed(2)),
      timestamp: lastUpdated.usdInr
    };
  } catch (error) {
    console.error('USD-INR API Error:', error.message);
    // Return fallback rate
    lastUpdated.usdInr = new Date();
    return {
      rate: 83.50,
      timestamp: lastUpdated.usdInr,
      isFallback: true
    };
  }
}

// API Endpoint: Get USD to INR Exchange Rate
app.get('/api/prices/usd-inr', async (req, res) => {
  try {
    let cachedRate = cache.get('usd_inr');
    
    if (cachedRate) {
      return res.json(cachedRate);
    }
    
    const usdInr = await fetchUSDtoINR();
    
    const result = {
      from: 'USD',
      to: 'INR',
      rate: usdInr.rate,
      display: `1 USD = ₹${usdInr.rate} INR`,
      timestamp: usdInr.timestamp,
      lastUpdated: lastUpdated.usdInr,
      isFallback: usdInr.isFallback || false
    };
    
    cache.set('usd_inr', result);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exchange rate', details: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
    lastUpdates: lastUpdated
  });
});

// Get all prices at once
app.get('/api/prices/all', async (req, res) => {
  try {
    const [gold22K, silver, usdInr] = await Promise.all([
      (async () => {
        const gold24K = await fetchGoldPrice24K();
        return { price: convert24KTo22K(gold24K.price), timestamp: gold24K.timestamp };
      })(),
      fetchSilverPrice(),
      fetchUSDtoINR()
    ]);
    
    const result = {
      gold22k: {
        price: Math.round(gold22K.price * 100) / 100,
        currency: 'INR',
        unit: 'per gram',
        purity: '22K'
      },
      silver: {
        price: silver.price,
        currency: 'INR',
        unit: 'per gram'
      },
      usdInr: {
        rate: usdInr.rate,
        display: `1 USD = ₹${usdInr.rate} INR`
      },
      timestamp: new Date(),
      cacheValidFor: '60 seconds'
    };
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch prices', details: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`AK Space Price Server running on port ${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`  GET /api/prices/gold-22k`);
  console.log(`  GET /api/prices/silver`);
  console.log(`  GET /api/prices/usd-inr`);
  console.log(`  GET /api/prices/all`);
  console.log(`  GET /api/health`);
});

module.exports = app;
