/**
 * Adaptive Scoring System
 * 
 * Self-adjusting algorithm that scores narratives based on their characteristics,
 * lifecycle stage, and market dynamics with adaptive weighting and correlation analysis.
 */

class AdaptiveNarrativeScoringEngine {
  constructor(config = {}) {
    this.config = {
      // Meme coin-focused scoring weights (optimized for viral/speculative assets)
      baseWeights: {
        volume: config.volumeWeight || 0.35,          // High volume indicates active trading and speculation
        social: config.socialWeight || 0.25,         // Community power and virality
        liquidity: config.liquidityWeight || 0.20,   // Market depth and resilience
        holders: config.holdersWeight || 0.10,       // Breadth of adoption
        priceVolatility: config.volatilityWeight || 0.10  // Captures "pump" excitement
      },
      
      // Adaptive parameters
      adaptationRate: config.adaptationRate || 0.1,
      minWeight: config.minWeight || 0.05,
      maxWeight: config.maxWeight || 0.5,
      correlationThreshold: config.correlationThreshold || 0.7,
      
      // REAL meme coin theme multipliers (no boring DeFi crap)
      themeMultipliers: {
        'DOGE EMPIRE': { social: 1.8, volume: 1.6, community: 1.7, volatility: 1.4 },
        'PEPE NATION': { social: 1.9, volatility: 1.7, community: 1.6, volume: 1.5 },
        'CAT MAFIA': { social: 1.6, community: 1.5, volume: 1.4, novelty: 1.3 },
        'WOJAK WORLD': { social: 1.7, community: 1.6, volatility: 1.5, novelty: 1.4 },
        'CHAD ENERGY': { social: 1.8, volatility: 1.6, volume: 1.5, community: 1.4 },
        'MOON MISSION': { volatility: 1.8, volume: 1.7, social: 1.6, community: 1.4 },
        'APE TOGETHER': { community: 1.7, volume: 1.6, social: 1.5, volatility: 1.4 },
        'POLITICAL MEMES': { social: 2.0, volatility: 1.8, volume: 1.6, community: 1.5 },
        'ANIME DEGENERATES': { community: 1.6, social: 1.5, novelty: 1.4, volume: 1.3 },
        'MEME NUMBERS': { social: 1.5, volatility: 1.4, community: 1.3, novelty: 1.3 },
        'SMOL BEANS': { community: 1.4, social: 1.4, novelty: 1.3, volume: 1.2 },
        'GIGACHAD SIZE': { volatility: 1.6, volume: 1.5, social: 1.4, community: 1.3 },
        'HOLIDAY HYPE': { social: 1.5, community: 1.4, volatility: 1.3, novelty: 1.3 },
        'TENDIE TOWN': { community: 1.4, social: 1.3, volume: 1.2, novelty: 1.2 },
        'AI OVERLORDS': { novelty: 1.5, volume: 1.4, social: 1.3, volatility: 1.3 },
        'SPACE CADETS': { novelty: 1.5, volume: 1.4, social: 1.3, volatility: 1.3 },
        'GAMER FUEL': { community: 1.5, social: 1.4, volume: 1.3, novelty: 1.2 },
        'GENERIC MEMES': { social: 1.2, volume: 1.1, community: 1.1, volatility: 1.1 },
        'NUMBER MEMES': { volatility: 1.3, social: 1.2, volume: 1.1, novelty: 1.1 },
        'MYSTERY MEME': { social: 1.1, volume: 1.0, community: 1.0, volatility: 1.0 }
      },
      
      // Meme coin lifecycle multipliers (shorter cycles, higher volatility)
      lifecycleMultipliers: {
        emerging: { social: 1.6, volume: 1.4, novelty: 1.5, volatility: 1.3 },
        growing: { volume: 1.5, social: 1.4, community: 1.3, holders: 1.2 },
        peak: { volume: 1.3, liquidity: 1.2, volatility: 1.4, social: 1.1 },
        declining: { volume: 0.7, social: 0.8, liquidity: 0.9, holders: 0.8 },
        mature: { liquidity: 1.2, holders: 1.1, volume: 1.0, social: 0.9 }
      },
      
      ...config
    };
    
    this.weightHistory = new Map(); // Track weight evolution
    this.correlationMatrix = new Map(); // Track narrative correlations
    this.performanceMetrics = new Map(); // Track scoring performance
    this.lastScores = new Map(); // Previous scores for delta calculation
  }

