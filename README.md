# Sol TrendWheel 🎡

A real-time Solana narrative tracking application that visualizes crypto market trends through an interactive spinning wheel interface.

## ✨ Features

- **Real-time Narrative Detection**: AI-powered analysis of Pump.fun and DexScreener tokens
- **Interactive Wheel Visualization**: Dynamic D3.js wheel showing narrative strength and trends
- **Premium Narrative Names**: Professional naming system (AI Agent Revolution, Cat Meta Rise, etc.)
- **Live Market Data**: Integration with multiple APIs for up-to-date token information
- **Solana-Focused**: Specialized for the Solana ecosystem
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Premium Narratives

The system detects and categorizes tokens into sophisticated narrative themes:

- **AI Agent Revolution** - AI and machine learning tokens
- **Cat Meta Rise** - Cat-themed meme tokens
- **Pepe Renaissance** - Pepe and frog-themed tokens
- **Creator Capital Market** - Creator economy tokens
- **Polymarket Meta** - Prediction market tokens
- **Trenches** - War and battle-themed tokens
- **DeFi Infrastructure** - Decentralized finance protocols
- **Ape Season** - Ape-themed tokens
- **Comedy Meta** - Humor and joke tokens
- **Color Aesthetics** - Color-themed tokens

## 🛠️ Tech Stack

- **Backend**: Node.js with Express
- **Frontend**: Vanilla JavaScript with D3.js
- **APIs**: Pump.fun, DexScreener, Helius
- **Real-time Updates**: Server-sent events
- **AI Processing**: Custom narrative detection engine

## 📁 Project Structure

```
wheel-coin/
├── backend/
│   ├── index.js                 # Main server file
│   ├── narrative-detection.js   # AI narrative detection engine
│   ├── clustering.js            # Token clustering algorithms
│   ├── scorer.js               # Narrative scoring system
│   └── package.json
├── frontend/
│   └── index.html              # Frontend interface
├── public/
│   └── index.html              # Alternative UI version
└── README.md
```

## 🔧 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd TRENDWHEEL2.0
```

2. Install dependencies:
```bash
cd wheel-coin/backend
npm install
```

3. Start the server:
```bash
node index.js
```

4. Open your browser to:
- Frontend: `http://localhost:3000/frontend`
- Public: `http://localhost:3000/public`
- API: `http://localhost:3000/api/wheel-state`

## 🔥 API Endpoints

- `GET /api/wheel-state` - Current wheel state and narratives
- `GET /api/narratives` - Detailed narrative analysis
- `GET /frontend` - Main frontend interface
- `GET /public` - Alternative public interface

## 🎯 How It Works

1. **Data Collection**: Fetches trending tokens from Pump.fun and DexScreener
2. **AI Analysis**: Processes token names and descriptions for narrative themes
3. **Scoring**: Calculates narrative strength based on volume, social mentions, and market data
4. **Visualization**: Renders real-time wheel with dynamic sizing and effects
5. **Updates**: Refreshes data every 30 seconds for live tracking

## 🌟 Key Features

### Real-time Narrative Detection
- Advanced AI analysis of token characteristics
- Pattern recognition for emerging trends
- Confidence scoring for narrative accuracy

### Dynamic Wheel Visualization
- Size-based representation of narrative strength
- Color-coded themes with lifecycle indicators
- Smooth animations and hover effects
- Mobile-responsive design

### Premium Data Integration
- Pump.fun API for trending tokens
- DexScreener for market data
- Helius for Solana token metadata
- Boost detection for promoted tokens

## 🚀 Deployment

The application is designed to run on any Node.js hosting service:

1. **Environment**: Node.js 16+ required
2. **Port**: Defaults to 3000 (configurable)
3. **Dependencies**: All listed in package.json
4. **APIs**: External API calls (no API keys required)

## 🔮 Future Enhancements

- [ ] Historical trend analysis
- [ ] Portfolio tracking integration
- [ ] Discord/Telegram notifications
- [ ] Advanced filtering options
- [ ] User-customizable narratives
- [ ] Mobile app version

## 📊 Performance

- Updates every 30 seconds
- Processes 15-50 tokens per cycle
- AI analysis in ~2-3 seconds
- Real-time rendering with D3.js
- Optimized for continuous operation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## ⚡ Live Demo

Experience the Sol TrendWheel live at: [Your deployed URL]

---

**Sol TrendWheel** - Real-time Solana narrative tracking for the modern crypto trader 🚀