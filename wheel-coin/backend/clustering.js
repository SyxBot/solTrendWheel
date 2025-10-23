/**
 * Token Clustering Module
 * 
 * Implements advanced clustering algorithms to group similar tokens
 * and identify potential narratives through feature extraction and
 * machine learning techniques.
 */

class TokenClusteringEngine {
  constructor(config = {}) {
    this.config = {
      minClusterSize: config.minClusterSize || 3,
      maxClusters: config.maxClusters || 10,
      dbscanEps: config.dbscanEps || 0.5,
      dbscanMinPts: config.dbscanMinPts || 3,
      hierarchicalThreshold: config.hierarchicalThreshold || 0.7,
      featureWeights: {
        textual: config.textualWeight || 0.3,
        onchain: config.onchainWeight || 0.3,
        social: config.socialWeight || 0.2,
        market: config.marketWeight || 0.2
      },
      ...config
    };
    
    this.clusterHistory = new Map(); // Track cluster evolution
    this.featureCache = new Map(); // Cache extracted features
  }

  /**
   * Initialize the clustering engine
   * @returns {Promise<void>}
   */
  async initialize() {
    console.log('🔬 Initializing Token Clustering Engine...');
    // Preload any necessary data or models
    this.initialized = true;
    console.log('✅ Token Clustering Engine initialized');
  }

  /**
   * Save engine state for persistence
   * @returns {Promise<void>}
   */
  async saveState() {
    console.log('💾 Saving Token Clustering Engine state...');
    // In production, save to database/file
    return Promise.resolve();
  }

  /**
   * Main clustering function - processes tokens and returns clusters
   * @param {Array} tokens - Array of token objects
   * @returns {Object} Clustering results with clusters and metadata
   */
  async clusterTokens(tokens) {
    console.log(`🔬 Starting clustering analysis for ${tokens.length} tokens...`);
    
    if (tokens.length < this.config.minClusterSize) {
      return {
        clusters: [],
        outliers: tokens,
        metadata: {
          totalTokens: tokens.length,
          algorithmUsed: 'none',
          reason: 'Insufficient tokens for clustering'
        }
      };
    }

    try {
      // Step 1: Extract features for all tokens
      const features = await this.extractAllFeatures(tokens);
      
      // Step 2: Run multiple clustering algorithms
      const kmeansResult = this.performKMeansClustering(tokens, features);
      const dbscanResult = this.performDBSCANClustering(tokens, features);
      const hierarchicalResult = this.performHierarchicalClustering(tokens, features);
      
      // Step 3: Select best clustering result
      const bestResult = this.selectBestClustering([kmeansResult, dbscanResult, hierarchicalResult]);
      
      // Step 4: Track cluster evolution
      this.trackClusterEvolution(bestResult.clusters);
      
      // Step 5: Calculate cluster strength scores
      const clustersWithScores = this.calculateClusterStrengths(bestResult.clusters, features);
      
      console.log(`✅ Clustering complete: ${clustersWithScores.length} clusters, ${bestResult.outliers.length} outliers`);
      
      return {
        clusters: clustersWithScores,
        outliers: bestResult.outliers,
        metadata: {
          totalTokens: tokens.length,
          algorithmUsed: bestResult.algorithm,
          clusterCount: clustersWithScores.length,
          silhouetteScore: this.calculateSilhouetteScore(clustersWithScores, features),
          timestamp: new Date().toISOString()
        }
      };
      
    } catch (error) {
      console.error('❌ Error in clustering:', error);
      return {
        clusters: [],
        outliers: tokens,
        metadata: { error: error.message }
      };
    }
  }

  /**
   * Extract comprehensive features for all tokens
   */
  async extractAllFeatures(tokens) {
    const features = [];
    
    for (const token of tokens) {
      const cacheKey = `${token.address}_${token.updatedAt || Date.now()}`;
      
      if (this.featureCache.has(cacheKey)) {
        features.push(this.featureCache.get(cacheKey));
        continue;
      }
      
      const tokenFeatures = {
        token,
        textual: this.extractTextualFeatures(token),
        onchain: this.extractOnChainFeatures(token),
        social: this.extractSocialFeatures(token),
        market: this.extractMarketFeatures(token)
      };
      
      // Normalize and combine features into a single vector
      tokenFeatures.vector = this.combineFeatures(tokenFeatures);
      
      this.featureCache.set(cacheKey, tokenFeatures);
      features.push(tokenFeatures);
    }
    
    return features;
  }

