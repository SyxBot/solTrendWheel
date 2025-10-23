/**
 * Narrative Characterization System
 * 
 * Automatically analyzes token clusters to identify and characterize
 * crypto narratives with intelligent naming, lifecycle tracking,
 * and strength calculation.
 */

class NarrativeCharacterizationEngine {
  constructor(config = {}) {
    this.config = {
      minNarrativeStrength: config.minNarrativeStrength || 20,
      confidenceThreshold: config.confidenceThreshold || 0.6,
      lifecycleThresholds: {
        emerging: config.emergingThreshold || 30,
        growing: config.growingThreshold || 60,
        peak: config.peakThreshold || 80,
        declining: config.decliningThreshold || 40
      },
      updateInterval: config.updateInterval || 15 * 60 * 1000, // 15 minutes
      ...config
    };
    
    this.narrativeProfiles = new Map(); // Store narrative profiles over time
    this.themeKeywords = this.initializeThemeKeywords();
    this.narrativeHistory = new Map(); // Track narrative evolution
  }

  /**
   * Initialize the characterization engine
   * @returns {Promise<void>}
   */
  async initialize() {
    console.log('📝 Initializing Narrative Characterization Engine...');
    this.initialized = true;
    console.log('✅ Narrative Characterization Engine initialized');
  }

  /**
   * Save engine state for persistence
   * @returns {Promise<void>}
   */
  async saveState() {
    console.log('💾 Saving Narrative Characterization Engine state...');
    return Promise.resolve();
  }

  /**
   * Characterize multiple narratives from clusters
   * @param {Array} clusters - Array of token clusters
   * @returns {Array} Array of characterized narratives
   */
  async characterizeNarratives(clusters) {
    console.log(`📝 Characterizing ${clusters.length} narrative clusters...`);
    const narratives = [];
    
    for (const cluster of clusters) {
      try {
        const narrative = await this.characterizeNarrative(cluster);
        if (narrative) {
          narratives.push(narrative);
        }
      } catch (error) {
        console.error('Error characterizing cluster:', error);
      }
    }
    
    return narratives;
  }

  /**
   * Initialize predefined theme keywords for better classification
   */
  initializeThemeKeywords() {
    return {
      // Animal themes
      animals: {
        keywords: ['dog', 'doge', 'shib', 'shiba', 'puppy', 'cat', 'kitten', 'bear', 'bull', 'tiger', 'lion', 'wolf', 'fox', 'rabbit', 'bird', 'fish', 'frog', 'pepe'],
        patterns: /\b(dog|doge|shib|puppy|cat|kitten|bear|bull|tiger|lion|wolf|fox|rabbit|bird|fish|frog|pepe)\b/i,
        weight: 1.0
      },
      
      // AI and Technology themes
      ai: {
        keywords: ['ai', 'artificial', 'intelligence', 'neural', 'machine', 'learning', 'gpt', 'chat', 'bot', 'robot', 'tech', 'protocol', 'network'],
        patterns: /\b(ai|artificial|intelligence|neural|machine|learning|gpt|chat|bot|robot|tech|protocol|network)\b/i,
        weight: 1.2
      },
      
      // Gaming and Metaverse themes
      gaming: {
        keywords: ['game', 'gaming', 'play', 'metaverse', 'nft', 'avatar', 'virtual', 'vr', 'ar', 'world', 'quest', 'adventure'],
        patterns: /\b(game|gaming|play|metaverse|nft|avatar|virtual|vr|ar|world|quest|adventure)\b/i,
        weight: 1.1
      },
      
      // DeFi and Finance themes
      defi: {
        keywords: ['defi', 'finance', 'yield', 'farm', 'stake', 'liquidity', 'swap', 'bridge', 'lending', 'borrowing', 'treasury', 'vault'],
        patterns: /\b(defi|finance|yield|farm|stake|liquidity|swap|bridge|lending|borrowing|treasury|vault)\b/i,
        weight: 1.0
      },
      
      // Meme and Culture themes
      meme: {
        keywords: ['meme', 'moon', 'rocket', 'diamond', 'hands', 'hodl', 'ape', 'chad', 'wojak', 'based', 'cringe'],
        patterns: /\b(meme|moon|rocket|diamond|hands|hodl|ape|chad|wojak|based|cringe)\b/i,
        weight: 0.9
      },
      
      // Food themes
      food: {
        keywords: ['pizza', 'burger', 'taco', 'sushi', 'cake', 'cookie', 'bread', 'donut', 'sandwich', 'pasta'],
        patterns: /\b(pizza|burger|taco|sushi|cake|cookie|bread|donut|sandwich|pasta)\b/i,
        weight: 0.8
      },
      
      // Political themes
      political: {
        keywords: ['trump', 'biden', 'political', 'election', 'vote', 'democracy', 'republican', 'democrat', 'president'],
        patterns: /\b(trump|biden|political|election|vote|democracy|republican|democrat|president)\b/i,
        weight: 1.1
      },
      
      // Real World Assets
      rwa: {
        keywords: ['real', 'estate', 'gold', 'silver', 'commodity', 'asset', 'bond', 'treasury', 'backed', 'reserve'],
        patterns: /\b(real|estate|gold|silver|commodity|asset|bond|treasury|backed|reserve)\b/i,
        weight: 1.3
      },
      
      // Space and Science themes
      space: {
        keywords: ['space', 'mars', 'moon', 'lunar', 'solar', 'galaxy', 'star', 'planet', 'cosmos', 'orbit', 'rocket'],
        patterns: /\b(space|mars|moon|lunar|solar|galaxy|star|planet|cosmos|orbit|rocket)\b/i,
        weight: 1.0
      },
      
      // Energy and Environment themes
      energy: {
        keywords: ['energy', 'solar', 'wind', 'green', 'carbon', 'climate', 'renewable', 'sustainable', 'eco'],
        patterns: /\b(energy|solar|wind|green|carbon|climate|renewable|sustainable|eco)\b/i,
        weight: 1.1
      }
    };
  }

