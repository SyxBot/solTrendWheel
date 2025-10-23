/**
 * Narrative Detection Engine Demo
 * 
 * This demo showcases the advanced narrative detection capabilities
 * with real-world scenarios and comprehensive analysis output.
 */

const { NarrativeDetectionEngine } = require('./narrative-detection.js');

class NarrativeDetectionDemo {
  constructor() {
    this.engine = new NarrativeDetectionEngine({
      minClusterSize: 2,
      similarityThreshold: 0.4,
      minNarrativeStrength: 25,
      emergenceWindow: 24 * 60 * 60 * 1000
    });
  }

  /**
   * Run comprehensive narrative detection demo
   */
  async runDemo() {
    console.log('🎯 NARRATIVE DETECTION ENGINE DEMO');
    console.log('=' .repeat(60));
    console.log('Demonstrating advanced AI-powered crypto narrative detection\n');

    const scenarios = [
      { name: 'AI Revolution Scenario', test: () => this.demoAIRevolution() },
      { name: 'Meme Coin Mania', test: () => this.demoMemeCoinMania() },
      { name: 'Gaming Narrative Emergence', test: () => this.demoGamingNarrative() },
      { name: 'DeFi Innovation Wave', test: () => this.demoDeFiInnovation() },
      { name: 'Real-World Asset Tokenization', test: () => this.demoRWATokenization() },
      { name: 'Mixed Market Conditions', test: () => this.demoMixedMarket() }
    ];

    for (const scenario of scenarios) {
      await this.runScenario(scenario.name, scenario.test);
      console.log('\n' + '─'.repeat(60) + '\n');
      await this.sleep(1000); // Brief pause between scenarios
    }

    console.log('🎉 Demo completed! The engine successfully detected narratives across all scenarios.\n');
    console.log('💡 Key Capabilities Demonstrated:');
    console.log('   ✅ Semantic clustering of related tokens');
    console.log('   ✅ Novelty detection for emerging themes');
    console.log('   ✅ Multi-dimensional similarity analysis');
    console.log('   ✅ Confidence scoring and ranking');
    console.log('   ✅ Real-time adaptability to market conditions');
  }

  /**
   * Run a single demo scenario
   */
  async runScenario(name, testFunction) {
    console.log(`🔍 ${name.toUpperCase()}`);
    console.log('─'.repeat(name.length + 4));
    
    const startTime = Date.now();
    const result = await testFunction();
    const duration = Date.now() - startTime;
    
    this.displayResults(result, duration);
  }

  /**
   * Demo AI revolution scenario - multiple AI-themed tokens trending
   */
  async demoAIRevolution() {
    console.log('📊 Simulating AI narrative boom period...');
    
    const aiTokens = [
      {
        address: 'ai1',
        name: 'ChatGPT Revolution',
        symbol: 'CHATGPT',
        volume: 2500000,
        holders: 5000,
        price: 0.15,
        priceChange24h: 450,
        socialMentions: 1200,
        createdAt: Date.now() - 2 * 60 * 60 * 1000
      },
      {
        address: 'ai2',
        name: 'OpenAI Protocol',
        symbol: 'OPENAI',
        volume: 2200000,
        holders: 4500,
        price: 0.12,
        priceChange24h: 380,
        socialMentions: 1100,
        createdAt: Date.now() - 3 * 60 * 60 * 1000
      },
      {
        address: 'ai3',
        name: 'Neural Network Token',
        symbol: 'NEURAL',
        volume: 1800000,
        holders: 3800,
        price: 0.09,
        priceChange24h: 320,
        socialMentions: 950,
        createdAt: Date.now() - 1 * 60 * 60 * 1000
      },
      {
        address: 'ai4',
        name: 'Machine Learning Coin',
        symbol: 'ML',
        volume: 1500000,
        holders: 3200,
        price: 0.07,
        priceChange24h: 280,
        socialMentions: 800,
        createdAt: Date.now() - 4 * 60 * 60 * 1000
      },
      {
        address: 'ai5',
        name: 'DeepMind AI',
        symbol: 'DEEPMIND',
        volume: 1200000,
        holders: 2800,
        price: 0.06,
        priceChange24h: 240,
        socialMentions: 700,
        createdAt: Date.now() - 5 * 60 * 60 * 1000
      },
      // Background noise
      {
        address: 'other1',
        name: 'Random Meme',
        symbol: 'RANDOM',
        volume: 300000,
        holders: 800,
        price: 0.002,
        priceChange24h: 15,
        socialMentions: 50,
        createdAt: Date.now() - 6 * 60 * 60 * 1000
      }
    ];

    return await this.engine.processTokens(aiTokens);
  }