  /**
   * Extract textual features from token name and symbol
   */
  extractTextualFeatures(token) {
    const name = (token.name || '').toLowerCase();
    const symbol = (token.symbol || '').toLowerCase();
    const combined = `${name} ${symbol}`;
    
    return {
      // Length features
      nameLength: name.length,
      symbolLength: symbol.length,
      
      // Character features
      hasNumbers: /\d/.test(combined),
      hasSpecialChars: /[^a-z0-9\s]/.test(combined),
      upperCaseRatio: (token.name || '').replace(/[^A-Z]/g, '').length / Math.max(1, (token.name || '').length),
      
      // Keyword features (boolean indicators)
      keywords: {
        // Animal themes
        isDog: /dog|doge|shib|puppy|canine/.test(combined),
        isCat: /cat|kitten|feline|meow/.test(combined),
        isAnimal: /dog|cat|bird|fish|bear|bull|tiger|lion|wolf|fox|rabbit/.test(combined),
        
        // AI themes
        isAI: /ai|artificial|intelligence|neural|machine|learning|gpt|chat|bot/.test(combined),
        isTech: /tech|protocol|network|chain|crypto|defi|web3/.test(combined),
        
        // Meme themes
        isMeme: /meme|pepe|wojak|chad|moon|rocket|diamond|hands/.test(combined),
        isFood: /pizza|burger|taco|sushi|cake|cookie|bread/.test(combined),
        
        // Utility themes
        isUtility: /utility|tool|service|platform|infrastructure/.test(combined),
        isGaming: /game|gaming|play|metaverse|nft|avatar/.test(combined),
        
        // Market themes
        isPolitical: /trump|biden|political|election|vote/.test(combined),
        isFinance: /finance|bank|treasury|yield|stake|farm/.test(combined)
      },
      
      // Semantic similarity (simplified)
      tokenEmbedding: this.createSimpleEmbedding(combined)
    };
  }

  /**
   * Extract on-chain features
   */
  extractOnChainFeatures(token) {
    const holders = token.holders || 0;
    const liquidity = token.liquidity || 0;
    const volume24h = token.volume || 0;
    const transactions = token.transactions || 0;
    
    return {
      // Holder metrics
      holderCount: holders,
      holderConcentration: this.calculateHolderConcentration(token),
      holderGrowthRate: this.calculateHolderGrowth(token),
      
      // Liquidity metrics
      liquidityUSD: liquidity,
      liquidityRatio: liquidity / Math.max(1, token.marketCap || 1),
      
      // Activity metrics
      volume24h: volume24h,
      volumeToLiquidityRatio: volume24h / Math.max(1, liquidity),
      transactionFrequency: transactions / (24 * 60), // per minute
      
      // Age and maturity
      tokenAge: this.calculateTokenAge(token),
      isNewToken: this.calculateTokenAge(token) < 24 * 60 * 60 * 1000, // Less than 24 hours
      
      // Stability metrics
      liquidityStability: this.calculateLiquidityStability(token),
      holderStability: this.calculateHolderStability(token)
    };
  }

  /**
   * Extract social features
   */
  extractSocialFeatures(token) {
    const mentions = token.socialMentions || 0;
    const sentiment = token.sentiment || 0;
    const engagement = token.engagement || 0;
    
    return {
      // Mention metrics
      mentionCount: mentions,
      mentionVelocity: this.calculateMentionVelocity(token),
      mentionGrowth: this.calculateMentionGrowth(token),
      
      // Sentiment metrics
      sentimentScore: sentiment,
      sentimentVolatility: this.calculateSentimentVolatility(token),
      
      // Engagement metrics
      engagementRate: engagement,
      viralityScore: this.calculateViralityScore(token),
      
      // Community metrics
      communityStrength: this.calculateCommunityStrength(token),
      influencerAttention: this.calculateInfluencerAttention(token)
    };
  }