  /**
   * Initialize the scoring engine
   * @returns {Promise<void>}
   */
  async initialize() {
    console.log('🎯 Initializing Adaptive Narrative Scoring Engine...');
    this.initialized = true;
    console.log('✅ Adaptive Narrative Scoring Engine initialized');
  }

  /**
   * Save engine state for persistence
   * @returns {Promise<void>}
   */
  async saveState() {
    console.log('💾 Saving Adaptive Narrative Scoring Engine state...');
    return Promise.resolve();
  }

  /**
   * Calculate comprehensive scores for meme coin narratives with real-time data
   * @param {Array} narratives - Array of characterized narratives with token data
   * @param {Object} marketData - Optional market context data
   * @returns {Object} Scoring results with rankings and metadata
   */
  async calculateMemeCoinScores(narratives, marketData = {}) {
    console.log(`💰 Calculating meme coin scores for ${narratives.length} narratives...`);
    
    if (narratives.length === 0) {
      return {
        rankedNarratives: [],
        correlations: {},
        weightAdjustments: {},
        metadata: { totalNarratives: 0, timestamp: new Date().toISOString() }
      };
    }
    
    try {
      // Step 1: Calculate base scores with meme coin metrics
      const baseScores = this.calculateBaseScores(narratives);
      
      // Step 2: Apply theme-specific adjustments for meme coin themes
      const themeAdjustedScores = this.applyThemeAdjustments(baseScores, narratives);
      
      // Step 3: Apply lifecycle adjustments (shorter cycles for meme coins)
      const lifecycleAdjustedScores = this.applyLifecycleAdjustments(themeAdjustedScores, narratives);
      
      // Step 4: Apply whale activity detection
      const whaleAdjustedScores = this.applyWhaleActivityBonus(lifecycleAdjustedScores);
      
      // Step 5: Calculate correlation matrix
      const correlations = this.calculateCorrelationMatrix(narratives);
      
      // Step 6: Apply correlation adjustments
      const correlationAdjustedScores = this.applyCorrelationAdjustments(whaleAdjustedScores, correlations);
      
      // Step 7: Calculate delta scores
      const scoresWithDeltas = this.calculateDeltaScores(correlationAdjustedScores, narratives);
      
      // Step 8: Rank narratives
      const rankedNarratives = this.rankNarratives(scoresWithDeltas, narratives);
      
      // Step 9: Adapt weights based on performance
      const weightAdjustments = this.adaptWeights(rankedNarratives);
      
      // Step 10: Store scores for next delta calculation
      this.updateScoreHistory(rankedNarratives);
      
      const topNarrative = rankedNarratives[0];
      console.log(`🏆 Top meme coin narrative: "${topNarrative?.name}" (${Math.round(topNarrative?.finalScore || 0)}/100)`);
      
      return {
        rankedNarratives,
        correlations,
        weightAdjustments,
        metadata: {
          totalNarratives: narratives.length,
          adaptedWeights: { ...this.config.baseWeights },
          avgScore: rankedNarratives.reduce((sum, n) => sum + n.finalScore, 0) / rankedNarratives.length,
          marketConditions: marketData,
          timestamp: new Date().toISOString()
        }
      };
      
    } catch (error) {
      console.error('❌ Error in meme coin scoring:', error);
      return {
        rankedNarratives: narratives.map(n => ({ ...n, finalScore: n.strength || 0 })),
        correlations: {},
        weightAdjustments: {},
        metadata: { error: error.message }
      };
    }
  }