  /**
   * Main function to characterize a narrative from a token cluster
   * @param {Object} cluster - Token cluster from clustering engine
   * @returns {Object} Characterized narrative profile
   */
  async characterizeNarrative(cluster) {
    console.log(`🎭 Characterizing narrative for cluster with ${cluster.tokens.length} tokens...`);
    
    try {
      // Step 1: Analyze cluster content
      const contentAnalysis = this.analyzeClusterContent(cluster);
      
      // Step 2: Generate narrative names
      const nameOptions = this.generateNarrativeNames(contentAnalysis);
      
      // Step 3: Determine primary and secondary themes
      const themes = this.identifyThemes(contentAnalysis);
      
      // Step 4: Calculate narrative characteristics
      const characteristics = this.calculateNarrativeCharacteristics(cluster, contentAnalysis);
      
      // Step 5: Determine lifecycle stage
      const lifecycle = this.determineLifecycleStage(cluster, characteristics);
      
      // Step 6: Calculate overall strength
      const strength = this.calculateNarrativeStrength(cluster, themes, characteristics);
      
      // Step 7: Create comprehensive profile
      const profile = {
        id: this.generateNarrativeId(cluster, themes.primary),
        name: nameOptions[0].name,
        nameOptions: nameOptions,
        themes: themes,
        characteristics: characteristics,
        lifecycle: lifecycle,
        strength: strength,
        confidence: this.calculateConfidence(contentAnalysis, themes, characteristics),
        tokens: cluster.tokens,
        metadata: {
          tokenCount: cluster.tokens.length,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          version: 1
        }
      };
      
      // Step 8: Store in narrative profiles
      this.narrativeProfiles.set(profile.id, profile);
      
      console.log(`✅ Characterized narrative: "${profile.name}" (${profile.strength}/100 strength)`);
      return profile;
      
    } catch (error) {
      console.error('❌ Error in narrative characterization:', error);
      return null;
    }
  }

  /**
   * Analyze cluster content to extract key information
   */
  analyzeClusterContent(cluster) {
    const tokens = cluster.tokens;
    const allText = tokens.map(t => `${t.name || ''} ${t.symbol || ''}`).join(' ').toLowerCase();
    
    // Extract keywords and their frequencies
    const wordFreq = this.extractWordFrequencies(allText);
    const keywordMatches = this.matchThemeKeywords(allText);
    
    // Analyze token names and symbols for patterns
    const namePatterns = this.analyzeNamePatterns(tokens);
    
    // Calculate market metrics
    const marketMetrics = this.calculateMarketMetrics(tokens);
    
    // Analyze creation timing
    const temporalPatterns = this.analyzeTemporalPatterns(tokens);
    
    return {
      wordFrequencies: wordFreq,
      keywordMatches: keywordMatches,
      namePatterns: namePatterns,
      marketMetrics: marketMetrics,
      temporalPatterns: temporalPatterns,
      rawText: allText,
      tokenCount: tokens.length
    };
  }