  /**
   * Extract market features
   */
  extractMarketFeatures(token) {
    const price = token.price || 0;
    const priceChange = token.priceChange24h || 0;
    const volume = token.volume || 0;
    const marketCap = token.marketCap || 0;
    
    return {
      // Price metrics
      currentPrice: price,
      priceChange24h: priceChange,
      priceVolatility: this.calculatePriceVolatility(token),
      
      // Volume metrics
      volume24h: volume,
      volumeMA: this.calculateVolumeMA(token),
      volumeSpike: this.detectVolumeSpike(token),
      
      // Market cap metrics
      marketCap: marketCap,
      marketCapRank: this.estimateMarketCapRank(token),
      
      // Trading metrics
      bidAskSpread: this.calculateBidAskSpread(token),
      liquidityDepth: this.calculateLiquidityDepth(token),
      
      // Performance metrics
      performance1h: token.priceChange1h || 0,
      performance7d: token.priceChange7d || 0,
      rsi: this.calculateRSI(token)
    };
  }

  /**
   * Combine all features into a single normalized vector
   */
  combineFeatures(tokenFeatures) {
    const { textual, onchain, social, market } = tokenFeatures;
    const weights = this.config.featureWeights;
    
    // Create feature vector
    const vector = [];
    
    // Textual features (normalized)
    const textualVector = [
      this.normalize(textual.nameLength, 0, 50),
      this.normalize(textual.symbolLength, 0, 20),
      textual.hasNumbers ? 1 : 0,
      textual.hasSpecialChars ? 1 : 0,
      textual.upperCaseRatio,
      // Keywords as binary features
      ...Object.values(textual.keywords).map(v => v ? 1 : 0),
      // Simplified embedding
      ...textual.tokenEmbedding
    ];
    
    // On-chain features (normalized)
    const onchainVector = [
      this.normalize(Math.log(onchain.holderCount + 1), 0, 15),
      this.normalize(onchain.holderConcentration, 0, 1),
      this.normalize(onchain.holderGrowthRate, -1, 1),
      this.normalize(Math.log(onchain.liquidityUSD + 1), 0, 20),
      this.normalize(onchain.liquidityRatio, 0, 1),
      this.normalize(Math.log(onchain.volume24h + 1), 0, 20),
      this.normalize(onchain.volumeToLiquidityRatio, 0, 10),
      this.normalize(onchain.transactionFrequency, 0, 100),
      this.normalize(onchain.tokenAge, 0, 30 * 24 * 60 * 60 * 1000),
      onchain.isNewToken ? 1 : 0
    ];
    
    // Social features (normalized)
    const socialVector = [
      this.normalize(Math.log(social.mentionCount + 1), 0, 15),
      this.normalize(social.mentionVelocity, 0, 100),
      this.normalize(social.mentionGrowth, -1, 5),
      this.normalize(social.sentimentScore, -1, 1),
      this.normalize(social.sentimentVolatility, 0, 1),
      this.normalize(social.engagementRate, 0, 1),
      this.normalize(social.viralityScore, 0, 1),
      this.normalize(social.communityStrength, 0, 1)
    ];
    
    // Market features (normalized)
    const marketVector = [
      this.normalize(Math.log(market.currentPrice * 1000000 + 1), 0, 20),
      this.normalize(market.priceChange24h, -100, 1000),
      this.normalize(market.priceVolatility, 0, 2),
      this.normalize(Math.log(market.volume24h + 1), 0, 20),
      this.normalize(market.volumeSpike, 0, 5),
      this.normalize(Math.log(market.marketCap + 1), 0, 25),
      this.normalize(market.performance1h, -50, 200),
      this.normalize(market.performance7d, -90, 500),
      this.normalize(market.rsi, 0, 100)
    ];
    
    // Combine with weights
    vector.push(...textualVector.map(v => v * weights.textual));
    vector.push(...onchainVector.map(v => v * weights.onchain));
    vector.push(...socialVector.map(v => v * weights.social));
    vector.push(...marketVector.map(v => v * weights.market));
    
    return vector;
  }

