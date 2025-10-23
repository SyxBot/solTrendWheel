/**
 * Narrative Detection Engine for Crypto Token Analysis
 * 
 * This module implements unsupervised learning algorithms to detect emerging
 * crypto narratives by analyzing token creation patterns, price movements,
 * social signals, and clustering similar tokens.
 */

const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

class NarrativeDetectionEngine {
  constructor(config = {}) {
    this.config = {
      // Clustering parameters
      minClusterSize: 3,
      maxClusters: 20,
      similarityThreshold: 0.7,
      
      // Time windows for analysis
      emergenceWindow: 24 * 60 * 60 * 1000, // 24 hours
      growthWindow: 7 * 24 * 60 * 60 * 1000, // 7 days
      declineThreshold: 14 * 24 * 60 * 60 * 1000, // 14 days
      
      // Scoring weights
      nameWeight: 0.3,
      priceWeight: 0.25,
      volumeWeight: 0.2,
      socialWeight: 0.15,
      holderWeight: 0.1,
      
      // Novelty detection parameters
      noveltyThreshold: 0.8,
      minNarrativeStrength: 50,
      
      ...config
    };
    
    // Cache for historical data and patterns
    this.tokenHistory = new Map();
    this.narrativeHistory = new Map();
    this.priceCache = new Map();
    this.socialCache = new Map();
    
    // Known narrative patterns (updated dynamically with comprehensive themes)
    this.knownPatterns = new Map([
      // AI & Technology
      ['ai', { keywords: ['ai', 'artificial', 'intelligence', 'ml', 'bot', 'neural', 'gpt', 'chat', 'brain', 'agent'], strength: 95 }],
      ['tech', { keywords: ['tech', 'digital', 'cyber', 'quantum', 'blockchain', 'crypto', 'protocol'], strength: 88 }],
      
      // Animals - Dogs
      ['dog', { keywords: ['dog', 'doge', 'shib', 'puppy', 'woof', 'bark', 'inu', 'husky', 'retriever'], strength: 88 }],
      
      // Animals - Cats
      ['cat', { keywords: ['cat', 'kitty', 'meow', 'feline', 'purr', 'kitten', 'tiger', 'lion', 'panther'], strength: 75 }],
      
      // Animals - Frogs
      ['frog', { keywords: ['frog', 'pepe', 'toad', 'ribbit', 'pond', 'lily', 'hop', 'amphibian'], strength: 82 }],
      
      // Memes & Internet Culture
      ['meme', { keywords: ['meme', 'wojak', 'chad', 'kek', 'lol', 'joke', 'funny', 'humor', 'comedy', 'based', 'sigma', 'trenches'], strength: 82 }],
      ['viral', { keywords: ['viral', 'trending', 'popular', 'famous', 'hit', 'sensation', 'buzz'], strength: 70 }],
      
      // Finance & Trading - Enhanced with specific narratives
      ['defi', { keywords: ['defi', 'yield', 'farm', 'stake', 'liquidity', 'pool', 'protocol', 'restaking', 'tvl'], strength: 70 }],
      ['rwa', { keywords: ['rwa', 'real', 'world', 'asset', 'tokenized', 'estate', 'property', 'commodity', 'physical'], strength: 88 }],
      ['bridge', { keywords: ['bridge', 'cross', 'chain', 'router', 'multichain', 'interchain', 'crosschain'], strength: 82 }],
      ['dex', { keywords: ['dex', 'exchange', 'swap', 'amm', 'aggregator', 'orderbook', 'spot', 'slippage', 'volume'], strength: 80 }],
      ['perp', { keywords: ['perp', 'perpetual', 'futures', 'leverage', 'margin', 'derivative', 'long', 'short', 'funding', 'liquidation'], strength: 85 }],
      ['trading', { keywords: ['trade', 'trading', 'pump', 'screen', 'chart', 'technical', 'analysis', 'market', 'degen'], strength: 75 }],
      ['finance', { keywords: ['creator', 'capital', 'market', 'ccm', 'payfi', 'institutional', 'treasury', 'wealth'], strength: 90 }],
      ['prediction', { keywords: ['polymarket', 'predict', 'betting', 'odds', 'forecast', 'election', 'outcome'], strength: 85 }],
      ['money', { keywords: ['money', 'cash', 'dollar', 'rich', 'wealth', 'profit', 'gains', 'moon'], strength: 65 }],
      
      // Gaming & Entertainment
      ['gaming', { keywords: ['game', 'play', 'nft', 'metaverse', 'virtual', 'rpg', 'quest', 'level'], strength: 65 }],
      ['sports', { keywords: ['sport', 'football', 'soccer', 'basketball', 'team', 'player', 'champion'], strength: 60 }],
      
      // Food & Lifestyle
      ['food', { keywords: ['food', 'burger', 'pizza', 'cake', 'restaurant', 'cook', 'chef', 'eat'], strength: 45 }],
      ['drink', { keywords: ['drink', 'beer', 'wine', 'coffee', 'tea', 'juice', 'cocktail', 'bar'], strength: 40 }],
      
      // People & Characters
      ['people', { keywords: ['people', 'person', 'human', 'man', 'woman', 'guy', 'girl', 'friend'], strength: 50 }],
      ['celebrity', { keywords: ['celebrity', 'star', 'famous', 'actor', 'singer', 'influencer', 'icon'], strength: 60 }],
      ['cartoon', { keywords: ['cartoon', 'animation', 'character', 'simpson', 'anime', 'manga', 'comic'], strength: 55 }],
      
      // Politics & Social
      ['politics', { keywords: ['politic', 'government', 'president', 'vote', 'election', 'policy', 'law'], strength: 65 }],
      ['social', { keywords: ['social', 'community', 'group', 'together', 'unite', 'collective', 'public'], strength: 50 }],
      
      // Work & Business
      ['work', { keywords: ['work', 'job', 'career', 'business', 'office', 'employee', 'boss', 'company'], strength: 55 }],
      ['quit', { keywords: ['quit', 'resign', 'leave', 'exit', 'escape', 'freedom', 'retirement'], strength: 60 }],
      
      // Nature & Environment
      ['nature', { keywords: ['nature', 'tree', 'forest', 'ocean', 'mountain', 'earth', 'green', 'organic'], strength: 45 }],
      ['space', { keywords: ['space', 'mars', 'moon', 'rocket', 'astronaut', 'galaxy', 'universe', 'cosmic'], strength: 70 }],
      
      // Abstract Concepts
      ['power', { keywords: ['power', 'strong', 'force', 'energy', 'mighty', 'big', 'giant', 'super'], strength: 65 }],
      ['speed', { keywords: ['fast', 'quick', 'rapid', 'speed', 'turbo', 'lightning', 'instant'], strength: 60 }],
      ['small', { keywords: ['small', 'tiny', 'mini', 'little', 'micro', 'baby', 'young'], strength: 50 }],
      
      // Colors & Visual
      ['color', { keywords: ['red', 'blue', 'green', 'yellow', 'black', 'white', 'pink', 'purple'], strength: 40 }],
      ['dark', { keywords: ['dark', 'black', 'shadow', 'night', 'evil', 'demon', 'devil'], strength: 55 }],
      ['light', { keywords: ['light', 'bright', 'shine', 'glow', 'sun', 'star', 'angel'], strength: 50 }],
      
      // Numbers & Math
      ['numbers', { keywords: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', '25', '100', '1000'], strength: 45 }],
      
      // Emotions & Feelings
      ['happy', { keywords: ['happy', 'joy', 'smile', 'laugh', 'fun', 'party', 'celebrate'], strength: 55 }],
      ['sad', { keywords: ['sad', 'cry', 'tear', 'sorrow', 'depressed', 'down'], strength: 45 }],
      
      // Mystery & Fantasy
      ['mystery', { keywords: ['mystery', 'secret', 'hidden', 'unknown', 'puzzle', 'riddle'], strength: 60 }],
      ['magic', { keywords: ['magic', 'wizard', 'spell', 'fantasy', 'dragon', 'unicorn'], strength: 55 }]
    ]);
  }

  /**
   * Main function to detect new narratives within a time window
   * @param {number} timeWindow - Time window in milliseconds
   * @returns {Promise<Object>} Detection results with narrative candidates
   */
  async detectNewNarratives(timeWindow = this.config.emergenceWindow) {
    console.log(`🧠 Starting narrative detection for ${timeWindow/1000/60} minute window...`);
    
    try {
      // Step 1: Collect new tokens from the time window
      const newTokens = await this.collectRecentTokens(timeWindow);
      console.log(`📊 Collected ${newTokens.length} new tokens`);
      
      if (newTokens.length < this.config.minClusterSize) {
        return { narratives: [], confidence: 0, tokensAnalyzed: newTokens.length };
      }
      
      // Step 2: Calculate similarity matrix
      const similarityMatrix = await this.calculateSimilarityMatrix(newTokens);
      
      // Step 3: Perform clustering analysis
      const clusters = this.performClustering(newTokens, similarityMatrix);
      console.log(`🔍 Found ${clusters.length} potential narrative clusters`);
      
      // Step 4: Analyze each cluster for narrative potential
      const narrativeCandidates = await this.analyzeNarrativeCandidates(clusters);
      
      // Step 5: Apply novelty detection
      const novelNarratives = this.detectNovelNarratives(narrativeCandidates);
      
      // Step 6: Score and rank narratives
      const rankedNarratives = this.scoreAndRankNarratives(novelNarratives);
      
      console.log(`✅ Detected ${rankedNarratives.length} potential new narratives`);
      
      return {
        narratives: rankedNarratives,
        confidence: this.calculateOverallConfidence(rankedNarratives),
        tokensAnalyzed: newTokens.length,
        clustersFound: clusters.length,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('❌ Error in narrative detection:', error);
      return { narratives: [], confidence: 0, error: error.message };
    }
  }

  /**
   * Process a given set of tokens for narrative detection
   * @param {Array} tokens - Array of token objects to process
   * @returns {Object} Detection results with narratives and metrics
   */
  async processTokens(tokens) {
    console.log(`🧠 Processing ${tokens.length} tokens for narrative detection...`);
    
    try {
      if (tokens.length < this.config.minClusterSize) {
        return { 
          narratives: [], 
          confidence: 0, 
          tokensAnalyzed: tokens.length,
          timestamp: new Date().toISOString()
        };
      }
      
      // Step 1: Calculate similarity matrix
      const similarityMatrix = await this.calculateSimilarityMatrix(tokens);
      
      // Step 2: Perform clustering analysis
      const clusters = this.performClustering(tokens, similarityMatrix);
      console.log(`🔍 Found ${clusters.length} potential narrative clusters`);
      
      // Step 3: Analyze each cluster for narrative potential
      const narrativeCandidates = await this.analyzeNarrativeCandidates(clusters);
      
      // Step 4: Apply novelty detection
      const novelNarratives = this.detectNovelNarratives(narrativeCandidates);
      
      // Step 5: Score and rank narratives
      const rankedNarratives = this.scoreAndRankNarratives(novelNarratives);
      
      console.log(`✅ Detected ${rankedNarratives.length} potential narratives`);
      
      return {
        narratives: rankedNarratives,
        confidence: this.calculateOverallConfidence(rankedNarratives),
        tokensAnalyzed: tokens.length,
        clustersFound: clusters.length,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('❌ Error in token processing:', error);
      return { narratives: [], confidence: 0, error: error.message };
    }
  }

  /**
   * Collect recent tokens from various sources
   */
  async collectRecentTokens(timeWindow) {
    const cutoffTime = Date.now() - timeWindow;
    const tokens = [];
    
    try {
      // Source 1: Pump.fun recent tokens (mock implementation)
      const pumpTokens = await this.fetchPumpFunTokens(cutoffTime);
      tokens.push(...pumpTokens);
      
      // Source 2: DexScreener new pairs
      const dexTokens = await this.fetchDexScreenerNewPairs(cutoffTime);
      tokens.push(...dexTokens);
      
      // Source 3: Birdeye trending (if available)
      const birdeyeTokens = await this.fetchBirdeyeTrending(cutoffTime);
      tokens.push(...birdeyeTokens);
      
      // Remove duplicates and enrich with metadata
      const uniqueTokens = this.deduplicateTokens(tokens);
      return await this.enrichTokenMetadata(uniqueTokens);
      
    } catch (error) {
      console.error('Error collecting tokens:', error);
      // Return mock data for development
      return this.generateMockTokenData(timeWindow);
    }
  }

  /**
   * Generate mock token data for testing
   */
  generateMockTokenData(timeWindow) {
    const mockTokens = [
      { address: 'ai1', name: 'GPT Dog', symbol: 'GPTDOG', price: 0.001, volume: 50000, created: Date.now() - 1000 },
      { address: 'ai2', name: 'Neural Cat', symbol: 'NCAT', price: 0.0008, volume: 45000, created: Date.now() - 2000 },
      { address: 'ai3', name: 'AI Pepe', symbol: 'AIPEPE', price: 0.0012, volume: 60000, created: Date.now() - 3000 },
      { address: 'dog1', name: 'Super Shiba', symbol: 'SSHIB', price: 0.0005, volume: 35000, created: Date.now() - 4000 },
      { address: 'dog2', name: 'Doge King', symbol: 'DOGEKING', price: 0.0007, volume: 40000, created: Date.now() - 5000 },
      { address: 'food1', name: 'Pizza Coin', symbol: 'PIZZA', price: 0.0003, volume: 25000, created: Date.now() - 6000 },
      { address: 'food2', name: 'Burger Token', symbol: 'BURGER', price: 0.0004, volume: 30000, created: Date.now() - 7000 },
      { address: 'meme1', name: 'Chad Coin', symbol: 'CHAD', price: 0.0015, volume: 70000, created: Date.now() - 8000 },
      { address: 'space1', name: 'Mars Mission', symbol: 'MARS', price: 0.0009, volume: 55000, created: Date.now() - 9000 },
      { address: 'space2', name: 'Rocket Launch', symbol: 'ROCKET', price: 0.0011, volume: 48000, created: Date.now() - 10000 }
    ];
    
    return mockTokens.map(token => ({
      ...token,
      holders: Math.floor(Math.random() * 1000) + 50,
      liquidity: Math.floor(Math.random() * 100000) + 10000,
      socialMentions: Math.floor(Math.random() * 100) + 5,
      priceChange24h: (Math.random() - 0.5) * 200 // -100% to +100%
    }));
  }

  /**
   * Calculate similarity matrix between all tokens
   */
  async calculateSimilarityMatrix(tokens) {
    const matrix = [];
    
    for (let i = 0; i < tokens.length; i++) {
      matrix[i] = [];
      for (let j = 0; j < tokens.length; j++) {
        if (i === j) {
          matrix[i][j] = 1.0;
        } else {
          matrix[i][j] = await this.calculateTokenSimilarity(tokens[i], tokens[j]);
        }
      }
    }
    
    return matrix;
  }

  /**
   * Calculate similarity between two tokens
   */
  async calculateTokenSimilarity(token1, token2) {
    // Name/Symbol similarity (using Jaccard similarity)
    const nameSimilarity = this.calculateTextSimilarity(
      `${token1.name} ${token1.symbol}`,
      `${token2.name} ${token2.symbol}`
    );
    
    // Price movement correlation
    const priceSimilarity = this.calculatePriceSimilarity(token1, token2);
    
    // Volume similarity
    const volumeSimilarity = this.calculateVolumeSimilarity(token1, token2);
    
    // Social pattern similarity
    const socialSimilarity = this.calculateSocialSimilarity(token1, token2);
    
    // Holder overlap (simplified)
    const holderSimilarity = this.calculateHolderSimilarity(token1, token2);
    
    // Weighted combination
    const similarity = (
      nameSimilarity * this.config.nameWeight +
      priceSimilarity * this.config.priceWeight +
      volumeSimilarity * this.config.volumeWeight +
      socialSimilarity * this.config.socialWeight +
      holderSimilarity * this.config.holderWeight
    );
    
    return Math.max(0, Math.min(1, similarity));
  }

  /**
   * Calculate text similarity using Jaccard coefficient
   */
  calculateTextSimilarity(text1, text2) {
    const normalize = (text) => text.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 1);
    
    const tokens1 = new Set(normalize(text1));
    const tokens2 = new Set(normalize(text2));
    
    const intersection = new Set([...tokens1].filter(x => tokens2.has(x)));
    const union = new Set([...tokens1, ...tokens2]);
    
    return union.size === 0 ? 0 : intersection.size / union.size;
  }

  /**
   * Calculate price movement similarity
   */
  calculatePriceSimilarity(token1, token2) {
    // Simple correlation based on price change percentage
    const change1 = token1.priceChange24h || 0;
    const change2 = token2.priceChange24h || 0;
    
    // If both are positive or both are negative, they're more similar
    if ((change1 > 0 && change2 > 0) || (change1 < 0 && change2 < 0)) {
      const diff = Math.abs(change1 - change2);
      return Math.max(0, 1 - diff / 200); // Normalize by max possible difference
    }
    
    return 0.1; // Low similarity for opposite movements
  }

  /**
   * Calculate volume similarity
   */
  calculateVolumeSimilarity(token1, token2) {
    const vol1 = token1.volume || 0;
    const vol2 = token2.volume || 0;
    
    if (vol1 === 0 && vol2 === 0) return 1;
    if (vol1 === 0 || vol2 === 0) return 0;
    
    const ratio = Math.min(vol1, vol2) / Math.max(vol1, vol2);
    return ratio;
  }

  /**
   * Calculate social similarity (simplified)
   */
  calculateSocialSimilarity(token1, token2) {
    const social1 = token1.socialMentions || 0;
    const social2 = token2.socialMentions || 0;
    
    if (social1 === 0 && social2 === 0) return 0.5;
    if (social1 === 0 || social2 === 0) return 0.2;
    
    const ratio = Math.min(social1, social2) / Math.max(social1, social2);
    return ratio;
  }

  /**
   * Calculate holder similarity (simplified)
   */
  calculateHolderSimilarity(token1, token2) {
    const holders1 = token1.holders || 0;
    const holders2 = token2.holders || 0;
    
    if (holders1 === 0 && holders2 === 0) return 0.5;
    if (holders1 === 0 || holders2 === 0) return 0.1;
    
    const ratio = Math.min(holders1, holders2) / Math.max(holders1, holders2);
    return Math.pow(ratio, 0.5); // Square root to reduce the impact
  }

  /**
   * Perform clustering using a simplified DBSCAN-like algorithm
   */
  performClustering(tokens, similarityMatrix) {
    const clusters = [];
    const visited = new Set();
    const clustered = new Set();
    
    for (let i = 0; i < tokens.length; i++) {
      if (visited.has(i)) continue;
      
      visited.add(i);
      const neighbors = this.getNeighbors(i, similarityMatrix, this.config.similarityThreshold);
      
      if (neighbors.length < this.config.minClusterSize - 1) {
        // Mark as noise for now
        continue;
      }
      
      // Start a new cluster
      const cluster = {
        id: clusters.length,
        tokens: [tokens[i]],
        indices: [i],
        centroid: null,
        strength: 0
      };
      
      clustered.add(i);
      
      // Expand cluster
      const queue = [...neighbors];
      while (queue.length > 0) {
        const currentIdx = queue.shift();
        
        if (!visited.has(currentIdx)) {
          visited.add(currentIdx);
          const currentNeighbors = this.getNeighbors(currentIdx, similarityMatrix, this.config.similarityThreshold);
          
          if (currentNeighbors.length >= this.config.minClusterSize - 1) {
            queue.push(...currentNeighbors.filter(idx => !visited.has(idx)));
          }
        }
        
        if (!clustered.has(currentIdx)) {
          cluster.tokens.push(tokens[currentIdx]);
          cluster.indices.push(currentIdx);
          clustered.add(currentIdx);
        }
      }
      
      if (cluster.tokens.length >= this.config.minClusterSize) {
        clusters.push(cluster);
      }
    }
    
    return clusters;
  }

  /**
   * Get neighbors within similarity threshold
   */
  getNeighbors(tokenIndex, similarityMatrix, threshold) {
    const neighbors = [];
    for (let i = 0; i < similarityMatrix[tokenIndex].length; i++) {
      if (i !== tokenIndex && similarityMatrix[tokenIndex][i] >= threshold) {
        neighbors.push(i);
      }
    }
    return neighbors;
  }

  /**
   * Analyze clusters for narrative potential
   */
  async analyzeNarrativeCandidates(clusters) {
    const candidates = [];
    
    for (const cluster of clusters) {
      const narrative = await this.extractNarrativeFromCluster(cluster);
      if (narrative && narrative.strength >= this.config.minNarrativeStrength) {
        candidates.push(narrative);
      }
    }
    
    return candidates;
  }

  /**
   * Extract narrative characteristics from a cluster
   */
  async extractNarrativeFromCluster(cluster) {
    // Extract common keywords from token names
    const allText = cluster.tokens.map(t => `${t.name} ${t.symbol}`).join(' ');
    const keywords = this.extractKeywords(allText);
    
    // Calculate cluster metrics
    const totalVolume = cluster.tokens.reduce((sum, t) => sum + (t.volume || 0), 0);
    const avgPrice = cluster.tokens.reduce((sum, t) => sum + (t.price || 0), 0) / cluster.tokens.length;
    const totalHolders = cluster.tokens.reduce((sum, t) => sum + (t.holders || 0), 0);
    const avgSocial = cluster.tokens.reduce((sum, t) => sum + (t.socialMentions || 0), 0) / cluster.tokens.length;
    
    // Calculate narrative strength
    const volumeScore = Math.min(100, (totalVolume / 10000)); // Normalize by 10k volume
    const tokenCountScore = Math.min(100, (cluster.tokens.length / 10) * 100); // Max score at 10 tokens
    const holderScore = Math.min(100, (totalHolders / 1000) * 100); // Max score at 1000 holders
    const socialScore = Math.min(100, avgSocial * 2); // Max score at 50 mentions
    
    const strength = (volumeScore + tokenCountScore + holderScore + socialScore) / 4;
    
    // Determine narrative category
    const category = this.categorizeNarrative(keywords);
    
    return {
      id: `narrative_${cluster.id}_${Date.now()}`,
      name: category.name,
      keywords: keywords.slice(0, 5), // Top 5 keywords
      tokens: cluster.tokens,
      strength: Math.round(strength),
      metrics: {
        tokenCount: cluster.tokens.length,
        totalVolume,
        avgPrice,
        totalHolders,
        avgSocialMentions: Math.round(avgSocial)
      },
      category: category.category,
      confidence: this.calculateNarrativeConfidence(cluster, keywords),
      emergenceTime: new Date().toISOString(),
      lifecycle: 'emerging'
    };
  }

  /**
   * Extract keywords from text using frequency analysis
   */
  extractKeywords(text) {
    const words = text.toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2);
    
    const frequency = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    
    // Filter out common words
    const commonWords = new Set(['the', 'and', 'token', 'coin', 'crypto']);
    const meaningfulWords = Object.keys(frequency)
      .filter(word => !commonWords.has(word))
      .sort((a, b) => frequency[b] - frequency[a]);
    
    return meaningfulWords;
  }

  /**
   * Categorize narrative based on keywords
   */
  categorizeNarrative(keywords) {
    let bestMatch = { name: 'Unknown', category: 'other', score: 0 };
    
    for (const [category, pattern] of this.knownPatterns) {
      let score = 0;
      for (const keyword of keywords) {
        for (const patternWord of pattern.keywords) {
          if (keyword.includes(patternWord) || patternWord.includes(keyword)) {
            score += 1;
          }
        }
      }
      
      if (score > bestMatch.score) {
        bestMatch = {
          name: this.formatNarrativeName(category, keywords),
          category: category,
          score: score
        };
      }
    }
    
    // If no good match, create a name from top keywords
    if (bestMatch.score === 0 && keywords.length > 0) {
      bestMatch = {
        name: this.formatNarrativeName('emerging', keywords),
        category: 'emerging',
        score: 1
      };
    }
    
    return bestMatch;
  }

  /**
   * Format narrative name from category and keywords
   */
  formatNarrativeName(category, keywords) {
    if (keywords.length === 0) return `Unknown ${category}`;
    
    // Define better narrative names based on crypto trends and contexts
    const narrativeNames = {
      // AI & Technology
      'ai': this.getAINarrativeName(keywords),
      'tech': this.getTechNarrativeName(keywords),
      
      // Trading & Finance
      'trading': this.getTradingNarrativeName(keywords),
      'defi': this.getDeFiNarrativeName(keywords),
      'rwa': this.getRWANarrativeName(keywords),
      'bridge': this.getBridgeNarrativeName(keywords),
      'dex': this.getDexNarrativeName(keywords),
      'perp': this.getPerpNarrativeName(keywords),
      'finance': this.getFinanceNarrativeName(keywords),
      'prediction': this.getPredictionNarrativeName(keywords),
      'money': this.getMoneyNarrativeName(keywords),
      
      // Animals
      'dog': this.getDogNarrativeName(keywords),
      'cat': this.getCatNarrativeName(keywords),
      'frog': this.getFrogNarrativeName(keywords),
      
      // Memes & Culture
      'meme': this.getMemeNarrativeName(keywords),
      'viral': this.getViralNarrativeName(keywords),
      
      // Gaming & Entertainment
      'gaming': this.getGamingNarrativeName(keywords),
      'space': this.getSpaceNarrativeName(keywords),
      
      // Generic categories
      'food': this.getFoodNarrativeName(keywords),
      'politics': this.getPoliticsNarrativeName(keywords),
      'power': this.getPowerNarrativeName(keywords),
      'work': this.getWorkNarrativeName(keywords),
      'quit': 'Great Resignation',
      'nature': 'Green Revolution',
      'sports': 'Sports Betting Meta',
      'celebrity': 'Celebrity Endorsements',
      'emerging': this.getEmergingNarrativeName(keywords)
    };
    
    return narrativeNames[category] || this.getGenericNarrativeName(category, keywords);
  }

  getAINarrativeName(keywords) {
    const aiNames = [
      'AI Agent Revolution',
      'Neural Network Meta',
      'Machine Learning Boom',
      'ChatGPT Derivatives',
      'Artificial Intelligence Wave',
      'Bot Trading Meta',
      'AI Automation Trend'
    ];
    
    if (keywords.some(k => k.includes('agent'))) return 'AI Agent Meta';
    if (keywords.some(k => k.includes('gpt') || k.includes('chat'))) return 'ChatGPT Copycats';
    if (keywords.some(k => k.includes('bot'))) return 'Trading Bot Meta';
    if (keywords.some(k => k.includes('neural'))) return 'Neural Network Tokens';
    
    return aiNames[Math.floor(Math.random() * aiNames.length)];
  }

  getTechNarrativeName(keywords) {
    const techNames = [
      'Blockchain Infrastructure',
      'Protocol Governance',
      'Layer 2 Solutions',
      'Cross-Chain Bridges',
      'Quantum Computing',
      'Cybersecurity Meta',
      'Digital Identity'
    ];
    
    if (keywords.some(k => k.includes('protocol'))) return 'Protocol Wars';
    if (keywords.some(k => k.includes('chain'))) return 'Chain Abstraction';
    if (keywords.some(k => k.includes('quantum'))) return 'Quantum Resistance';
    
    return techNames[Math.floor(Math.random() * techNames.length)];
  }

  getTradingNarrativeName(keywords) {
    const tradingNames = [
      'Degen Trading',
      'Diamond Hands Meta',
      'Paper Hands Panic',
      'Pump & Dump Schemes',
      'Technical Analysis',
      'Chart Pattern Play',
      'Momentum Trading',
      'Copy Trading Bots'
    ];
    
    if (keywords.some(k => k.includes('pump'))) return 'Pump.fun Meta';
    if (keywords.some(k => k.includes('chart'))) return 'Technical Analysis';
    if (keywords.some(k => k.includes('diamond'))) return 'Diamond Hands';
    if (keywords.some(k => k.includes('degen'))) return 'Degen Trading';
    
    return tradingNames[Math.floor(Math.random() * tradingNames.length)];
  }

  getDeFiNarrativeName(keywords) {
    const defiNames = [
      'Yield Farming 2.0',
      'Liquidity Mining',
      'Restaking Protocols',
      'Real World Assets',
      'Flash Loan Arbitrage',
      'Stablecoin Wars',
      'Protocol Wars',
      'DeFi Summer Return'
    ];
    
    if (keywords.some(k => k.includes('yield'))) return 'Yield Farming Revival';
    if (keywords.some(k => k.includes('stake') || k.includes('restake'))) return 'Restaking Narrative';
    if (keywords.some(k => k.includes('rwa') || k.includes('real'))) return 'RWA Tokenization';
    if (keywords.some(k => k.includes('protocol'))) return 'Protocol Wars';
    
    return defiNames[Math.floor(Math.random() * defiNames.length)];
  }

  getDexNarrativeName(keywords) {
    const dexNames = [
      'DEX Wars',
      'AMM Revolution',
      'Spot Trading Meta',
      'DEX Aggregators',
      'Orderbook DEX',
      'Cross-Chain DEX',
      'MEV Protection',
      'Liquidity Aggregation'
    ];
    
    if (keywords.some(k => k.includes('amm'))) return 'AMM Innovation';
    if (keywords.some(k => k.includes('aggregator'))) return 'DEX Aggregators';
    if (keywords.some(k => k.includes('orderbook'))) return 'Orderbook DEX';
    if (keywords.some(k => k.includes('cross') || k.includes('bridge'))) return 'Cross-Chain DEX';
    if (keywords.some(k => k.includes('mev'))) return 'MEV Protection';
    if (keywords.some(k => k.includes('spot'))) return 'Spot Trading Meta';
    
    return dexNames[Math.floor(Math.random() * dexNames.length)];
  }

  getPerpNarrativeName(keywords) {
    const perpNames = [
      'Perp DEX Wars',
      'Perpetual Futures',
      'Leverage Trading',
      'Margin Revolution',
      'Derivatives Meta',
      'Funding Rate Arb',
      'Liquidation Engine',
      'Decentralized Futures'
    ];
    
    if (keywords.some(k => k.includes('perp') && k.includes('dex'))) return 'Perp DEX Wars';
    if (keywords.some(k => k.includes('perpetual'))) return 'Perpetual Futures';
    if (keywords.some(k => k.includes('leverage') || k.includes('margin'))) return 'Leverage Trading';
    if (keywords.some(k => k.includes('funding'))) return 'Funding Rate Arbitrage';
    if (keywords.some(k => k.includes('derivative'))) return 'Derivatives Meta';
    if (keywords.some(k => k.includes('futures'))) return 'Decentralized Futures';
    
    return perpNames[Math.floor(Math.random() * perpNames.length)];
  }

  getRWANarrativeName(keywords) {
    const rwaNames = [
      'RWA Tokenization',
      'Real World Assets',
      'Tokenized Real Estate',
      'Physical Asset Tokens',
      'Commodity Tokenization',
      'Asset Digitization',
      'Traditional Finance Bridge',
      'Institutional Grade Assets'
    ];
    
    if (keywords.some(k => k.includes('estate') || k.includes('property'))) return 'Tokenized Real Estate';
    if (keywords.some(k => k.includes('commodity'))) return 'Commodity Tokenization';
    if (keywords.some(k => k.includes('physical'))) return 'Physical Asset Tokens';
    if (keywords.some(k => k.includes('institutional'))) return 'Institutional Grade Assets';
    if (keywords.some(k => k.includes('traditional'))) return 'Traditional Finance Bridge';
    
    return rwaNames[Math.floor(Math.random() * rwaNames.length)];
  }

  getBridgeNarrativeName(keywords) {
    const bridgeNames = [
      'Cross-Chain Bridges',
      'Multichain Infrastructure',
      'Interoperability Layer',
      'Chain Abstraction',
      'Bridge Aggregators',
      'Cross-Chain DEX',
      'Universal Router',
      'Omnichain Protocols'
    ];
    
    if (keywords.some(k => k.includes('multi'))) return 'Multichain Infrastructure';
    if (keywords.some(k => k.includes('router'))) return 'Universal Router';
    if (keywords.some(k => k.includes('aggregator'))) return 'Bridge Aggregators';
    if (keywords.some(k => k.includes('omni'))) return 'Omnichain Protocols';
    if (keywords.some(k => k.includes('interchain'))) return 'Interoperability Layer';
    if (keywords.some(k => k.includes('abstraction'))) return 'Chain Abstraction';
    
    return bridgeNames[Math.floor(Math.random() * bridgeNames.length)];
  }

  getFinanceNarrativeName(keywords) {
    const financeNames = [
      'Creator Capital Market',
      'PayFi Infrastructure',
      'RWA Tokenization',
      'Institutional Adoption',
      'Corporate Treasury',
      'Wealth Management',
      'Financial Inclusion',
      'TradFi Integration'
    ];
    
    if (keywords.some(k => k.includes('creator') || k.includes('ccm'))) return 'Creator Capital Market';
    if (keywords.some(k => k.includes('pay') || k.includes('payfi'))) return 'PayFi Revolution';
    if (keywords.some(k => k.includes('rwa') || k.includes('real'))) return 'RWA Tokenization';
    if (keywords.some(k => k.includes('institutional'))) return 'Institutional Wave';
    if (keywords.some(k => k.includes('treasury'))) return 'Corporate Treasury';
    
    return financeNames[Math.floor(Math.random() * financeNames.length)];
  }

  getPredictionNarrativeName(keywords) {
    const predictionNames = [
      'Polymarket Meta',
      'Election Betting',
      'Prediction Markets',
      'Forecast Protocols',
      'Betting Infrastructure',
      'Oracle Networks',
      'Event Derivatives',
      'Social Betting'
    ];
    
    if (keywords.some(k => k.includes('polymarket') || k.includes('poly'))) return 'Polymarket Meta';
    if (keywords.some(k => k.includes('election') || k.includes('vote'))) return 'Election Betting';
    if (keywords.some(k => k.includes('bet') || k.includes('odds'))) return 'Social Betting';
    if (keywords.some(k => k.includes('oracle'))) return 'Oracle Networks';
    
    return predictionNames[Math.floor(Math.random() * predictionNames.length)];
  }

  getMoneyNarrativeName(keywords) {
    const moneyNames = [
      'Wealth Generation',
      'Moon Mission',
      'Diamond Hands',
      'Generational Wealth',
      'Financial Freedom',
      'Profit Maximization',
      'Passive Income',
      'Smart Money'
    ];
    
    if (keywords.some(k => k.includes('moon'))) return 'Moon Mission';
    if (keywords.some(k => k.includes('diamond'))) return 'Diamond Hands Meta';
    if (keywords.some(k => k.includes('passive'))) return 'Passive Income';
    if (keywords.some(k => k.includes('smart'))) return 'Smart Money Flow';
    
    return moneyNames[Math.floor(Math.random() * moneyNames.length)];
  }

  getDogNarrativeName(keywords) {
    const dogNames = [
      'Dog Meta Revival',
      'Shiba Ecosystem',
      'Canine Companions',
      'Alpha Dog Season',
      'Puppy Mill Tokens',
      'Dog Park Protocol',
      'Loyal Companion Meta'
    ];
    
    if (keywords.some(k => k.includes('shib'))) return 'Shiba Army';
    if (keywords.some(k => k.includes('doge'))) return 'Doge Dynasty';
    if (keywords.some(k => k.includes('puppy'))) return 'Puppy Season';
    
    return dogNames[Math.floor(Math.random() * dogNames.length)];
  }

  getCatNarrativeName(keywords) {
    const catNames = [
      'Cat Meta Rise',
      'Feline Finance',
      'Whisker Warriors',
      'Nine Lives Protocol',
      'Purr Economics',
      'Cat Cafe Culture'
    ];
    
    return catNames[Math.floor(Math.random() * catNames.length)];
  }

  getFrogNarrativeName(keywords) {
    const frogNames = [
      'Pepe Renaissance',
      'Amphibian Alliance',
      'Pond Economics',
      'Ribbit Revolution',
      'Lily Pad Protocol',
      'Frog Prince Meta'
    ];
    
    if (keywords.some(k => k.includes('pepe'))) return 'Pepe Renaissance';
    
    return frogNames[Math.floor(Math.random() * frogNames.length)];
  }

  getMemeNarrativeName(keywords) {
    const memeNames = [
      'Trenches Movement',
      'Based Department',
      'Gigachad Energy',
      'Wojak Suffering',
      'NPC Programming',
      'Sigma Grindset',
      'Chad Uprising',
      'Virgin vs Chad',
      'Normie Exodus',
      'Anon Collective'
    ];
    
    if (keywords.some(k => k.includes('trench'))) return 'Trenches';
    if (keywords.some(k => k.includes('chad'))) return 'Gigachad Meta';
    if (keywords.some(k => k.includes('wojak'))) return 'Wojak Feels';
    if (keywords.some(k => k.includes('sigma'))) return 'Sigma Grindset';
    if (keywords.some(k => k.includes('based'))) return 'Based Department';
    if (keywords.some(k => k.includes('npc'))) return 'NPC Programming';
    if (keywords.some(k => k.includes('anon'))) return 'Anon Collective';
    
    return memeNames[Math.floor(Math.random() * memeNames.length)];
  }

  getViralNarrativeName(keywords) {
    const viralNames = [
      'TikTok Virality',
      'Twitter Trends',
      'Influencer Meta',
      'Viral Moment',
      'Social Explosion',
      'Trending Topics',
      'Meme Velocity'
    ];
    
    return viralNames[Math.floor(Math.random() * viralNames.length)];
  }

  getGamingNarrativeName(keywords) {
    const gamingNames = [
      'GameFi Revolution',
      'Play-to-Earn',
      'Guild Wars Meta',
      'NFT Gaming',
      'Metaverse Assets',
      'Gaming Guilds',
      'Virtual Worlds'
    ];
    
    if (keywords.some(k => k.includes('play'))) return 'Play-to-Earn';
    if (keywords.some(k => k.includes('guild'))) return 'Gaming Guilds';
    if (keywords.some(k => k.includes('nft'))) return 'NFT Gaming';
    
    return gamingNames[Math.floor(Math.random() * gamingNames.length)];
  }

  getSpaceNarrativeName(keywords) {
    const spaceNames = [
      'Space Exploration',
      'Mars Mission Meta',
      'Cosmic Expansion',
      'Stellar Network',
      'Orbital Mechanics',
      'Rocket Fuel Tokens',
      'Galactic Empire'
    ];
    
    if (keywords.some(k => k.includes('mars'))) return 'Mars Colonization';
    if (keywords.some(k => k.includes('rocket'))) return 'Space Race 2.0';
    if (keywords.some(k => k.includes('moon'))) return 'Lunar Economy';
    
    return spaceNames[Math.floor(Math.random() * spaceNames.length)];
  }

  getFoodNarrativeName(keywords) {
    const foodNames = [
      'Food Delivery Meta',
      'Restaurant Tokens',
      'Culinary Culture',
      'Chef Economics',
      'Recipe Protocols',
      'Kitchen Nightmares'
    ];
    
    return foodNames[Math.floor(Math.random() * foodNames.length)];
  }

  getPoliticsNarrativeName(keywords) {
    const politicsNames = [
      'Election Season',
      'Political Memes',
      'Democracy Tokens',
      'Governance Meta',
      'Voting Rights',
      'Policy Protocols'
    ];
    
    return politicsNames[Math.floor(Math.random() * politicsNames.length)];
  }

  getPowerNarrativeName(keywords) {
    const powerNames = [
      'Energy Infrastructure',
      'Power Grid Meta',
      'Renewable Energy',
      'Nuclear Renaissance',
      'Grid Computing',
      'Battery Technology'
    ];
    
    return powerNames[Math.floor(Math.random() * powerNames.length)];
  }

  getWorkNarrativeName(keywords) {
    const workNames = [
      'Future of Work',
      'Remote Revolution',
      'Gig Economy',
      'Creator Economy',
      'Freelancer Meta',
      'Job Market Shift'
    ];
    
    return workNames[Math.floor(Math.random() * workNames.length)];
  }

  getEmergingNarrativeName(keywords) {
    const emergingNames = [
      'Underground Movement',
      'Stealth Launch',
      'Early Discovery',
      'Hidden Gems',
      'Sleeper Hits',
      'Dark Horse Meta',
      'Breakout Narrative'
    ];
    
    return emergingNames[Math.floor(Math.random() * emergingNames.length)];
  }

  getGenericNarrativeName(category, keywords) {
    const topKeywords = keywords.slice(0, 2);
    const formatted = topKeywords.map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    return `${formatted} Movement`;
  }

  /**
   * Calculate confidence score for a narrative
   */
  calculateNarrativeConfidence(cluster, keywords) {
    const factors = {
      clusterSize: Math.min(1, cluster.tokens.length / 10),
      keywordRelevance: Math.min(1, keywords.length / 5),
      volumeConsistency: this.calculateVolumeConsistency(cluster.tokens),
      nameCoherence: this.calculateNameCoherence(cluster.tokens)
    };
    
    const confidence = Object.values(factors).reduce((sum, val) => sum + val, 0) / Object.keys(factors).length;
    return Math.round(confidence * 100);
  }

  /**
   * Calculate volume consistency within cluster
   */
  calculateVolumeConsistency(tokens) {
    const volumes = tokens.map(t => t.volume || 0).filter(v => v > 0);
    if (volumes.length < 2) return 0.5;
    
    const avg = volumes.reduce((sum, v) => sum + v, 0) / volumes.length;
    const variance = volumes.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / volumes.length;
    const stdDev = Math.sqrt(variance);
    
    // Lower coefficient of variation = higher consistency
    const cv = avg > 0 ? stdDev / avg : 1;
    return Math.max(0, 1 - cv);
  }

  /**
   * Calculate name coherence within cluster
   */
  calculateNameCoherence(tokens) {
    const names = tokens.map(t => t.name.toLowerCase());
    let totalSimilarity = 0;
    let comparisons = 0;
    
    for (let i = 0; i < names.length; i++) {
      for (let j = i + 1; j < names.length; j++) {
        totalSimilarity += this.calculateTextSimilarity(names[i], names[j]);
        comparisons++;
      }
    }
    
    return comparisons > 0 ? totalSimilarity / comparisons : 0;
  }

  /**
   * Detect novel narratives (not similar to existing patterns)
   */
  detectNovelNarratives(candidates) {
    return candidates.filter(candidate => {
      const noveltyScore = this.calculateNoveltyScore(candidate);
      candidate.noveltyScore = noveltyScore;
      return noveltyScore >= this.config.noveltyThreshold;
    });
  }

  /**
   * Calculate novelty score for a narrative
   */
  calculateNoveltyScore(narrative) {
    // Check similarity to known patterns
    let maxSimilarity = 0;
    
    for (const [category, pattern] of this.knownPatterns) {
      let similarity = 0;
      for (const keyword of narrative.keywords) {
        for (const patternWord of pattern.keywords) {
          if (keyword.includes(patternWord) || patternWord.includes(keyword)) {
            similarity += 0.2;
          }
        }
      }
      maxSimilarity = Math.max(maxSimilarity, Math.min(1, similarity));
    }
    
    // Novelty is inverse of similarity to known patterns
    return 1 - maxSimilarity;
  }

  /**
   * Score and rank narratives by potential impact
   */
  scoreAndRankNarratives(narratives) {
    return narratives
      .map(narrative => ({
        ...narrative,
        totalScore: this.calculateTotalScore(narrative)
      }))
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 10); // Top 10 narratives
  }

  /**
   * Calculate total score for ranking
   */
  calculateTotalScore(narrative) {
    const scores = {
      strength: narrative.strength,
      confidence: narrative.confidence,
      novelty: (narrative.noveltyScore || 0) * 100,
      volume: Math.min(100, (narrative.metrics.totalVolume / 100000) * 100),
      tokens: Math.min(100, (narrative.metrics.tokenCount / 20) * 100)
    };
    
    const weights = {
      strength: 0.25,
      confidence: 0.25,
      novelty: 0.2,
      volume: 0.15,
      tokens: 0.15
    };
    
    return Object.keys(scores).reduce((total, key) => {
      return total + (scores[key] * weights[key]);
    }, 0);
  }

  /**
   * Calculate overall confidence in detection results
   */
  calculateOverallConfidence(narratives) {
    if (narratives.length === 0) return 0;
    
    const avgConfidence = narratives.reduce((sum, n) => sum + n.confidence, 0) / narratives.length;
    const volumeFactor = Math.min(1, narratives.length / 5); // More narratives = higher confidence
    
    return Math.round(avgConfidence * volumeFactor);
  }

  /**
   * Update narrative lifecycle status
   */
  updateNarrativeLifecycle(narrative, currentMetrics) {
    const timeSinceEmergence = Date.now() - new Date(narrative.emergenceTime).getTime();
    
    // Check for growth phase
    if (narrative.lifecycle === 'emerging' && timeSinceEmergence > this.config.emergenceWindow) {
      if (currentMetrics.volume > narrative.metrics.totalVolume * 1.5) {
        narrative.lifecycle = 'growing';
      }
    }
    
    // Check for peak phase
    if (narrative.lifecycle === 'growing' && timeSinceEmergence > this.config.growthWindow) {
      if (currentMetrics.volume > narrative.metrics.totalVolume * 3) {
        narrative.lifecycle = 'peak';
      }
    }
    
    // Check for decline phase
    if (['peak', 'growing'].includes(narrative.lifecycle) && 
        timeSinceEmergence > this.config.declineThreshold) {
      if (currentMetrics.volume < narrative.metrics.totalVolume * 0.5) {
        narrative.lifecycle = 'declining';
      }
    }
    
    return narrative;
  }

  /**
   * Mock API functions (to be replaced with real implementations)
   */
  async fetchPumpFunTokens(cutoffTime) {
    // Mock implementation - replace with real Pump.fun API
    return [];
  }

  async fetchDexScreenerNewPairs(cutoffTime) {
    // Mock implementation - replace with real DexScreener API
    return [];
  }

  async fetchBirdeyeTrending(cutoffTime) {
    // Mock implementation - replace with real Birdeye API
    return [];
  }

  deduplicateTokens(tokens) {
    const seen = new Set();
    return tokens.filter(token => {
      const key = token.address || token.name;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  async enrichTokenMetadata(tokens) {
    // Add additional metadata like social metrics, holder data, etc.
    return tokens;
  }
}

/**
 * Test function with historical data
 */
async function testNarrativeDetection() {
  console.log('🧪 Testing Narrative Detection Engine...');
  
  const engine = new NarrativeDetectionEngine({
    minClusterSize: 2,
    similarityThreshold: 0.6,
    minNarrativeStrength: 30
  });
  
  const result = await engine.detectNewNarratives(24 * 60 * 60 * 1000); // 24 hours
  
  console.log('📊 Test Results:');
  console.log(`- Narratives detected: ${result.narratives.length}`);
  console.log(`- Overall confidence: ${result.confidence}%`);
  console.log(`- Tokens analyzed: ${result.tokensAnalyzed}`);
  
  result.narratives.forEach((narrative, i) => {
    console.log(`\n${i + 1}. ${narrative.name}`);
    console.log(`   - Strength: ${narrative.strength}/100`);
    console.log(`   - Confidence: ${narrative.confidence}%`);
    console.log(`   - Tokens: ${narrative.metrics.tokenCount}`);
    console.log(`   - Keywords: ${narrative.keywords.join(', ')}`);
  });
  
  return result;
}

module.exports = {
  NarrativeDetectionEngine,
  testNarrativeDetection
};