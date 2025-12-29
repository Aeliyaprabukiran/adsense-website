# Real-Time Price Integration Setup Guide

## Overview
This guide explains how to integrate real-time gold, silver, and USD-INR prices into the AK Space website using the Node.js backend server.

## What Has Been Done

✅ **Backend Server Created** (server.js)
- Express.js REST API
- Three main endpoints:
  - `/api/prices/gold-22k` - 22K gold price in INR per gram
  - `/api/prices/silver` - Silver price in INR per gram
  - `/api/prices/usd-inr` - USD to INR exchange rate
- 60-second caching to prevent API abuse
- Fallback mechanisms for API failures
- Free public APIs integration (no paid subscriptions)

✅ **Dependencies** (package.json)
- express: HTTP framework
- cors: Cross-origin support
- axios: HTTP client for API calls
- node-cache: In-memory caching

## What Still Needs to be Done

### 1. Update Frontend JavaScript (script.js)

Replace the current `refreshPrices()` function and the mock fetch functions with calls to your backend API.

**Current Code (Lines 51-64 in script.js):**
```javascript
function fetchGoldPrice() {
  return Promise.resolve(6500 + Math.random() * 100);
}
function fetchSilverPrice() {
  return Promise.resolve(75 + Math.random() * 5);
}
function fetchUSDtoINR() {
  return Promise.resolve(83.50 + Math.random() * 0.5);
}
```

**Replace With:**
```javascript
// Configuration
const API_BASE_URL = 'http://localhost:3000'; // Change to your deployed server URL

function fetchGoldPrice() {
  return fetch(`${API_BASE_URL}/api/prices/gold-22k`)
    .then(res => res.json())
    .then(data => data.price)
    .catch(err => {
      console.error('Gold API Error:', err);
      return 0;
    });
}

function fetchSilverPrice() {
  return fetch(`${API_BASE_URL}/api/prices/silver`)
    .then(res => res.json())
    .then(data => data.price)
    .catch(err => {
      console.error('Silver API Error:', err);
      return 0;
    });
}

function fetchUSDtoINR() {
  return fetch(`${API_BASE_URL}/api/prices/usd-inr`)
    .then(res => res.json())
    .then(data => data.rate)
    .catch(err => {
      console.error('USD-INR API Error:', err);
      return 83.50;
    });
}
```

### 2. Update HTML to Show Loading State

Add a loading spinner to the price cards:

**In index.html, modify the price display section:**
```html
<div class="price-value" id="gold-price">
  <span class="loading-spinner"></span>
  <span id="gold-price-value">₹0.00/g</span>
</div>
<p class="price-unit" id="gold-updated">Last updated: --</p>
```

### 3. Add CSS for Loading Spinner

**Add to styles.css:**
```css
.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.price-value.loading {
  opacity: 0.6;
}
```

## Deployment Options

### Option 1: Local Development
```bash
cd your-project-directory
npm install
node server.js
```
Server will run on http://localhost:3000

### Option 2: Deploy on Railway.app
1. Push code to GitHub
2. Go to railway.app
3. Create new project
4. Connect GitHub repo
5. Railway will auto-detect Node.js
6. Set environment variable: `PORT=3000`
7. Get your public URL (e.g., yourapp.railway.app)

### Option 3: Deploy on Render.com
1. Push code to GitHub
2. Go to render.com
3. Create new Web Service
4. Connect GitHub repo
5. Build command: `npm install`
6. Start command: `node server.js`
7. Set environment PORT variable
8. Get your public URL

### Option 4: Deploy on Heroku (Free tier ended, but instructions remain)
```bash
heroku create your-app-name
git push heroku main
```

## API Endpoints

### GET /api/prices/gold-22k
**Response:**
```json
{
  "price": 6245.50,
  "purity": "22K",
  "currency": "INR",
  "unit": "per gram",
  "timestamp": "2025-01-20T12:34:56.789Z",
  "lastUpdated": "2025-01-20T12:34:56.789Z"
}
```

### GET /api/prices/silver
**Response:**
```json
{
  "price": 75.50,
  "currency": "INR",
  "unit": "per gram",
  "timestamp": "2025-01-20T12:34:56.789Z",
  "lastUpdated": "2025-01-20T12:34:56.789Z"
}
```

### GET /api/prices/usd-inr
**Response:**
```json
{
  "from": "USD",
  "to": "INR",
  "rate": 83.45,
  "display": "1 USD = ₹83.45 INR",
  "timestamp": "2025-01-20T12:34:56.789Z",
  "lastUpdated": "2025-01-20T12:34:56.789Z",
  "isFallback": false
}
```

## Free APIs Used

1. **metals-api.com** - Gold/Silver prices (free tier)
2. **api.metals.live** - Fallback metal prices (free)
3. **open.er-api.com** - Currency exchange (free, no API key needed)

## Auto-Refresh Every 60 Seconds

The current `setInterval(refreshPrices, 5 * 60 * 1000)` refreshes prices every 5 minutes. To match the backend cache:

```javascript
// Change to refresh every 60 seconds (server cache time)
setInterval(refreshPrices, 60 * 1000);
```

## Troubleshooting

### Issue: CORS Errors
**Solution:** Ensure server has CORS enabled (already in server.js)

### Issue: API returns 0 prices
**Solution:** Check if external API is available. Fallback should return mock prices.

### Issue: Prices not updating
**Solution:** Check browser console for fetch errors. Verify API_BASE_URL is correct.

## Next Steps

1. Run the server locally: `node server.js`
2. Update script.js with real API calls
3. Test locally at http://localhost:3000
4. Deploy server to Railway/Render
5. Update API_BASE_URL in script.js with deployed server URL
6. Test from live website

## Performance Notes

- **Cache Duration:** 60 seconds (configurable in server.js)
- **Fallback Mechanism:** If any API fails, uses fallback prices
- **No Rate Limiting Issues:** Free APIs have generous rate limits
- **Response Time:** ~500ms-1s typically

## Security

- No API keys stored in frontend code
- Server-side API calls only
- CORS configured to allow specific origins
- Input validation on all endpoints

## Questions?

Refer to the server.js file for detailed implementation notes.