  /**
   * Perform K-means clustering
   */
  performKMeansClustering(tokens, features) {
    const vectors = features.map(f => f.vector);
    const k = Math.min(this.config.maxClusters, Math.floor(tokens.length / this.config.minClusterSize));
    
    if (k < 2) {
      return {
        algorithm: 'kmeans',
        clusters: [],
        outliers: tokens,
        score: 0
      };
    }
    
    const result = this.kMeans(vectors, k);
    const clusters = this.groupTokensByClusters(tokens, result.labels);
    
    return {
      algorithm: 'kmeans',
      clusters: clusters.filter(cluster => cluster.tokens.length >= this.config.minClusterSize),
      outliers: clusters.filter(cluster => cluster.tokens.length < this.config.minClusterSize)
        .flatMap(cluster => cluster.tokens),
      score: result.inertia,
      centroids: result.centroids
    };
  }

  /**
   * Perform DBSCAN clustering
   */
  performDBSCANClustering(tokens, features) {
    const vectors = features.map(f => f.vector);
    const result = this.dbscan(vectors, this.config.dbscanEps, this.config.dbscanMinPts);
    const clusters = this.groupTokensByClusters(tokens, result.labels);
    
    // Separate noise points (label -1) as outliers
    const validClusters = clusters.filter(cluster => cluster.id !== -1);
    const outliers = clusters.find(cluster => cluster.id === -1)?.tokens || [];
    
    return {
      algorithm: 'dbscan',
      clusters: validClusters,
      outliers: outliers,
      score: validClusters.length > 0 ? this.calculateDBSCANScore(validClusters) : 0
    };
  }

  /**
   * Perform hierarchical clustering
   */
  performHierarchicalClustering(tokens, features) {
    const vectors = features.map(f => f.vector);
    const distanceMatrix = this.calculateDistanceMatrix(vectors);
    const result = this.hierarchicalClustering(distanceMatrix, this.config.hierarchicalThreshold);
    const clusters = this.groupTokensByClusters(tokens, result.labels);
    
    return {
      algorithm: 'hierarchical',
      clusters: clusters.filter(cluster => cluster.tokens.length >= this.config.minClusterSize),
      outliers: clusters.filter(cluster => cluster.tokens.length < this.config.minClusterSize)
        .flatMap(cluster => cluster.tokens),
      score: this.calculateHierarchicalScore(clusters),
      dendrogram: result.dendrogram
    };
  }

  /**
   * Select the best clustering result based on multiple criteria
   */
  selectBestClustering(results) {
    const validResults = results.filter(r => r.clusters.length > 0);
    
    if (validResults.length === 0) {
      return results[0]; // Return first result even if no valid clusters
    }
    
    // Score each result based on multiple criteria
    const scoredResults = validResults.map(result => {
      const clusterSizes = result.clusters.map(c => c.tokens.length);
      const avgClusterSize = clusterSizes.reduce((a, b) => a + b, 0) / clusterSizes.length;
      const clusterSizeVariance = this.calculateVariance(clusterSizes);
      
      const totalTokens = result.clusters.reduce((sum, cluster) => sum + cluster.tokens.length, 0) + result.outliers.length;
      const compositeScore = 
        result.clusters.length * 0.3 + // Favor more clusters
        avgClusterSize * 0.2 + // Favor larger clusters
        (1 / (clusterSizeVariance + 1)) * 0.2 + // Favor balanced cluster sizes
        (result.outliers.length / totalTokens) * -0.3; // Penalize many outliers
      
      return { ...result, compositeScore };
    });
    
    // Return the highest scoring result
    return scoredResults.reduce((best, current) => 
      current.compositeScore > best.compositeScore ? current : best
    );
  }