  /**
   * Calculate comprehensive scores for all narratives
   * @param {Array} narratives - Array of characterized narratives
   * @returns {Object} Scoring results with rankings and metadata
   */
  async calculateNarrativeScores(narratives, marketData = {}) {
    // Redirect to meme coin specific scoring
    return this.calculateMemeCoinScores(narratives, marketData);
  }

  /**
   * Calculate base scores using meme coin-focused metrics
   */
  calculateBaseScores(narratives) {
    console.log('🧮 Calculating meme coin base scores...');
    
    // First, normalize metrics across all narratives
    const { maxVolume, maxLiquidity, maxHolders, maxPriceChange, maxSocial } = this.calculateMaxMetrics(narratives);
    
    return narratives.map(narrative => {
      const weights = this.config.baseWeights;
      
      // Extract meme coin-specific scoring components
      const volume = this.calculateVolumeScore(narrative, maxVolume);
      const social = this.calculateSocialScore(narrative, maxSocial);
      const liquidity = this.calculateLiquidityScore(narrative, maxLiquidity);
      const holders = this.calculateHoldersScore(narrative, maxHolders);
      const priceVolatility = this.calculateVolatilityScore(narrative, maxPriceChange);
      
      // Calculate weighted base score
      const baseScore = 
        volume * weights.volume +
        social * weights.social +
        liquidity * weights.liquidity +
        holders * weights.holders +
        priceVolatility * weights.priceVolatility;
      
      // Scale to 0-100 range
      const finalBaseScore = Math.max(5, Math.min(95, baseScore * 100)); // Ensure minimum visibility
      
      return {
        narrative,
        components: { volume, social, liquidity, holders, priceVolatility },
        baseScore: finalBaseScore
      };
    });
  }

  /**
   * Apply theme-specific scoring adjustments
   */
  applyThemeAdjustments(baseScores, narratives) {
    console.log('🎨 Applying theme-specific adjustments...');
    
    return baseScores.map(scoreData => {
      const narrative = scoreData.narrative;
      const primaryTheme = narrative.themes?.primary?.theme;
      
      if (!primaryTheme || !this.config.themeMultipliers[primaryTheme]) {
        return { ...scoreData, themeAdjustedScore: scoreData.baseScore };
      }
      
      const multipliers = this.config.themeMultipliers[primaryTheme];
      let adjustedScore = scoreData.baseScore;
      
      // Apply theme-specific multipliers based on narrative characteristics
      if (multipliers.volatility && narrative.characteristics?.volatility) {
        const volatilityBonus = this.getVolatilityBonus(narrative.characteristics.volatility) * multipliers.volatility;
        adjustedScore += volatilityBonus;
      }
      
      if (multipliers.social && narrative.characteristics?.social) {
        const socialBonus = this.getSocialBonus(narrative.characteristics.social) * multipliers.social;
        adjustedScore += socialBonus;
      }
      
      if (multipliers.community && narrative.characteristics?.community) {
        const communityBonus = this.getCommunityBonus(narrative.characteristics.community) * multipliers.community;
        adjustedScore += communityBonus;
      }
      
      if (multipliers.growth && narrative.characteristics?.temporal) {
        const growthBonus = this.getGrowthBonus(narrative.characteristics.temporal) * multipliers.growth;
        adjustedScore += growthBonus;
      }
      
      return {
        ...scoreData,
        themeAdjustedScore: Math.max(0, Math.min(100, adjustedScore)),
        themeMultipliers: multipliers
      };
    });
  }