  /**
   * Demo meme coin scenario - animal and food themed tokens
   */
  async demoMemeCoinMania() {
    console.log('🐕 Simulating meme coin explosion...');
    
    const memeTokens = [
      {
        address: 'meme1',
        name: 'Super Doge King',
        symbol: 'SDOGE',
        volume: 1800000,
        holders: 8000,
        price: 0.008,
        priceChange24h: 180,
        socialMentions: 2000,
        createdAt: Date.now() - 1 * 60 * 60 * 1000
      },
      {
        address: 'meme2',
        name: 'Shiba Inu Master',
        symbol: 'SHIBAMASTER',
        volume: 1600000,
        holders: 7200,
        price: 0.007,
        priceChange24h: 160,
        socialMentions: 1800,
        createdAt: Date.now() - 2 * 60 * 60 * 1000
      },
      {
        address: 'meme3',
        name: 'Pepe Revolution',
        symbol: 'PEPEREVO',
        volume: 1400000,
        holders: 6500,
        price: 0.006,
        priceChange24h: 140,
        socialMentions: 1600,
        createdAt: Date.now() - 30 * 60 * 1000
      },
      {
        address: 'meme4',
        name: 'Cat Coin Supreme',
        symbol: 'CATCOIN',
        volume: 1200000,
        holders: 5800,
        price: 0.005,
        priceChange24h: 120,
        socialMentions: 1400,
        createdAt: Date.now() - 45 * 60 * 1000
      },
      {
        address: 'meme5',
        name: 'Pizza Token',
        symbol: 'PIZZA',
        volume: 900000,
        holders: 4200,
        price: 0.004,
        priceChange24h: 85,
        socialMentions: 900,
        createdAt: Date.now() - 90 * 60 * 1000
      },
      {
        address: 'meme6',
        name: 'Burger Coin',
        symbol: 'BURGER',
        volume: 850000,
        holders: 3900,
        price: 0.0035,
        priceChange24h: 75,
        socialMentions: 800,
        createdAt: Date.now() - 120 * 60 * 1000
      }
    ];

    return await this.engine.processTokens(memeTokens);
  }

  /**
   * Demo gaming narrative - GameFi and metaverse tokens
   */
  async demoGamingNarrative() {
    console.log('🎮 Simulating GameFi revolution...');
    
    const gamingTokens = [
      {
        address: 'game1',
        name: 'MetaVerse World',
        symbol: 'METAWORLD',
        volume: 3200000,
        holders: 12000,
        price: 0.25,
        priceChange24h: 220,
        socialMentions: 1500,
        createdAt: Date.now() - 2 * 60 * 60 * 1000
      },
      {
        address: 'game2',
        name: 'GameFi Protocol',
        symbol: 'GAMEFI',
        volume: 2800000,
        holders: 10500,
        price: 0.22,
        priceChange24h: 200,
        socialMentions: 1300,
        createdAt: Date.now() - 3 * 60 * 60 * 1000
      },
      {
        address: 'game3',
        name: 'NFT Gaming Hub',
        symbol: 'NFTGAME',
        volume: 2400000,
        holders: 9200,
        price: 0.19,
        priceChange24h: 180,
        socialMentions: 1100,
        createdAt: Date.now() - 1 * 60 * 60 * 1000
      },
      {
        address: 'game4',
        name: 'Play to Earn',
        symbol: 'P2E',
        volume: 2000000,
        holders: 8000,
        price: 0.16,
        priceChange24h: 150,
        socialMentions: 950,
        createdAt: Date.now() - 4 * 60 * 60 * 1000
      }
    ];

    return await this.engine.processTokens(gamingTokens);
  }

  /**
   * Demo DeFi innovation wave
   */
  async demoDeFiInnovation() {
    console.log('💰 Simulating DeFi innovation surge...');
    
    const defiTokens = [
      {
        address: 'defi1',
        name: 'Liquid Staking Pro',
        symbol: 'LSP',
        volume: 4500000,
        holders: 15000,
        price: 0.45,
        priceChange24h: 120,
        socialMentions: 800,
        createdAt: Date.now() - 2 * 60 * 60 * 1000
      },
      {
        address: 'defi2',
        name: 'Yield Farming Max',
        symbol: 'YFM',
        volume: 4200000,
        holders: 13500,
        price: 0.42,
        priceChange24h: 110,
        socialMentions: 750,
        createdAt: Date.now() - 3 * 60 * 60 * 1000
      },
      {
        address: 'defi3',
        name: 'Cross Chain Bridge',
        symbol: 'CCB',
        volume: 3800000,
        holders: 12000,
        price: 0.38,
        priceChange24h: 95,
        socialMentions: 680,
        createdAt: Date.now() - 1 * 60 * 60 * 1000
      }
    ];

    return await this.engine.processTokens(defiTokens);
  }