  /**
   * Track cluster evolution over time
   */
  trackClusterEvolution(clusters) {
    const timestamp = Date.now();
    const currentClusters = new Map();
    
    // Create cluster signatures for tracking
    clusters.forEach((cluster, index) => {
      const signature = this.createClusterSignature(cluster);
      currentClusters.set(signature, {
        id: index,
        tokens: cluster.tokens,
        signature,
        timestamp
      });
    });
    
    // Compare with previous clusters
    if (this.clusterHistory.size > 0) {
      const evolution = this.analyzeClusterEvolution(this.clusterHistory, currentClusters);
      console.log(`📈 Cluster evolution: ${evolution.splits} splits, ${evolution.merges} merges, ${evolution.new} new clusters`);
    }
    
    // Update history (keep last 10 snapshots)
    this.clusterHistory.set(timestamp, currentClusters);
    const timestamps = Array.from(this.clusterHistory.keys()).sort((a, b) => b - a);
    if (timestamps.length > 10) {
      timestamps.slice(10).forEach(ts => this.clusterHistory.delete(ts));
    }
  }

  /**
   * Calculate cluster strength scores
   */
  calculateClusterStrengths(clusters, features) {
    return clusters.map(cluster => {
      const clusterFeatures = cluster.tokens.map(token => 
        features.find(f => f.token.address === token.address)
      ).filter(Boolean);
      
      const strength = this.calculateClusterStrength(cluster, clusterFeatures);
      
      return {
        ...cluster,
        strength,
        coherence: this.calculateClusterCoherence(clusterFeatures),
        stability: this.calculateClusterStability(cluster),
        growth: this.calculateClusterGrowth(cluster)
      };
    });
  }

  // Helper methods for calculations
  
  normalize(value, min, max) {
    return Math.max(0, Math.min(1, (value - min) / Math.max(1, max - min)));
  }
  
  createSimpleEmbedding(text) {
    // Simplified text embedding (in production, use proper embeddings)
    const words = text.split(/\s+/);
    const embedding = new Array(10).fill(0);
    
    words.forEach((word, i) => {
      const hash = this.simpleHash(word);
      embedding[hash % 10] += 1;
    });
    
    const sum = embedding.reduce((a, b) => a + b, 0);
    return sum > 0 ? embedding.map(v => v / sum) : embedding;
  }
  
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
  
  calculateHolderConcentration(token) {
    // Simplified - in production, analyze actual holder distribution
    const holders = token.holders || 0;
    if (holders < 10) return 1.0; // High concentration
    if (holders < 100) return 0.7;
    if (holders < 1000) return 0.4;
    return 0.2; // Low concentration
  }
  
  calculateHolderGrowth(token) {
    // Placeholder - needs historical data
    return (Math.random() - 0.5) * 0.2;
  }
  
  calculateTokenAge(token) {
    const created = token.createdAt || token.timestamp || Date.now();
    return Date.now() - created;
  }
  
  calculateLiquidityStability(token) {
    // Placeholder - needs historical liquidity data
    return Math.random() * 0.5 + 0.5;
  }
  
  calculateHolderStability(token) {
    // Placeholder - needs historical holder data
    return Math.random() * 0.5 + 0.5;
  }
  
  calculateMentionVelocity(token) {
    // Placeholder - mentions per hour
    return (token.socialMentions || 0) / 24;
  }
  
  calculateMentionGrowth(token) {
    // Placeholder - needs historical mention data
    return (Math.random() - 0.3) * 2;
  }
  
  calculateSentimentVolatility(token) {
    // Placeholder - sentiment change over time
    return Math.random() * 0.3;
  }
  
  calculateViralityScore(token) {
    const mentions = token.socialMentions || 0;
    const engagement = token.engagement || 0;
    return Math.min(1, (mentions * engagement) / 10000);
  }
  
  calculateCommunityStrength(token) {
    const holders = token.holders || 0;
    const mentions = token.socialMentions || 0;
    return Math.min(1, Math.sqrt(holders * mentions) / 1000);
  }
  
  calculateInfluencerAttention(token) {
    // Placeholder - needs influencer tracking
    return Math.random() * 0.5;
  }
  
  calculatePriceVolatility(token) {
    // Simplified volatility calculation
    const change = Math.abs(token.priceChange24h || 0);
    return Math.min(2, change / 100);
  }
  
  calculateVolumeMA(token) {
    // Placeholder - needs historical volume data
    return token.volume || 0;
  }
  