  /**
   * Apply lifecycle-specific adjustments
   */
  applyLifecycleAdjustments(themeScores, narratives) {
    console.log('🔄 Applying lifecycle adjustments...');
    
    return themeScores.map(scoreData => {
      const lifecycle = scoreData.narrative.lifecycle?.stage || 'stable';
      const multipliers = this.config.lifecycleMultipliers[lifecycle] || {};
      
      let adjustedScore = scoreData.themeAdjustedScore;
      
      // Apply lifecycle-specific component adjustments
      Object.entries(multipliers).forEach(([component, multiplier]) => {
        if (scoreData.components[component] !== undefined) {
          const adjustment = scoreData.components[component] * (multiplier - 1) * 0.1; // 10% of component impact
          adjustedScore += adjustment;
        }
      });
      
      // Apply lifecycle base multiplier
      const lifecycleMultiplier = this.getLifecycleMultiplier(lifecycle);
      adjustedScore *= lifecycleMultiplier;
      
      return {
        ...scoreData,
        lifecycleAdjustedScore: Math.max(0, Math.min(100, adjustedScore)),
        lifecycleMultiplier
      };
    });
  }

  /**
   * Apply whale activity bonus for meme coins
   */
  applyWhaleActivityBonus(lifecycleScores) {
    console.log('🐋 Detecting whale activity...');
    
    return lifecycleScores.map(scoreData => {
      const narrative = scoreData.narrative;
      let whaleBonus = 0;
      
      // Check for whale activity indicators in tokens
      if (narrative.tokens && Array.isArray(narrative.tokens)) {
        narrative.tokens.forEach(token => {
          // Large volume spikes indicate whale activity
          const volume24h = token.volume24h || token.onChainMetrics?.volume24h || 0;
          const marketCap = token.marketCap || 0;
          
          if (volume24h > 0 && marketCap > 0) {
            const volumeToMcapRatio = volume24h / marketCap;
            
            // High volume-to-market-cap ratio suggests whale activity
            if (volumeToMcapRatio > 0.5) {
              whaleBonus += 3; // 3 point bonus for whale activity
            } else if (volumeToMcapRatio > 0.2) {
              whaleBonus += 1; // 1 point bonus for moderate activity
            }
          }
          
          // Large price movements can indicate whale buys/sells
          const priceChange = Math.abs(token.onChainMetrics?.priceChange24h || 0);
          if (priceChange > 50) {
            whaleBonus += 2; // Significant price movement
          } else if (priceChange > 20) {
            whaleBonus += 1; // Moderate price movement
          }
        });
      }
      
      // Cap whale bonus at 5 points
      whaleBonus = Math.min(5, whaleBonus);
      
      const whaleAdjustedScore = Math.max(0, Math.min(100, scoreData.lifecycleAdjustedScore + whaleBonus));
      
      return {
        ...scoreData,
        whaleBonus,
        whaleAdjustedScore
      };
    });
  }

  /**
   * Calculate correlation matrix between narratives
   */
  calculateCorrelationMatrix(narratives) {
    console.log('🔗 Calculating narrative correlations...');
    
    const correlations = {};
    
    for (let i = 0; i < narratives.length; i++) {
      for (let j = i + 1; j < narratives.length; j++) {
        const narrative1 = narratives[i];
        const narrative2 = narratives[j];
        
        const correlation = this.calculatePairCorrelation(narrative1, narrative2);
        const key = `${narrative1.id}_${narrative2.id}`;
        
        correlations[key] = {
          narrative1: narrative1.name,
          narrative2: narrative2.name,
          correlation,
          type: this.classifyCorrelation(correlation)
        };
      }
    }
    
    // Store for future use
    this.correlationMatrix = new Map(Object.entries(correlations));
    
    return correlations;
  }

  /**
   * Apply correlation-based score adjustments
   */
  applyCorrelationAdjustments(lifecycleScores, correlations) {
    console.log('🔗 Applying correlation adjustments...');
    
    return lifecycleScores.map(scoreData => {
      const narrative = scoreData.narrative;
      let correlationPenalty = 0;
      
      // Calculate penalty for highly correlated narratives
      Object.values(correlations).forEach(corr => {
        if ((corr.narrative1 === narrative.name || corr.narrative2 === narrative.name) &&
            Math.abs(corr.correlation) > this.config.correlationThreshold) {
          
          // Penalize high positive correlation (competing narratives)
          if (corr.correlation > 0) {
            correlationPenalty += corr.correlation * 5; // Up to 5 point penalty
          }
          // Bonus for negative correlation (complementary narratives)
          else {
            correlationPenalty += corr.correlation * 3; // Up to 3 point bonus
          }
        }
      });
      
      const finalScore = Math.max(0, Math.min(100, scoreData.whaleAdjustedScore - correlationPenalty));
      
      return {
        ...scoreData,
        correlationPenalty,
        finalScore
      };
    });
  }

