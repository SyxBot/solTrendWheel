# Narrative Wheel Coin 🎡

A live visualization of trending crypto narratives connected to a Pump.fun token. The token's on-chain activity (holders, liquidity, volume) directly controls the visual behavior of a "Narrative Wheel" UI.

## 🎯 Project Overview

The Narrative Wheel Coin creates a dynamic, community-driven visualization where:

- **Frontend**: D3.js radial wheel showing trending crypto narratives
- **Backend**: Node.js service aggregating data from Helius, DexScreener, and other sources
- **Token Integration**: $WHEEL token on Pump.fun that keeps the visualization alive
- **Streaming Ready**: Browser source compatible for OBS/streaming

## 🏗️ System Architecture

```
Frontend (D3.js Wheel) ↔ Backend API (/api/wheel-state) ↔ On-chain APIs (Helius, DexScreener)
```

### Visual States
- **Alive**: Full wheel brightness (sufficient holders + liquidity)
- **Stressed**: Dim wheel with heartbeat animation (low liquidity warning)
- **Dead**: Fading wheel with CTA to buy $WHEEL (no holders or liquidity)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone and install dependencies
cd wheel-coin
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys
```

### Development

```bash
# Start backend server (port 3000)
npm run dev

# In another terminal, start frontend development server (port 8080)  
npm run frontend

# Or run backend only
npm start
```

### Environment Variables

Create a `.env` file:

```env
# Helius RPC
HELIUS_API_KEY=your_helius_key_here

# DexScreener (optional, uses public API)
DEXSCREENER_API_KEY=your_key_here

# Token Configuration
WHEEL_TOKEN_MINT=your_pump_fun_token_mint_here

# Thresholds
MIN_HOLDERS=1
MIN_LIQUIDITY_USD=1000
STRESSED_LIQUIDITY_USD=5000
```

## 📁 Project Structure

```
wheel-coin/
├── backend/                 # Node.js API server
│   └── index.js            # Main server with data aggregation
├── frontend/               # D3.js visualization (future)
├── public/                 # Static assets and HTML
│   └── index.html         # Main wheel interface
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables
└── README.md             # This file
```

## 🔌 API Endpoints

### GET /health
Health check endpoint
```json
{
  "status": "ok",
  "timestamp": "2025-10-21T15:30:00.000Z",
  "uptime": 1234.56
}
```

### GET /api/wheel-state
Main wheel data endpoint
```json
{
  "success": true,
  "data": {
    "status": "alive",
    "lastUpdate": "2025-10-21T15:30:00.000Z",
    "narratives": {
      "AI": { "score": 85, "volume": 1250000, "mentions": 42 },
      "Dogs": { "score": 72, "volume": 890000, "mentions": 28 }
    },
    "tokenData": {
      "holders": 156,
      "liquidity": 45000,
      "volume24h": 125000
    }
  }
}
```

## 🎨 Frontend Implementation

The frontend will feature:
- **D3.js radial wheel** with narrative segments
- **Real-time updates** every 60 seconds
- **State animations** (alive/stressed/dead)
- **$WHEEL branding** in center
- **Responsive design** for streaming

## 📊 Data Sources

1. **Helius API** - Token holder data via getTokenLargestAccounts
2. **DexScreener API** - Token profiles, liquidity, and volume data  
3. **Birdeye API** - Trending signals and metadata (optional)
4. **Pump.fun tracking** - Direct on-chain monitoring

## 🔄 Data Aggregation Logic

Runs every 60 seconds via cron job:

1. Fetch token holder count (Helius)
2. Get liquidity and volume data (DexScreener) 
3. Pull trending narrative signals (Birdeye)
4. Calculate weighted narrative scores
5. Determine wheel state based on thresholds
6. Cache results for frontend consumption

## 🎯 Monetization Strategy

- **Primary**: $WHEEL token sales on Pump.fun keep visualization alive
- **Secondary**: Paid narrative exposure slots (payment in $WHEEL)
- **Optional**: On-wheel tipping for narrative highlighting

## 🚢 Deployment Options

### Replit (Recommended for MVP)
- Fast iteration and free hosting
- Built-in cron job support
- Easy frontend/backend deployment

### Alternative Platforms
- **Vercel** - Frontend hosting
- **Railway/Render** - Backend hosting
- **MongoDB Atlas** - Data caching (if needed)

## 🛡️ Security Considerations

- Rate limiting for API endpoints
- Input validation and sanitization
- Multi-source data aggregation to prevent manipulation
- Clear disclaimers about investment risks

## 📋 Development Phases

### Phase 1: MVP Backend ✅
- [x] Express server setup
- [x] Basic API endpoints
- [x] Simulated data aggregation
- [x] Cron job scheduling

### Phase 2: D3.js Frontend (Next)
- [ ] HTML/CSS/JS wheel interface
- [ ] D3.js radial visualization  
- [ ] Real-time data fetching
- [ ] State animations

### Phase 3: Data Integration
- [ ] Helius API integration
- [ ] DexScreener token profiles
- [ ] Narrative scoring algorithm
- [ ] Error handling and fallbacks  

### Phase 4: Token Launch
- [ ] Create $WHEEL on Pump.fun
- [ ] Test holder-driven states
- [ ] Community engagement

### Phase 5: Production Polish
- [ ] OBS streaming integration
- [ ] Performance optimization
- [ ] Analytics and monitoring

## 🤝 Contributing

This is an experimental project. Contributions welcome!

## ⚠️ Disclaimer

This is experimental software. Do not invest more than you can afford to lose. This project is for educational and entertainment purposes.

## 📄 License

MIT License - see LICENSE file for details