  detectVolumeSpike(token) {
    const current = token.volume || 0;
    const average = this.calculateVolumeMA(token);
    return current / Math.max(1, average);
  }
  
  estimateMarketCapRank(token) {
    // Simplified ranking based on market cap
    const mc = token.marketCap || 0;
    if (mc > 100000000) return 1; // Top tier
    if (mc > 10000000) return 2;
    if (mc > 1000000) return 3;
    if (mc > 100000) return 4;
    return 5; // Small cap
  }
  
  calculateBidAskSpread(token) {
    // Placeholder - needs order book data
    return Math.random() * 0.05;
  }
  
  calculateLiquidityDepth(token) {
    return Math.log(Math.max(1, token.liquidity || 0));
  }
  
  calculateRSI(token) {
    // Simplified RSI calculation
    const change = token.priceChange24h || 0;
    if (change > 50) return 70 + Math.random() * 20;
    if (change > 0) return 50 + Math.random() * 20;
    if (change > -50) return 30 + Math.random() * 20;
    return 10 + Math.random() * 20;
  }
  
  // Clustering algorithm implementations
  
  kMeans(vectors, k, maxIterations = 100) {
    const n = vectors.length;
    const d = vectors[0].length;
    
    // Initialize centroids randomly
    let centroids = [];
    for (let i = 0; i < k; i++) {
      centroids.push(vectors[Math.floor(Math.random() * n)].slice());
    }
    
    let labels = new Array(n);
    let prevInertia = Infinity;
    
    for (let iteration = 0; iteration < maxIterations; iteration++) {
      // Assign points to nearest centroids
      for (let i = 0; i < n; i++) {
        let minDist = Infinity;
        let bestCluster = 0;
        
        for (let j = 0; j < k; j++) {
          const dist = this.euclideanDistance(vectors[i], centroids[j]);
          if (dist < minDist) {
            minDist = dist;
            bestCluster = j;
          }
        }
        
        labels[i] = bestCluster;
      }
      
      // Update centroids
      for (let j = 0; j < k; j++) {
        const clusterPoints = vectors.filter((_, i) => labels[i] === j);
        if (clusterPoints.length > 0) {
          for (let dim = 0; dim < d; dim++) {
            centroids[j][dim] = clusterPoints.reduce((sum, point) => sum + point[dim], 0) / clusterPoints.length;
          }
        }
      }
      
      // Calculate inertia
      let inertia = 0;
      for (let i = 0; i < n; i++) {
        inertia += Math.pow(this.euclideanDistance(vectors[i], centroids[labels[i]]), 2);
      }
      
      // Check convergence
      if (Math.abs(prevInertia - inertia) < 1e-6) break;
      prevInertia = inertia;
    }
    
    return { labels, centroids, inertia: prevInertia };
  }
  
  dbscan(vectors, eps, minPts) {
    const n = vectors.length;
    const labels = new Array(n).fill(-1); // -1 means noise
    let clusterId = 0;
    
    for (let i = 0; i < n; i++) {
      if (labels[i] !== -1) continue; // Already processed
      
      const neighbors = this.findNeighbors(vectors, i, eps);
      
      if (neighbors.length < minPts) {
        labels[i] = -1; // Mark as noise
      } else {
        // Start new cluster
        labels[i] = clusterId;
        
        // Expand cluster
        let seedSet = [...neighbors];
        for (let j = 0; j < seedSet.length; j++) {
          const point = seedSet[j];
          
          if (labels[point] === -1) {
            labels[point] = clusterId; // Change noise to border point
          }
          
          if (labels[point] !== -1) continue; // Already processed
          
          labels[point] = clusterId;
          const pointNeighbors = this.findNeighbors(vectors, point, eps);
          
          if (pointNeighbors.length >= minPts) {
            seedSet.push(...pointNeighbors.filter(n => !seedSet.includes(n)));
          }
        }
        
        clusterId++;
      }
    }
    
    return { labels };
  }
  