  /**
   * Calculate delta scores (change from previous calculation)
   */
  calculateDeltaScores(correlationScores, narratives) {
    return correlationScores.map(scoreData => {
      const narrative = scoreData.narrative;
      const previousScore = this.lastScores.get(narrative.id) || scoreData.finalScore;
      const deltaScore = scoreData.finalScore - previousScore;
      const deltaPercent = previousScore > 0 ? (deltaScore / previousScore) * 100 : 0;
      
      return {
        ...scoreData,
        deltaScore,
        deltaPercent,
        trend: this.classifyTrend(deltaScore, deltaPercent)
      };
    });
  }

  /**
   * Rank narratives by final score
   */
  rankNarratives(scoresWithDeltas, narratives) {
    return scoresWithDeltas
      .sort((a, b) => b.finalScore - a.finalScore)
      .map((scoreData, index) => ({
        ...scoreData.narrative,
        finalScore: scoreData.finalScore,
        rank: index + 1,
        components: scoreData.components,
        deltaScore: scoreData.deltaScore,
        deltaPercent: scoreData.deltaPercent,
        trend: scoreData.trend,
        scoreBreakdown: {
          base: scoreData.baseScore,
          themeAdjusted: scoreData.themeAdjustedScore,
          lifecycleAdjusted: scoreData.lifecycleAdjustedScore,
          whaleBonus: scoreData.whaleBonus || 0,
          correlationPenalty: scoreData.correlationPenalty || 0
        }
      }));
  }

  /**
   * Adapt scoring weights based on performance
   */
  adaptWeights(rankedNarratives) {
    console.log('⚖️ Adapting scoring weights...');
    
    const weightAdjustments = {};
    
    // Analyze which components correlate with actual performance
    const performanceCorrelations = this.analyzeComponentPerformance(rankedNarratives);
    
    // Adjust weights based on performance correlation
    Object.entries(performanceCorrelations).forEach(([component, correlation]) => {
      const currentWeight = this.config.baseWeights[component];
      const adjustment = correlation * this.config.adaptationRate;
      const newWeight = Math.max(
        this.config.minWeight,
        Math.min(this.config.maxWeight, currentWeight + adjustment)
      );
      
      if (Math.abs(newWeight - currentWeight) > 0.01) {
        this.config.baseWeights[component] = newWeight;
        weightAdjustments[component] = {
          old: currentWeight,
          new: newWeight,
          change: newWeight - currentWeight,
          reason: correlation > 0 ? 'positive_correlation' : 'negative_correlation'
        };
      }
    });
    
    // Normalize weights to sum to 1
    this.normalizeWeights();
    
    return weightAdjustments;
  }

  /**
   * Get top narratives by score
   * @param {number} count - Number of top narratives to return
   * @returns {Array} Array of top-ranked narratives
   */
  getTopNarratives(count = 5) {
    if (!this.lastRankedNarratives) return [];
    return this.lastRankedNarratives.slice(0, count);
  }

  /**
   * Get emerging narratives (in growth phase)
   * @returns {Array} Array of emerging narratives
   */
  getEmergingNarratives() {
    if (!this.lastRankedNarratives) return [];
    
    return this.lastRankedNarratives.filter(narrative => 
      narrative.lifecycle?.stage === 'emerging' || 
      narrative.lifecycle?.stage === 'growing' ||
      narrative.trend === 'rising'
    );
  }