  /**
   * Generate potential narrative names with confidence scores
   */
  generateNarrativeNames(contentAnalysis) {
    const nameOptions = [];
    
    // Method 1: Theme-based naming
    const themeNames = this.generateThemeBasedNames(contentAnalysis);
    nameOptions.push(...themeNames);
    
    // Method 2: Keyword-based naming
    const keywordNames = this.generateKeywordBasedNames(contentAnalysis);
    nameOptions.push(...keywordNames);
    
    // Method 3: Pattern-based naming
    const patternNames = this.generatePatternBasedNames(contentAnalysis);
    nameOptions.push(...patternNames);
    
    // Method 4: Market-behavior based naming
    const behaviorNames = this.generateBehaviorBasedNames(contentAnalysis);
    nameOptions.push(...behaviorNames);
    
    // Sort by confidence and return top options
    return nameOptions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5)
      .map((option, index) => ({ ...option, rank: index + 1 }));
  }

  /**
   * Identify primary and secondary themes
   */
  identifyThemes(contentAnalysis) {
    const themeScores = new Map();
    
    // Score each theme based on keyword matches
    Object.entries(this.themeKeywords).forEach(([themeName, themeData]) => {
      let score = 0;
      
      // Count keyword matches
      themeData.keywords.forEach(keyword => {
        const freq = contentAnalysis.wordFrequencies.get(keyword) || 0;
        score += freq * themeData.weight;
      });
      
      // Pattern matching bonus
      const patternMatches = (contentAnalysis.rawText.match(themeData.patterns) || []).length;
      score += patternMatches * themeData.weight * 2;
      
      if (score > 0) {
        themeScores.set(themeName, score);
      }
    });
    
    // Sort themes by score
    const sortedThemes = Array.from(themeScores.entries())
      .sort((a, b) => b[1] - a[1]);
    
    return {
      primary: sortedThemes[0] ? {
        theme: sortedThemes[0][0],
        score: sortedThemes[0][1],
        keywords: this.themeKeywords[sortedThemes[0][0]].keywords
      } : null,
      
      secondary: sortedThemes.slice(1, 3).map(([theme, score]) => ({
        theme,
        score,
        keywords: this.themeKeywords[theme].keywords
      })),
      
      allScores: Object.fromEntries(themeScores)
    };
  }

  /**
   * Calculate narrative characteristics
   */
  calculateNarrativeCharacteristics(cluster, contentAnalysis) {
    const tokens = cluster.tokens;
    const metrics = contentAnalysis.marketMetrics;
    
    return {
      // Volatility characteristics
      volatility: {
        level: this.categorizeVolatility(metrics.avgPriceChange),
        score: Math.min(100, Math.abs(metrics.avgPriceChange)),
        description: this.getVolatilityDescription(metrics.avgPriceChange)
      },
      
      // Community characteristics
      community: {
        size: this.categorizeCommunitySize(metrics.totalHolders),
        engagement: this.calculateCommunityEngagement(tokens),
        growth: this.calculateCommunityGrowth(tokens),
        description: this.getCommunityDescription(metrics.totalHolders)
      },
      
      // Market characteristics
      market: {
        cap: this.categorizeMarketCap(metrics.totalMarketCap),
        liquidity: this.categorizeLiquidity(metrics.totalLiquidity),
        volume: this.categorizeVolume(metrics.totalVolume),
        description: this.getMarketDescription(metrics)
      },
      
      // Social characteristics
      social: {
        mentions: this.categorizeSocialActivity(metrics.totalSocialMentions),
        sentiment: this.calculateAverageSentiment(tokens),
        virality: this.calculateViralityPotential(tokens),
        description: this.getSocialDescription(metrics.totalSocialMentions)
      },
      
      // Temporal characteristics
      temporal: {
        age: this.categorizeNarrativeAge(contentAnalysis.temporalPatterns.avgAge),
        emergence: contentAnalysis.temporalPatterns.emergencePattern,
        momentum: this.calculateMomentum(contentAnalysis.temporalPatterns),
        description: this.getTemporalDescription(contentAnalysis.temporalPatterns)
      }
    };
  }

  /**
   * Determine lifecycle stage of the narrative
   */
  determineLifecycleStage(cluster, characteristics) {
    const strength = cluster.strength || 0;
    const momentum = characteristics.temporal.momentum;
    const growth = characteristics.community.growth;
    const age = characteristics.temporal.age;
    
    // Calculate lifecycle score
    let lifecycleScore = strength;
    lifecycleScore += momentum * 20;
    lifecycleScore += growth * 15;
    
    // Age factor
    if (age === 'new') lifecycleScore *= 0.8; // New narratives start lower
    if (age === 'mature') lifecycleScore *= 1.1; // Mature narratives get bonus
    
    let stage;
    let confidence;
    
    if (lifecycleScore < this.config.lifecycleThresholds.emerging) {
      stage = 'emerging';
      confidence = 0.7;
    } else if (lifecycleScore < this.config.lifecycleThresholds.growing) {
      stage = 'growing';
      confidence = 0.8;
    } else if (lifecycleScore < this.config.lifecycleThresholds.peak) {
      stage = 'peak';
      confidence = 0.9;
    } else {
      // Check if declining
      if (momentum < 0 && growth < 0) {
        stage = 'declining';
        confidence = 0.8;
      } else {
        stage = 'peak';
        confidence = 0.85;
      }
    }
    
    return {
      stage,
      confidence,
      score: lifecycleScore,
      factors: {
        strength,
        momentum,
        growth,
        age
      },
      description: this.getLifecycleDescription(stage, lifecycleScore)
    };
  }

  /**
   * Calculate overall narrative strength
   */
  calculateNarrativeStrength(cluster, themes, characteristics) {
    let strength = cluster.strength || 0;
    
    // Theme strength bonus
    if (themes.primary) {
      strength += themes.primary.score * 5;
    }
    themes.secondary.forEach(theme => {
      strength += theme.score * 2;
    });
    
    // Characteristic bonuses
    strength += characteristics.market.volume * 0.1;
    strength += characteristics.community.engagement * 10;
    strength += characteristics.social.virality * 15;
    strength += Math.abs(characteristics.volatility.score) * 0.2;
    
    // Lifecycle stage multiplier
    const stageMultipliers = {
      emerging: 0.8,
      growing: 1.2,
      peak: 1.0,
      declining: 0.6
    };
    
    strength *= stageMultipliers[characteristics.temporal.stage] || 1.0;
    
    return Math.min(100, Math.max(0, strength));
  }

  /**
   * Calculate confidence in the characterization
   */
  calculateConfidence(contentAnalysis, themes, characteristics) {
    let confidence = 0.5; // Base confidence
    
    // Theme confidence
    if (themes.primary && themes.primary.score > 5) {
      confidence += 0.3;
    }
    if (themes.secondary.length > 0) {
      confidence += 0.1;
    }
    
    // Data quality confidence
    if (contentAnalysis.tokenCount >= 5) {
      confidence += 0.1;
    }
    if (contentAnalysis.marketMetrics.totalVolume > 100000) {
      confidence += 0.1;
    }
    
    // Pattern recognition confidence
    if (contentAnalysis.namePatterns.commonPatterns.length > 0) {
      confidence += 0.1;
    }
    
    return Math.min(1.0, confidence);
  }

  /**
   * Update all narrative profiles periodically
   */
  async updateNarrativeProfiles() {
    console.log(`🔄 Updating ${this.narrativeProfiles.size} narrative profiles...`);
    
    const updatedProfiles = new Map();
    let significantChanges = 0;
    
    for (const [id, profile] of this.narrativeProfiles) {
      try {
        // Re-characterize the narrative with current data
        const mockCluster = {
          tokens: profile.tokens,
          strength: profile.strength
        };
        
        const updatedProfile = await this.characterizeNarrative(mockCluster);
        
        if (updatedProfile) {
          // Check for significant changes
          const changes = this.detectSignificantChanges(profile, updatedProfile);
          
          if (changes.hasSignificantChanges) {
            significantChanges++;
            console.log(`📈 Significant changes detected in "${profile.name}":`, changes.changes);
          }
          
          // Preserve historical data
          updatedProfile.metadata.version = profile.metadata.version + 1;
          updatedProfile.metadata.createdAt = profile.metadata.createdAt;
          updatedProfile.metadata.previousStrength = profile.strength;
          updatedProfile.metadata.changes = changes;
          
          updatedProfiles.set(id, updatedProfile);
        }
        
      } catch (error) {
        console.error(`❌ Error updating profile ${id}:`, error);
        // Keep the old profile if update fails
        updatedProfiles.set(id, profile);
      }
    }
    
    this.narrativeProfiles = updatedProfiles;
    
    console.log(`✅ Updated profiles complete. ${significantChanges} narratives had significant changes.`);
    
    return {
      totalProfiles: updatedProfiles.size,
      significantChanges,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Detect emerging sub-narratives within existing narratives
   */
  detectEmergingSubNarratives(profile) {
    const tokens = profile.tokens;
    
    // Look for sub-clusters within the narrative
    const subClusters = this.identifySubClusters(tokens);
    
    const subNarratives = [];
    
    for (const subCluster of subClusters) {
      if (subCluster.tokens.length >= 3) { // Minimum size for sub-narrative
        const subProfile = this.characterizeNarrative(subCluster);
        
        if (subProfile && subProfile.themes.primary.theme !== profile.themes.primary.theme) {
          subNarratives.push({
            ...subProfile,
            parentNarrative: profile.id,
            isSubNarrative: true
          });
        }
      }
    }
    
    return subNarratives;
  }

  // Helper methods for content analysis

  extractWordFrequencies(text) {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const freq = new Map();
    
    words.forEach(word => {
      if (word.length > 2) { // Ignore very short words
        freq.set(word, (freq.get(word) || 0) + 1);
      }
    });
    
    return freq;
  }

  matchThemeKeywords(text) {
    const matches = {};
    
    Object.entries(this.themeKeywords).forEach(([theme, themeData]) => {
      const themeMatches = [];
      
      themeData.keywords.forEach(keyword => {
        if (text.includes(keyword)) {
          themeMatches.push(keyword);
        }
      });
      
      if (themeMatches.length > 0) {
        matches[theme] = themeMatches;
      }
    });
    
    return matches;
  }

  analyzeNamePatterns(tokens) {
    const names = tokens.map(t => t.name || '').filter(n => n.length > 0);
    const symbols = tokens.map(t => t.symbol || '').filter(s => s.length > 0);
    
    // Find common prefixes and suffixes
    const prefixes = this.findCommonPrefixes(names);
    const suffixes = this.findCommonSuffixes(names);
    
    // Find pattern in symbols
    const symbolPatterns = this.findSymbolPatterns(symbols);
    
    return {
      commonPrefixes: prefixes,
      commonSuffixes: suffixes,
      symbolPatterns: symbolPatterns,
      commonPatterns: [...prefixes, ...suffixes, ...symbolPatterns]
    };
  }

  calculateMarketMetrics(tokens) {
    const metrics = {
      totalVolume: 0,
      totalLiquidity: 0,
      totalMarketCap: 0,
      totalHolders: 0,
      totalSocialMentions: 0,
      avgPriceChange: 0,
      maxPriceChange: 0,
      minPriceChange: 0
    };
    
    let validTokens = 0;
    
    tokens.forEach(token => {
      if (token.volume) {
        metrics.totalVolume += token.volume;
        validTokens++;
      }
      if (token.liquidity) metrics.totalLiquidity += token.liquidity;
      if (token.marketCap) metrics.totalMarketCap += token.marketCap;
      if (token.holders) metrics.totalHolders += token.holders;
      if (token.socialMentions) metrics.totalSocialMentions += token.socialMentions;
      
      const priceChange = token.priceChange24h || 0;
      metrics.avgPriceChange += priceChange;
      metrics.maxPriceChange = Math.max(metrics.maxPriceChange, priceChange);
      metrics.minPriceChange = Math.min(metrics.minPriceChange, priceChange);
    });
    
    if (validTokens > 0) {
      metrics.avgPriceChange /= validTokens;
    }
    
    return metrics;
  }

  analyzeTemporalPatterns(tokens) {
    const now = Date.now();
    const ages = tokens.map(token => {
      const created = token.createdAt || token.timestamp || now;
      return now - created;
    });
    
    const avgAge = ages.reduce((sum, age) => sum + age, 0) / ages.length;
    const minAge = Math.min(...ages);
    const maxAge = Math.max(...ages);
    
    // Analyze emergence pattern
    const emergencePattern = this.analyzeEmergencePattern(ages);
    
    return {
      avgAge,
      minAge,
      maxAge,
      ageSpread: maxAge - minAge,
      emergencePattern,
      isNewNarrative: avgAge < 24 * 60 * 60 * 1000, // Less than 24 hours
      isMatureNarrative: avgAge > 7 * 24 * 60 * 60 * 1000 // More than 7 days
    };
  }

  // Helper methods for name generation

  generateThemeBasedNames(contentAnalysis) {
    const names = [];
    
    Object.entries(contentAnalysis.keywordMatches).forEach(([theme, keywords]) => {
      const themeData = this.themeKeywords[theme];
      if (!themeData) return;
      
      const confidence = Math.min(1, keywords.length * themeData.weight * 0.2);
      
      // Generate different name styles
      names.push({
        name: `${this.capitalize(theme)} Narrative`,
        confidence,
        source: 'theme-basic',
        keywords: keywords.slice(0, 3)
      });
      
      if (keywords.length > 1) {
        names.push({
          name: `${this.capitalize(keywords[0])} ${this.capitalize(theme)} Trend`,
          confidence: confidence * 0.9,
          source: 'theme-keyword',
          keywords: keywords.slice(0, 3)
        });
      }
    });
    
    return names;
  }

  generateKeywordBasedNames(contentAnalysis) {
    const names = [];
    const topWords = Array.from(contentAnalysis.wordFrequencies.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    topWords.forEach(([word, freq]) => {
      if (word.length > 3 && freq > 1) {
        const confidence = Math.min(1, freq * 0.2);
        
        names.push({
          name: `${this.capitalize(word)} Token Wave`,
          confidence,
          source: 'keyword-frequency',
          keywords: [word]
        });
      }
    });
    
    return names;
  }

  generatePatternBasedNames(contentAnalysis) {
    const names = [];
    const patterns = contentAnalysis.namePatterns;
    
    patterns.commonPrefixes.forEach(prefix => {
      if (prefix.length > 2) {
        names.push({
          name: `${this.capitalize(prefix)} Series`,
          confidence: 0.7,
          source: 'pattern-prefix',
          keywords: [prefix]
        });
      }
    });
    
    patterns.commonSuffixes.forEach(suffix => {
      if (suffix.length > 2) {
        names.push({
          name: `${this.capitalize(suffix)} Collection`,
          confidence: 0.6,
          source: 'pattern-suffix',
          keywords: [suffix]
        });
      }
    });
    
    return names;
  }

  generateBehaviorBasedNames(contentAnalysis) {
    const names = [];
    const metrics = contentAnalysis.marketMetrics;
    
    // High volatility names
    if (Math.abs(metrics.avgPriceChange) > 100) {
      names.push({
        name: 'High Volatility Movers',
        confidence: 0.8,
        source: 'behavior-volatility',
        keywords: ['volatile', 'explosive']
      });
    }
    
    // High volume names
    if (metrics.totalVolume > 1000000) {
      names.push({
        name: 'Volume Surge Narrative',
        confidence: 0.7,
        source: 'behavior-volume',
        keywords: ['volume', 'surge']
      });
    }
    
    // Community-driven names
    if (metrics.totalHolders > 10000) {
      names.push({
        name: 'Community-Driven Movement',
        confidence: 0.8,
        source: 'behavior-community',
        keywords: ['community', 'holders']
      });
    }
    
    return names;
  }

  // Categorization helper methods

  categorizeVolatility(avgPriceChange) {
    const absChange = Math.abs(avgPriceChange);
    if (absChange > 200) return 'extreme';
    if (absChange > 100) return 'high';
    if (absChange > 50) return 'moderate';
    if (absChange > 20) return 'low';
    return 'stable';
  }

  categorizeCommunitySize(totalHolders) {
    if (totalHolders > 50000) return 'massive';
    if (totalHolders > 10000) return 'large';
    if (totalHolders > 2000) return 'medium';
    if (totalHolders > 500) return 'small';
    return 'micro';
  }

  categorizeMarketCap(totalMarketCap) {
    if (totalMarketCap > 1000000000) return 'mega';
    if (totalMarketCap > 100000000) return 'large';
    if (totalMarketCap > 10000000) return 'medium';
    if (totalMarketCap > 1000000) return 'small';
    return 'micro';
  }

  categorizeLiquidity(totalLiquidity) {
    if (totalLiquidity > 10000000) return 'deep';
    if (totalLiquidity > 1000000) return 'good';
    if (totalLiquidity > 100000) return 'moderate';
    if (totalLiquidity > 10000) return 'shallow';
    return 'thin';
  }

  categorizeVolume(totalVolume) {
    if (totalVolume > 50000000) return 'massive';
    if (totalVolume > 10000000) return 'high';
    if (totalVolume > 1000000) return 'moderate';
    if (totalVolume > 100000) return 'low';
    return 'minimal';
  }

  categorizeSocialActivity(totalMentions) {
    if (totalMentions > 10000) return 'viral';
    if (totalMentions > 1000) return 'high';
    if (totalMentions > 100) return 'moderate';
    if (totalMentions > 10) return 'low';
    return 'minimal';
  }

  categorizeNarrativeAge(avgAge) {
    const hours = avgAge / (60 * 60 * 1000);
    if (hours < 24) return 'new';
    if (hours < 168) return 'fresh'; // 1 week
    if (hours < 720) return 'mature'; // 1 month
    return 'established';
  }

  // Additional helper methods

  generateNarrativeId(cluster, primaryTheme) {
    const tokens = cluster.tokens.slice(0, 3).map(t => t.symbol || t.name).join('-');
    const theme = primaryTheme ? primaryTheme.theme : 'unknown';
    const timestamp = Date.now().toString(36);
    return `${theme}-${tokens}-${timestamp}`.toLowerCase().replace(/[^a-z0-9-]/g, '');
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  findCommonPrefixes(names) {
    const prefixes = [];
    for (let i = 0; i < names.length; i++) {
      for (let j = i + 1; j < names.length; j++) {
        const prefix = this.findCommonPrefix(names[i], names[j]);
        if (prefix.length > 2) {
          prefixes.push(prefix);
        }
      }
    }
    return [...new Set(prefixes)];
  }

  findCommonSuffixes(names) {
    const suffixes = [];
    for (let i = 0; i < names.length; i++) {
      for (let j = i + 1; j < names.length; j++) {
        const suffix = this.findCommonSuffix(names[i], names[j]);
        if (suffix.length > 2) {
          suffixes.push(suffix);
        }
      }
    }
    return [...new Set(suffixes)];
  }

  findCommonPrefix(str1, str2) {
    let i = 0;
    while (i < str1.length && i < str2.length && str1[i].toLowerCase() === str2[i].toLowerCase()) {
      i++;
    }
    return str1.substring(0, i);
  }

  findCommonSuffix(str1, str2) {
    let i = 0;
    while (i < str1.length && i < str2.length && 
           str1[str1.length - 1 - i].toLowerCase() === str2[str2.length - 1 - i].toLowerCase()) {
      i++;
    }
    return str1.substring(str1.length - i);
  }

  findSymbolPatterns(symbols) {
    // Look for common patterns in symbols
    const patterns = [];
    
    // Check for common endings
    const endings = symbols.map(s => s.slice(-3)).filter(e => e.length === 3);
    const endingCounts = {};
    endings.forEach(e => endingCounts[e] = (endingCounts[e] || 0) + 1);
    
    Object.entries(endingCounts).forEach(([ending, count]) => {
      if (count > 1) patterns.push(ending);
    });
    
    return patterns;
  }

  analyzeEmergencePattern(ages) {
    // Analyze how tokens emerged over time
    const sortedAges = ages.sort((a, b) => a - b);
    const timeSpan = sortedAges[sortedAges.length - 1] - sortedAges[0];
    
    if (timeSpan < 60 * 60 * 1000) { // Within 1 hour
      return 'burst';
    } else if (timeSpan < 24 * 60 * 60 * 1000) { // Within 24 hours
      return 'rapid';
    } else if (timeSpan < 7 * 24 * 60 * 60 * 1000) { // Within 1 week
      return 'gradual';
    } else {
      return 'extended';
    }
  }

  calculateCommunityEngagement(tokens) {
    // Simplified engagement calculation
    const avgHolders = tokens.reduce((sum, t) => sum + (t.holders || 0), 0) / tokens.length;
    const avgMentions = tokens.reduce((sum, t) => sum + (t.socialMentions || 0), 0) / tokens.length;
    
    return Math.min(1, (avgMentions / Math.max(1, avgHolders)) * 10);
  }

  calculateCommunityGrowth(tokens) {
    // Placeholder - needs historical data
    return (Math.random() - 0.5) * 0.4;
  }

  calculateAverageSentiment(tokens) {
    const sentiments = tokens.map(t => t.sentiment || 0).filter(s => s !== 0);
    return sentiments.length > 0 ? sentiments.reduce((a, b) => a + b, 0) / sentiments.length : 0;
  }

  calculateViralityPotential(tokens) {
    const totalMentions = tokens.reduce((sum, t) => sum + (t.socialMentions || 0), 0);
    const totalEngagement = tokens.reduce((sum, t) => sum + (t.engagement || 0), 0);
    
    return Math.min(1, Math.sqrt(totalMentions * totalEngagement) / 1000);
  }

  calculateMomentum(temporalPatterns) {
    // Simplified momentum calculation based on emergence pattern
    const momentumMap = {
      'burst': 0.8,
      'rapid': 0.6,
      'gradual': 0.3,
      'extended': 0.1
    };
    
    return momentumMap[temporalPatterns.emergencePattern] || 0;
  }

  // Description generators

  getVolatilityDescription(avgPriceChange) {
    if (avgPriceChange > 200) return 'Extremely volatile with explosive price movements';
    if (avgPriceChange > 100) return 'Highly volatile with significant price swings';
    if (avgPriceChange > 50) return 'Moderately volatile with notable price changes';
    if (avgPriceChange > 20) return 'Low volatility with steady price movement';
    return 'Stable pricing with minimal fluctuations';
  }

  getCommunityDescription(totalHolders) {
    if (totalHolders > 50000) return 'Massive community with widespread adoption';
    if (totalHolders > 10000) return 'Large, active community with strong engagement';
    if (totalHolders > 2000) return 'Medium-sized community with growing interest';
    if (totalHolders > 500) return 'Small but dedicated community';
    return 'Emerging community with early adopters';
  }

  getMarketDescription(metrics) {
    const volume = this.categorizeVolume(metrics.totalVolume);
    const liquidity = this.categorizeLiquidity(metrics.totalLiquidity);
    
    return `${this.capitalize(volume)} trading volume with ${liquidity} liquidity`;
  }

  getSocialDescription(totalMentions) {
    if (totalMentions > 10000) return 'Viral social media presence with massive engagement';
    if (totalMentions > 1000) return 'High social activity with strong community buzz';
    if (totalMentions > 100) return 'Moderate social presence with growing awareness';
    if (totalMentions > 10) return 'Limited social activity with niche following';
    return 'Minimal social presence, mostly under the radar';
  }

  getTemporalDescription(patterns) {
    const emergence = patterns.emergencePattern;
    const age = patterns.isNewNarrative ? 'new' : patterns.isMatureNarrative ? 'mature' : 'developing';
    
    return `${this.capitalize(emergence)} emergence pattern, ${age} narrative stage`;
  }

  getLifecycleDescription(stage, score) {
    const descriptions = {
      emerging: `Early-stage narrative with developing momentum (${Math.round(score)}/100)`,
      growing: `Expanding narrative with increasing adoption (${Math.round(score)}/100)`,
      peak: `Peak narrative with maximum visibility and activity (${Math.round(score)}/100)`,
      declining: `Declining narrative with reduced momentum (${Math.round(score)}/100)`
    };
    
    return descriptions[stage] || `Unknown stage (${Math.round(score)}/100)`;
  }

  detectSignificantChanges(oldProfile, newProfile) {
    const changes = [];
    const threshold = 15; // 15% change threshold
    
    // Check strength change
    const strengthChange = Math.abs(newProfile.strength - oldProfile.strength);
    if (strengthChange > threshold) {
      changes.push(`Strength changed by ${strengthChange.toFixed(1)} points`);
    }
    
    // Check lifecycle stage change
    if (newProfile.lifecycle.stage !== oldProfile.lifecycle.stage) {
      changes.push(`Lifecycle changed from ${oldProfile.lifecycle.stage} to ${newProfile.lifecycle.stage}`);
    }
    
    // Check theme changes
    if (newProfile.themes.primary?.theme !== oldProfile.themes.primary?.theme) {
      changes.push(`Primary theme changed from ${oldProfile.themes.primary?.theme} to ${newProfile.themes.primary?.theme}`);
    }
    
    return {
      hasSignificantChanges: changes.length > 0,
      changes,
      strengthDelta: newProfile.strength - oldProfile.strength
    };
  }

  identifySubClusters(tokens) {
    // Simplified sub-clustering - in production, use proper clustering
    if (tokens.length < 6) return [];
    
    const midpoint = Math.floor(tokens.length / 2);
    return [
      { tokens: tokens.slice(0, midpoint) },
      { tokens: tokens.slice(midpoint) }
    ];
  }
}

module.exports = NarrativeCharacterizationEngine;