  findNeighbors(vectors, pointIndex, eps) {
    const neighbors = [];
    const point = vectors[pointIndex];
    
    for (let i = 0; i < vectors.length; i++) {
      if (i !== pointIndex && this.euclideanDistance(point, vectors[i]) <= eps) {
        neighbors.push(i);
      }
    }
    
    return neighbors;
  }
  
  hierarchicalClustering(distanceMatrix, threshold) {
    const n = distanceMatrix.length;
    const labels = Array.from({ length: n }, (_, i) => i);
    const dendrogram = [];
    
    while (true) {
      // Find minimum distance pair
      let minDist = Infinity;
      let minI = -1, minJ = -1;
      
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          if (distanceMatrix[i][j] < minDist) {
            minDist = distanceMatrix[i][j];
            minI = i;
            minJ = j;
          }
        }
      }
      
      if (minDist > threshold) break;
      
      // Merge clusters
      dendrogram.push({ i: minI, j: minJ, distance: minDist });
      
      // Update labels
      const newLabel = Math.min(labels[minI], labels[minJ]);
      const oldLabel = Math.max(labels[minI], labels[minJ]);
      
      for (let k = 0; k < n; k++) {
        if (labels[k] === oldLabel) {
          labels[k] = newLabel;
        }
      }
      
      // Update distance matrix (average linkage)
      for (let k = 0; k < n; k++) {
        if (k !== minI && k !== minJ) {
          const newDist = (distanceMatrix[minI][k] + distanceMatrix[minJ][k]) / 2;
          distanceMatrix[minI][k] = distanceMatrix[k][minI] = newDist;
        }
      }
      