  /**
   * Get declining narratives
   * @returns {Array} Array of declining narratives
   */
  getDecliningNarratives() {
    if (!this.lastRankedNarratives) return [];
    
    return this.lastRankedNarratives.filter(narrative => 
      narrative.lifecycle?.stage === 'declining' ||
      narrative.trend === 'falling'
    );
  }

  // Helper methods for meme coin-specific score calculations

  normalizeScore(value, min, max) {
    return Math.max(0, Math.min(1, (value - min) / Math.max(1, max - min)));
  }

  /**
   * Calculate maximum metrics across all narratives for normalization
   */
  calculateMaxMetrics(narratives) {
    const maxVolume = Math.max(1, ...narratives.map(n => this.extractTotalVolume(n)));
    const maxLiquidity = Math.max(1, ...narratives.map(n => this.extractTotalLiquidity(n)));
    const maxHolders = Math.max(1, ...narratives.map(n => this.extractTotalHolders(n)));
    const maxPriceChange = Math.max(1, ...narratives.map(n => this.extractAvgPriceChange(n)));
    const maxSocial = Math.max(1, ...narratives.map(n => this.extractSocialScore(n)));

    return { maxVolume, maxLiquidity, maxHolders, maxPriceChange, maxSocial };
  }

  /**
   * Calculate volume score for a narrative
   */
  calculateVolumeScore(narrative, maxVolume) {
    const totalVolume = this.extractTotalVolume(narrative);
    return Math.min(1, totalVolume / maxVolume);
  }

  /**
   * Calculate social engagement score
   */
  calculateSocialScore(narrative, maxSocial) {
    const socialScore = this.extractSocialScore(narrative);
    return Math.min(1, socialScore / maxSocial);
  }

  /**
   * Calculate liquidity score
   */
  calculateLiquidityScore(narrative, maxLiquidity) {
    const totalLiquidity = this.extractTotalLiquidity(narrative);
    return Math.min(1, totalLiquidity / maxLiquidity);
  }

  /**
   * Calculate holders score
   */
  calculateHoldersScore(narrative, maxHolders) {
    const totalHolders = this.extractTotalHolders(narrative);
    return Math.min(1, totalHolders / maxHolders);
  }

  /**
   * Calculate price volatility score
   */
  calculateVolatilityScore(narrative, maxPriceChange) {
    const avgPriceChange = this.extractAvgPriceChange(narrative);
    // For meme coins, volatility is often positive (indicates "hype")
    const volatilityScore = Math.abs(avgPriceChange) / Math.max(1, maxPriceChange);
    return Math.min(1, volatilityScore);
  }

  /**
   * Extract total 24h volume from narrative tokens
   */
  extractTotalVolume(narrative) {
    if (!narrative.tokens || !Array.isArray(narrative.tokens)) {
      return narrative.volume || 0;
    }
    
    return narrative.tokens.reduce((total, token) => {
      return total + (token.volume24h || token.onChainMetrics?.volume24h || 0);
    }, 0);
  }

  /**
   * Extract total liquidity from narrative tokens
   */
  extractTotalLiquidity(narrative) {
    if (!narrative.tokens || !Array.isArray(narrative.tokens)) {
      return narrative.liquidity || 0;
    }
    
    return narrative.tokens.reduce((total, token) => {
      return total + (token.onChainMetrics?.liquidityUSD || 0);
    }, 0);
  }

  /**
   * Extract total holders from narrative tokens
   */
  extractTotalHolders(narrative) {
    if (!narrative.tokens || !Array.isArray(narrative.tokens)) {
      return narrative.holders || 0;
    }
    
    return narrative.tokens.reduce((total, token) => {
      return total + (token.holders || token.onChainMetrics?.uniqueWallets24h || 0);
    }, 0);
  }