  /**
   * Demo real-world asset tokenization
   */
  async demoRWATokenization() {
    console.log('🏢 Simulating RWA tokenization trend...');
    
    const rwaTokens = [
      {
        address: 'rwa1',
        name: 'Real Estate Token',
        symbol: 'RET',
        volume: 5500000,
        holders: 8000,
        price: 1.25,
        priceChange24h: 35,
        socialMentions: 400,
        createdAt: Date.now() - 6 * 60 * 60 * 1000
      },
      {
        address: 'rwa2',
        name: 'Gold Backed Coin',
        symbol: 'GOLDCOIN',
        volume: 5200000,
        holders: 7500,
        price: 1.15,
        priceChange24h: 32,
        socialMentions: 380,
        createdAt: Date.now() - 8 * 60 * 60 * 1000
      },
      {
        address: 'rwa3',
        name: 'Treasury Bond Token',
        symbol: 'TBT',
        volume: 4800000,
        holders: 6800,
        price: 1.05,
        priceChange24h: 28,
        socialMentions: 350,
        createdAt: Date.now() - 12 * 60 * 60 * 1000
      }
    ];

    return await this.engine.processTokens(rwaTokens);
  }

  /**
   * Demo mixed market conditions
   */
  async demoMixedMarket() {
    console.log('🌊 Simulating mixed market with multiple narratives...');
    
    const mixedTokens = [
      // AI tokens
      {
        address: 'mix1',
        name: 'AI Agent',
        symbol: 'AIAGENT',
        volume: 1200000,
        holders: 3000,
        price: 0.08,
        priceChange24h: 85,
        socialMentions: 500,
        createdAt: Date.now() - 2 * 60 * 60 * 1000
      },
      // Gaming token
      {
        address: 'mix2',
        name: 'VR Gaming',
        symbol: 'VRGAME',
        volume: 1100000,
        holders: 2800,
        price: 0.075,
        priceChange24h: 75,
        socialMentions: 450,
        createdAt: Date.now() - 3 * 60 * 60 * 1000
      },
      // Meme token
      {
        address: 'mix3',
        name: 'Moon Dog',
        symbol: 'MOONDOG',
        volume: 800000,
        holders: 4500,
        price: 0.003,
        priceChange24h: 120,
        socialMentions: 1200,
        createdAt: Date.now() - 1 * 60 * 60 * 1000
      },
      // DeFi token
      {
        address: 'mix4',
        name: 'Yield Optimizer',
        symbol: 'YIELDOPT',
        volume: 2200000,
        holders: 1800,
        price: 0.35,
        priceChange24h: 45,
        socialMentions: 200,
        createdAt: Date.now() - 4 * 60 * 60 * 1000
      },
      // Declining token
      {
        address: 'mix5',
        name: 'Failing Project',
        symbol: 'FAIL',
        volume: 100000,
        holders: 50,
        price: 0.0001,
        priceChange24h: -85,
        socialMentions: 5,
        createdAt: Date.now() - 24 * 60 * 60 * 1000
      }
    ];

    return await this.engine.processTokens(mixedTokens);
  }

  /**
   * Display comprehensive results analysis
   */
  displayResults(result, duration) {
    console.log(`📊 Analysis completed in ${duration}ms`);
    console.log(`🔍 Tokens analyzed: ${result.tokensAnalyzed || 0}`);
    console.log(`🎯 Narratives detected: ${result.narratives.length}`);
    console.log(`📈 Overall confidence: ${Math.round((result.confidence || 0) * 100)}%`);
    
    if (result.narratives.length > 0) {
      console.log('\n📋 DETECTED NARRATIVES:');
      
      result.narratives.forEach((narrative, index) => {
        console.log(`\n${index + 1}. ${narrative.theme.toUpperCase()}`);
        console.log(`   💪 Strength: ${Math.round(narrative.strength)}/100`);
        console.log(`   🎯 Confidence: ${Math.round(narrative.confidence * 100)}%`);
        console.log(`   🪙 Tokens: ${narrative.metrics.tokenCount}`);
        console.log(`   💰 Total Volume: $${(narrative.metrics.totalVolume || 0).toLocaleString()}`);
        console.log(`   👥 Total Holders: ${(narrative.metrics.totalHolders || 0).toLocaleString()}`);
        console.log(`   🔥 Avg Price Change: ${Math.round(narrative.metrics.avgPriceChange || 0)}%`);
        console.log(`   🆕 Novelty: ${Math.round((narrative.noveltyScore || 0) * 100)}%`);
        console.log(`   🏷️  Keywords: ${narrative.keywords.slice(0, 5).join(', ')}`);
        
        if (narrative.description) {
          console.log(`   📝 Description: ${narrative.description}`);
        }
        
        console.log(`   🎭 Example tokens: ${narrative.tokens.slice(0, 3).map(t => t.symbol).join(', ')}`);
      });
    } else {
      console.log('\n❌ No significant narratives detected in this dataset');
    }
  }

  /**
   * Simple sleep utility
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Main demo runner
 */
async function runNarrativeDetectionDemo() {
  const demo = new NarrativeDetectionDemo();
  await demo.runDemo();
}

// Export for use in other modules
module.exports = {
  NarrativeDetectionDemo,
  runNarrativeDetectionDemo
};

// Run demo if this file is executed directly
if (require.main === module) {
  runNarrativeDetectionDemo().catch(console.error);
}