      // Remove merged row/column
      for (let k = 0; k < n; k++) {
        distanceMatrix[minJ][k] = distanceMatrix[k][minJ] = Infinity;
      }
    }
    
    return { labels, dendrogram };
  }
  
  euclideanDistance(a, b) {
    return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
  }
  
  calculateDistanceMatrix(vectors) {
    const n = vectors.length;
    const matrix = Array(n).fill().map(() => Array(n).fill(0));
    
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const dist = this.euclideanDistance(vectors[i], vectors[j]);
        matrix[i][j] = matrix[j][i] = dist;
      }
    }
    
    return matrix;
  }
  
  groupTokensByClusters(tokens, labels) {
    const clusters = new Map();
    
    labels.forEach((label, index) => {
      if (!clusters.has(label)) {
        clusters.set(label, { id: label, tokens: [] });
      }
      clusters.get(label).tokens.push(tokens[index]);
    });
    
    return Array.from(clusters.values());
  }
  
  calculateVariance(values) {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    return values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  }
  
  calculateSilhouetteScore(clusters, features) {
    // Simplified silhouette score calculation
    if (clusters.length < 2) return 0;
    
    let totalScore = 0;
    let totalPoints = 0;
    
    clusters.forEach(cluster => {
      cluster.tokens.forEach(token => {
        const tokenFeatures = features.find(f => f.token.address === token.address);
        if (!tokenFeatures) return;
        
        // Calculate average intra-cluster distance
        const intraDistances = cluster.tokens
          .filter(t => t.address !== token.address)
          .map(t => {
            const otherFeatures = features.find(f => f.token.address === t.address);
            return otherFeatures ? this.euclideanDistance(tokenFeatures.vector, otherFeatures.vector) : 0;
          });
        
        const avgIntraDist = intraDistances.length > 0 
          ? intraDistances.reduce((a, b) => a + b, 0) / intraDistances.length 
          : 0;
        
        // Calculate minimum average inter-cluster distance
        let minInterDist = Infinity;
        clusters.forEach(otherCluster => {
          if (otherCluster.id === cluster.id) return;
          
          const interDistances = otherCluster.tokens.map(t => {
            const otherFeatures = features.find(f => f.token.address === t.address);
            return otherFeatures ? this.euclideanDistance(tokenFeatures.vector, otherFeatures.vector) : 0;
          });
          
          const avgInterDist = interDistances.length > 0 
            ? interDistances.reduce((a, b) => a + b, 0) / interDistances.length 
            : 0;
            
          minInterDist = Math.min(minInterDist, avgInterDist);
        });
        
        if (minInterDist !== Infinity && Math.max(avgIntraDist, minInterDist) > 0) {
          const silhouette = (minInterDist - avgIntraDist) / Math.max(avgIntraDist, minInterDist);
          totalScore += silhouette;
          totalPoints++;
        }
      });
    });
    
    return totalPoints > 0 ? totalScore / totalPoints : 0;
  }
  
  calculateDBSCANScore(clusters) {
    // Simple scoring based on cluster count and average cluster size
    const totalTokens = clusters.reduce((sum, c) => sum + c.tokens.length, 0);
    const avgClusterSize = totalTokens / clusters.length;
    return clusters.length * 0.5 + avgClusterSize * 0.5;
  }
  
  calculateHierarchicalScore(clusters) {
    // Score based on cluster balance and count
    if (clusters.length === 0) return 0;
    const sizes = clusters.map(c => c.tokens.length);
    const variance = this.calculateVariance(sizes);
    return clusters.length / (1 + variance);
  }
  
  createClusterSignature(cluster) {
    // Create a unique signature for cluster tracking
    const tokenNames = cluster.tokens.map(t => t.name || t.symbol).sort();
    return this.simpleHash(tokenNames.join('|')).toString();
  }
  
  analyzeClusterEvolution(previousClusters, currentClusters) {
    // Analyze how clusters have changed
    const evolution = { splits: 0, merges: 0, new: 0, disappeared: 0 };
    
    const prevSignatures = new Set();
    previousClusters.forEach(clusters => {
      clusters.forEach((cluster, signature) => {
        prevSignatures.add(signature);
      });
    });
    
    const currentSignatures = new Set(currentClusters.keys());
    
    // Count new clusters
    currentSignatures.forEach(sig => {
      if (!prevSignatures.has(sig)) {
        evolution.new++;
      }
    });
    
    // Count disappeared clusters
    prevSignatures.forEach(sig => {
      if (!currentSignatures.has(sig)) {
        evolution.disappeared++;
      }
    });
    
    return evolution;
  }
  
  calculateClusterStrength(cluster, clusterFeatures) {
    if (clusterFeatures.length === 0) return 0;
    
    // Combine various strength indicators
    const avgVolume = clusterFeatures.reduce((sum, f) => sum + f.market.volume24h, 0) / clusterFeatures.length;
    const avgHolders = clusterFeatures.reduce((sum, f) => sum + f.onchain.holderCount, 0) / clusterFeatures.length;
    const avgPriceChange = clusterFeatures.reduce((sum, f) => sum + Math.abs(f.market.priceChange24h), 0) / clusterFeatures.length;
    const avgSocialMentions = clusterFeatures.reduce((sum, f) => sum + f.social.mentionCount, 0) / clusterFeatures.length;
    
    // Normalize and combine
    const volumeScore = Math.min(100, Math.log(avgVolume + 1) * 5);
    const holderScore = Math.min(100, Math.log(avgHolders + 1) * 10);
    const momentumScore = Math.min(100, avgPriceChange);
    const socialScore = Math.min(100, Math.log(avgSocialMentions + 1) * 10);
    
    return (volumeScore + holderScore + momentumScore + socialScore) / 4;
  }
  
  calculateClusterCoherence(clusterFeatures) {
    if (clusterFeatures.length < 2) return 1;
    
    // Calculate average pairwise similarity within cluster
    let totalSimilarity = 0;
    let pairs = 0;
    
    for (let i = 0; i < clusterFeatures.length; i++) {
      for (let j = i + 1; j < clusterFeatures.length; j++) {
        const similarity = 1 - this.euclideanDistance(clusterFeatures[i].vector, clusterFeatures[j].vector);
        totalSimilarity += Math.max(0, similarity);
        pairs++;
      }
    }
    
    return pairs > 0 ? totalSimilarity / pairs : 0;
  }
  
  calculateClusterStability(cluster) {
    // Placeholder - needs historical cluster data
    return Math.random() * 0.5 + 0.5;
  }
  
  calculateClusterGrowth(cluster) {
    // Placeholder - needs historical cluster data
    return (Math.random() - 0.5) * 0.4;
  }
}

module.exports = TokenClusteringEngine;