  /**
   * Extract average price change from narrative tokens
   */
  extractAvgPriceChange(narrative) {
    if (!narrative.tokens || !Array.isArray(narrative.tokens)) {
      return Math.abs(narrative.priceChange24h || 0);
    }
    
    const validTokens = narrative.tokens.filter(token => 
      token.onChainMetrics?.priceChange24h !== undefined
    );
    
    if (validTokens.length === 0) return 0;
    
    const avgChange = validTokens.reduce((sum, token) => {
      return sum + Math.abs(token.onChainMetrics.priceChange24h);
    }, 0) / validTokens.length;
    
    return avgChange;
  }

  /**
   * Extract social engagement score
   */
  extractSocialScore(narrative) {
    if (!narrative.tokens || !Array.isArray(narrative.tokens)) {
      return narrative.mentions || 0;
    }
    
    return narrative.tokens.reduce((total, token) => {
      const social = token.socialMetrics || {};
      return total + (social.twitterFollowers || 0) + (social.telegramMembers || 0);
    }, 0);
  }

  calculateMomentumScore(narrative) {
    // For meme coins, momentum is primarily driven by volume and social activity
    let momentum = 0;
    
    // Volume momentum (30% weight)
    const recentVolume = this.extractTotalVolume(narrative);
    const historicalVolume = narrative.historicalVolume || recentVolume * 0.8; // Assume 20% growth
    if (historicalVolume > 0) {
      const volumeGrowth = (recentVolume - historicalVolume) / historicalVolume;
      momentum += Math.max(0, Math.min(1, volumeGrowth + 0.5)) * 0.3;
    } else {
      momentum += 0.15; // Base volume score
    }
    
    // Social momentum (30% weight)
    const socialScore = this.extractSocialScore(narrative);
    const socialGrowth = narrative.socialGrowth || 0.1; // Default slight growth
    momentum += Math.max(0, Math.min(1, socialGrowth + 0.3)) * 0.3;
    
    // Price momentum (25% weight)
    const avgPriceChange = this.extractAvgPriceChange(narrative);
    if (avgPriceChange > 0) {
      momentum += Math.min(1, avgPriceChange / 100) * 0.25; // Normalize to percentage
    }
    
    // Holder growth momentum (15% weight)
    const holderGrowth = narrative.holderGrowth || 0.05; // Default slight growth
    momentum += Math.max(0, Math.min(1, holderGrowth + 0.2)) * 0.15;
    
    return Math.max(0.1, Math.min(1, momentum)); // Ensure minimum momentum
  }

  calculateCommunityScore(narrative) {
    const characteristics = narrative.characteristics;
    if (!characteristics?.community) return 0.5;
    
    const community = characteristics.community;
    let score = 0;
    
    // Community size factor
    const sizeMultipliers = { micro: 0.2, small: 0.4, medium: 0.6, large: 0.8, massive: 1.0 };
    score += sizeMultipliers[community.size] || 0.5;
    
    // Engagement factor
    if (community.engagement !== undefined) {
      score += community.engagement * 0.5;
    }
    
    // Growth factor
    if (community.growth !== undefined) {
      score += Math.max(0, community.growth) * 0.3;
    }
    
    return Math.max(0, Math.min(1, score / 1.8)); // Normalize
  }

  calculateCorrelationPenalty(narrative) {
    // Start with neutral correlation score
    let penalty = 0.5;
    
    // Check against stored correlations
    for (const [key, correlation] of this.correlationMatrix) {
      if (key.includes(narrative.id)) {
        if (correlation.correlation > this.config.correlationThreshold) {
          penalty -= 0.1; // Reduce score for high positive correlation
        } else if (correlation.correlation < -this.config.correlationThreshold) {
          penalty += 0.1; // Boost score for negative correlation
        }
      }
    }
    
    return Math.max(0, Math.min(1, penalty));
  }

  getVolatilityBonus(volatility) {
    const volatilityScores = { stable: 0.1, low: 0.3, moderate: 0.6, high: 0.8, extreme: 1.0 };
    return volatilityScores[volatility.level] || 0.5;
  }

  getSocialBonus(social) {
    const socialScores = { minimal: 0.1, low: 0.3, moderate: 0.6, high: 0.8, viral: 1.0 };
    return socialScores[social.mentions] || 0.5;
  }

  getCommunityBonus(community) {
    const communityScores = { micro: 0.2, small: 0.4, medium: 0.6, large: 0.8, massive: 1.0 };
    return communityScores[community.size] || 0.5;
  }

  getGrowthBonus(temporal) {
    if (!temporal.momentum) return 0.5;
    return Math.max(0, Math.min(1, temporal.momentum + 0.5));
  }

  getLifecycleMultiplier(lifecycle) {
    const multipliers = {
      emerging: 1.1,
      growing: 1.2,
      peak: 1.0,
      declining: 0.8,
      stable: 0.9
    };
    return multipliers[lifecycle] || 1.0;
  }

  calculatePairCorrelation(narrative1, narrative2) {
    let correlation = 0;
    let factors = 0;
    
    // Theme correlation
    if (narrative1.themes?.primary?.theme === narrative2.themes?.primary?.theme) {
      correlation += 0.6;
      factors++;
    }
    
    // Lifecycle correlation
    if (narrative1.lifecycle?.stage === narrative2.lifecycle?.stage) {
      correlation += 0.3;
      factors++;
    }
    
    // Strength correlation
    const strengthDiff = Math.abs((narrative1.strength || 0) - (narrative2.strength || 0));
    if (strengthDiff < 20) { // Similar strength
      correlation += 0.2;
      factors++;
    }
    
    // Token overlap correlation
    const overlap = this.calculateTokenOverlap(narrative1.tokens || [], narrative2.tokens || []);
    correlation += overlap * 0.4;
    factors++;
    
    return factors > 0 ? correlation / factors : 0;
  }

  calculateTokenOverlap(tokens1, tokens2) {
    if (tokens1.length === 0 || tokens2.length === 0) return 0;
    
    const addresses1 = new Set(tokens1.map(t => t.address));
    const addresses2 = new Set(tokens2.map(t => t.address));
    const intersection = new Set([...addresses1].filter(x => addresses2.has(x)));
    
    return intersection.size / Math.min(addresses1.size, addresses2.size);
  }

  classifyCorrelation(correlation) {
    if (correlation > 0.7) return 'strong_positive';
    if (correlation > 0.3) return 'moderate_positive';
    if (correlation > -0.3) return 'weak';
    if (correlation > -0.7) return 'moderate_negative';
    return 'strong_negative';
  }

  classifyTrend(deltaScore, deltaPercent) {
    if (deltaScore > 5 || deltaPercent > 10) return 'rising';
    if (deltaScore < -5 || deltaPercent < -10) return 'falling';
    return 'stable';
  }

  analyzeComponentPerformance(rankedNarratives) {
    // Simplified performance analysis
    const correlations = {};
    const components = ['strength', 'momentum', 'community', 'novelty', 'correlation'];
    
    components.forEach(component => {
      let correlation = 0;
      let validNarratives = 0;
      
      rankedNarratives.forEach((narrative, index) => {
        if (narrative.components && narrative.components[component] !== undefined) {
          // Higher component score should correlate with better rank (lower index)
          const rankScore = 1 - (index / rankedNarratives.length);
          correlation += narrative.components[component] * rankScore;
          validNarratives++;
        }
      });
      
      correlations[component] = validNarratives > 0 ? correlation / validNarratives - 0.5 : 0;
    });
    
    return correlations;
  }

  normalizeWeights() {
    const weights = this.config.baseWeights;
    const sum = Object.values(weights).reduce((a, b) => a + b, 0);
    
    if (sum > 0) {
      Object.keys(weights).forEach(key => {
        weights[key] = weights[key] / sum;
      });
    }
  }

  updateScoreHistory(rankedNarratives) {
    rankedNarratives.forEach(narrative => {
      this.lastScores.set(narrative.id, narrative.finalScore);
    });
    
    this.lastRankedNarratives = rankedNarratives;
  }
}

module.exports = AdaptiveNarrativeScoringEngine;