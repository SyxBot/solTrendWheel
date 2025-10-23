/**
 * Continuous Learning System
 * 
 * Implements feedback collection, model adaptation, A/B testing,
 * and continuous improvement for the narrative detection system.
 */

class ContinuousLearningEngine {
  constructor(config = {}) {
    this.config = {
      // Learning parameters
      learningRate: config.learningRate || 0.05,
      feedbackWeight: config.feedbackWeight || 0.3,
      abTestDuration: config.abTestDuration || 24 * 60 * 60 * 1000, // 24 hours
      minFeedbackSamples: config.minFeedbackSamples || 10,
      
      // Model update thresholds
      modelUpdateThreshold: config.modelUpdateThreshold || 0.1,
      performanceThreshold: config.performanceThreshold || 0.7,
      
      // Storage limits
      maxFeedbackHistory: config.maxFeedbackHistory || 1000,
      maxExperimentHistory: config.maxExperimentHistory || 50,
      
      ...config
    };
    
    this.feedbackHistory = new Map(); // Store user feedback
    this.interactionHistory = new Map(); // Store user interactions
    this.abTestExperiments = new Map(); // Active A/B tests
    this.modelPerformance = new Map(); // Track model performance over time
    this.experimentResults = new Map(); // Store experiment results
    this.adaptationLog = []; // Log of all adaptations made
  }

  /**
   * Initialize the learning engine
   * @returns {Promise<void>}
   */
  async initialize() {
    console.log('📊 Initializing Continuous Learning Engine...');
    this.initialized = true;
    console.log('✅ Continuous Learning Engine initialized');
  }

  /**
   * Save engine state for persistence
   * @returns {Promise<void>}
   */
  async saveState() {
    console.log('💾 Saving Continuous Learning Engine state...');
    return Promise.resolve();
  }

  /**
   * Collect user feedback on narrative classification
   * @param {Object} feedback - User feedback data
   */
  collectFeedback(feedback) {
    console.log('📝 Collecting user feedback:', feedback.type);
    
    const feedbackEntry = {
      id: this.generateId(),
      timestamp: Date.now(),
      type: feedback.type, // 'narrative_relevance', 'classification_accuracy', 'ranking_quality'
      narrativeId: feedback.narrativeId,
      narrativeName: feedback.narrativeName,
      rating: feedback.rating, // 1-5 scale
      comment: feedback.comment,
      userSession: feedback.userSession,
      context: feedback.context, // Additional context data
      ...feedback
    };
    
    this.feedbackHistory.set(feedbackEntry.id, feedbackEntry);
    
    // Maintain history size limit
    if (this.feedbackHistory.size > this.config.maxFeedbackHistory) {
      const oldestKey = Array.from(this.feedbackHistory.keys())[0];
      this.feedbackHistory.delete(oldestKey);
    }
    
    // Trigger immediate learning if we have enough feedback
    this.checkForImmediateLearning(feedbackEntry);
    
    return feedbackEntry.id;
  }

  /**
   * Track user interactions with the visualization
   * @param {Object} interaction - Interaction data
   */
  trackInteraction(interaction) {
    const interactionEntry = {
      id: this.generateId(),
      timestamp: Date.now(),
      type: interaction.type, // 'segment_click', 'segment_hover', 'modal_open', 'tooltip_view'
      narrativeId: interaction.narrativeId,
      narrativeName: interaction.narrativeName,
      duration: interaction.duration,
      userSession: interaction.userSession,
      deviceInfo: interaction.deviceInfo,
      ...interaction
    };
    
    this.interactionHistory.set(interactionEntry.id, interactionEntry);
    
    // Maintain history size limit
    if (this.interactionHistory.size > this.config.maxFeedbackHistory) {
      const oldestKey = Array.from(this.interactionHistory.keys())[0];
      this.interactionHistory.delete(oldestKey);
    }
    
    return interactionEntry.id;
  }

  /**
   * Update models based on collected feedback and performance data
   */
  async updateModels() {
    console.log('🧠 Updating models based on learning data...');
    
    try {
      const updateResults = {
        clusteringUpdates: {},
        characterizationUpdates: {},
        scoringUpdates: {},
        timestamp: new Date().toISOString()
      };
      
      // Update clustering parameters
      const clusteringUpdates = await this.updateClusteringModel();
      updateResults.clusteringUpdates = clusteringUpdates;
      
      // Update characterization rules
      const characterizationUpdates = await this.updateCharacterizationModel();
      updateResults.characterizationUpdates = characterizationUpdates;
      
      // Update scoring weights
      const scoringUpdates = await this.updateScoringModel();
      updateResults.scoringUpdates = scoringUpdates;
      
      // Log the adaptation
      this.logAdaptation('model_update', updateResults);
      
      console.log('✅ Model updates complete');
      return updateResults;
      
    } catch (error) {
      console.error('❌ Error updating models:', error);
      return { error: error.message };
    }
  }

  /**
   * Start A/B test for different narrative detection approaches
   * @param {Object} experiment - Experiment configuration
   */
  startABTest(experiment) {
    console.log(`🧪 Starting A/B test: ${experiment.name}`);
    
    const abTest = {
      id: this.generateId(),
      name: experiment.name,
      description: experiment.description,
      startTime: Date.now(),
      endTime: Date.now() + this.config.abTestDuration,
      variants: experiment.variants, // Array of different configurations
      metrics: experiment.metrics || ['user_engagement', 'feedback_rating', 'interaction_time'],
      status: 'active',
      participants: new Map(),
      results: new Map()
    };
    
    this.abTestExperiments.set(abTest.id, abTest);
    
    console.log(`✅ A/B test "${experiment.name}" started, running until ${new Date(abTest.endTime).toISOString()}`);
    return abTest.id;
  }

  /**
   * Assign user to A/B test variant
   * @param {string} userSession - User session ID
   * @param {string} testId - A/B test ID
   */
  assignToVariant(userSession, testId) {
    const test = this.abTestExperiments.get(testId);
    if (!test || test.status !== 'active' || Date.now() > test.endTime) {
      return null;
    }
    
    // Check if user already assigned
    if (test.participants.has(userSession)) {
      return test.participants.get(userSession);
    }
    
    // Randomly assign to variant
    const variantIndex = Math.floor(Math.random() * test.variants.length);
    const variant = test.variants[variantIndex];
    
    test.participants.set(userSession, {
      variantIndex,
      variant: variant.name,
      assignedAt: Date.now()
    });
    
    return variant;
  }

  /**
   * Record A/B test result
   * @param {string} testId - A/B test ID
   * @param {string} userSession - User session ID
   * @param {Object} result - Result data
   */
  recordABTestResult(testId, userSession, result) {
    const test = this.abTestExperiments.get(testId);
    if (!test) return;
    
    const participant = test.participants.get(userSession);
    if (!participant) return;
    
    const resultKey = `${userSession}_${Date.now()}`;
    test.results.set(resultKey, {
      userSession,
      variant: participant.variant,
      variantIndex: participant.variantIndex,
      result,
      timestamp: Date.now()
    });
    
    console.log(`📊 Recorded A/B test result for ${test.name}, variant: ${participant.variant}`);
  }

  /**
   * Analyze A/B test results and determine winner
   * @param {string} testId - A/B test ID
   */
  analyzeABTestResults(testId) {
    const test = this.abTestExperiments.get(testId);
    if (!test) return null;
    
    console.log(`📈 Analyzing A/B test results for: ${test.name}`);
    
    const analysis = {
      testId,
      testName: test.name,
      duration: Date.now() - test.startTime,
      participants: test.participants.size,
      results: test.results.size,
      variants: {},
      winner: null,
      confidence: 0,
      recommendations: []
    };
    
    // Group results by variant
    const variantResults = {};
    test.variants.forEach((variant, index) => {
      variantResults[index] = {
        name: variant.name,
        config: variant.config,
        participants: 0,
        results: [],
        metrics: {}
      };
    });
    
    // Collect variant data
    for (const [key, result] of test.results) {
      const variant = variantResults[result.variantIndex];
      if (variant) {
        variant.results.push(result);
      }
    }
    
    // Calculate participant counts
    for (const [session, participant] of test.participants) {
      const variant = variantResults[participant.variantIndex];
      if (variant) {
        variant.participants++;
      }
    }
    
    // Calculate metrics for each variant
    Object.values(variantResults).forEach(variant => {
      if (variant.results.length > 0) {
        variant.metrics = this.calculateVariantMetrics(variant.results, test.metrics);
      }
    });
    
    analysis.variants = variantResults;
    
    // Determine winner
    const winner = this.determineABTestWinner(variantResults, test.metrics);
    analysis.winner = winner.variant;
    analysis.confidence = winner.confidence;
    analysis.recommendations = winner.recommendations;
    
    // Store results
    this.experimentResults.set(testId, analysis);
    
    console.log(`🏆 A/B test winner: ${winner.variant} (${Math.round(winner.confidence * 100)}% confidence)`);
    
    return analysis;
  }

  /**
   * Analyze detection accuracy compared to known market trends
   */
  analyzeDetectionAccuracy() {
    console.log('🎯 Analyzing detection accuracy...');
    
    const analysis = {
      timestamp: Date.now(),
      totalPredictions: 0,
      accurateDetections: 0,
      falsePositives: 0,
      falseNegatives: 0,
      accuracy: 0,
      precision: 0,
      recall: 0,
      f1Score: 0,
      recommendations: []
    };
    
    // Get feedback data for accuracy analysis
    const feedbackData = Array.from(this.feedbackHistory.values())
      .filter(f => f.type === 'classification_accuracy' && f.rating !== undefined);
    
    if (feedbackData.length === 0) {
      analysis.recommendations.push('Need more user feedback for accuracy analysis');
      return analysis;
    }
    
    // Analyze feedback ratings (assuming 4-5 rating = accurate, 1-2 = inaccurate)
    feedbackData.forEach(feedback => {
      analysis.totalPredictions++;
      
      if (feedback.rating >= 4) {
        analysis.accurateDetections++;
      } else if (feedback.rating <= 2) {
        if (feedback.context?.actuallyExists === false) {
          analysis.falsePositives++;
        } else {
          analysis.falseNegatives++;
        }
      }
    });
    
    // Calculate metrics
    if (analysis.totalPredictions > 0) {
      analysis.accuracy = analysis.accurateDetections / analysis.totalPredictions;
    }
    
    if ((analysis.accurateDetections + analysis.falsePositives) > 0) {
      analysis.precision = analysis.accurateDetections / (analysis.accurateDetections + analysis.falsePositives);
    }
    
    if ((analysis.accurateDetections + analysis.falseNegatives) > 0) {
      analysis.recall = analysis.accurateDetections / (analysis.accurateDetections + analysis.falseNegatives);
    }
    
    if ((analysis.precision + analysis.recall) > 0) {
      analysis.f1Score = 2 * (analysis.precision * analysis.recall) / (analysis.precision + analysis.recall);
    }
    
    // Generate recommendations
    analysis.recommendations = this.generateAccuracyRecommendations(analysis);
    
    console.log(`📊 Detection accuracy: ${Math.round(analysis.accuracy * 100)}%, F1: ${Math.round(analysis.f1Score * 100)}%`);
    
    return analysis;
  }

  /**
   * Get user engagement metrics
   */
  getUserEngagementMetrics() {
    const interactions = Array.from(this.interactionHistory.values());
    const feedback = Array.from(this.feedbackHistory.values());
    
    const metrics = {
      totalInteractions: interactions.length,
      uniqueSessions: new Set(interactions.map(i => i.userSession)).size,
      avgSessionDuration: 0,
      mostEngagingNarratives: {},
      interactionTypes: {},
      feedbackRating: 0,
      engagementTrends: {}
    };
    
    // Calculate session durations
    const sessionDurations = new Map();
    interactions.forEach(interaction => {
      if (interaction.duration) {
        const current = sessionDurations.get(interaction.userSession) || 0;
        sessionDurations.set(interaction.userSession, current + interaction.duration);
      }
    });
    
    if (sessionDurations.size > 0) {
      metrics.avgSessionDuration = Array.from(sessionDurations.values())
        .reduce((sum, duration) => sum + duration, 0) / sessionDurations.size;
    }
    
    // Analyze narrative engagement
    const narrativeEngagement = {};
    interactions.forEach(interaction => {
      if (interaction.narrativeName) {
        if (!narrativeEngagement[interaction.narrativeName]) {
          narrativeEngagement[interaction.narrativeName] = { count: 0, totalDuration: 0 };
        }
        narrativeEngagement[interaction.narrativeName].count++;
        narrativeEngagement[interaction.narrativeName].totalDuration += interaction.duration || 0;
      }
    });
    
    // Sort by engagement
    metrics.mostEngagingNarratives = Object.entries(narrativeEngagement)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .map(([name, data]) => ({ name, ...data }));
    
    // Analyze interaction types
    interactions.forEach(interaction => {
      metrics.interactionTypes[interaction.type] = (metrics.interactionTypes[interaction.type] || 0) + 1;
    });
    
    // Calculate average feedback rating
    const ratings = feedback.filter(f => f.rating).map(f => f.rating);
    if (ratings.length > 0) {
      metrics.feedbackRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
    }
    
    return metrics;
  }

  // Helper methods

  checkForImmediateLearning(feedback) {
    // Check if we should trigger immediate model updates
    if (feedback.rating <= 2 && feedback.type === 'classification_accuracy') {
      console.log('🚨 Poor feedback detected, scheduling immediate model review');
      // Could trigger immediate model adjustment here
    }
  }

  async updateClusteringModel() {
    const feedbackData = Array.from(this.feedbackHistory.values())
      .filter(f => f.type === 'narrative_relevance');
    
    const updates = {
      similarityThresholdAdjustment: 0,
      minClusterSizeAdjustment: 0,
      recommendedChanges: []
    };
    
    if (feedbackData.length < this.config.minFeedbackSamples) {
      updates.recommendedChanges.push('Need more feedback data for clustering updates');
      return updates;
    }
    
    // Analyze feedback to adjust clustering parameters
    const avgRating = feedbackData.reduce((sum, f) => sum + f.rating, 0) / feedbackData.length;
    
    if (avgRating < 3) {
      updates.similarityThresholdAdjustment = -0.05; // Lower threshold for more clusters
      updates.recommendedChanges.push('Lower similarity threshold to create more specific clusters');
    } else if (avgRating > 4) {
      updates.similarityThresholdAdjustment = 0.05; // Higher threshold for fewer clusters
      updates.recommendedChanges.push('Raise similarity threshold to merge similar clusters');
    }
    
    return updates;
  }

  async updateCharacterizationModel() {
    const updates = {
      themeWeightAdjustments: {},
      namingImprovements: [],
      recommendedChanges: []
    };
    
    // Analyze feedback on narrative naming accuracy
    const namingFeedback = Array.from(this.feedbackHistory.values())
      .filter(f => f.type === 'naming_accuracy');
    
    if (namingFeedback.length > 0) {
      const avgNamingRating = namingFeedback.reduce((sum, f) => sum + f.rating, 0) / namingFeedback.length;
      
      if (avgNamingRating < 3) {
        updates.recommendedChanges.push('Improve narrative naming algorithm');
        updates.namingImprovements.push('Consider more diverse naming strategies');
      }
    }
    
    return updates;
  }

  async updateScoringModel() {
    const updates = {
      weightAdjustments: {},
      thresholdAdjustments: {},
      recommendedChanges: []
    };
    
    // Analyze ranking feedback
    const rankingFeedback = Array.from(this.feedbackHistory.values())
      .filter(f => f.type === 'ranking_quality');
    
    if (rankingFeedback.length > 0) {
      const avgRankingRating = rankingFeedback.reduce((sum, f) => sum + f.rating, 0) / rankingFeedback.length;
      
      if (avgRankingRating < 3) {
        updates.recommendedChanges.push('Adjust scoring weights based on feedback');
        // Could implement specific weight adjustments here
      }
    }
    
    return updates;
  }

  calculateVariantMetrics(results, metrics) {
    const calculatedMetrics = {};
    
    metrics.forEach(metric => {
      switch (metric) {
        case 'user_engagement':
          calculatedMetrics[metric] = this.calculateEngagementMetric(results);
          break;
        case 'feedback_rating':
          calculatedMetrics[metric] = this.calculateFeedbackMetric(results);
          break;
        case 'interaction_time':
          calculatedMetrics[metric] = this.calculateInteractionTimeMetric(results);
          break;
        default:
          calculatedMetrics[metric] = Math.random(); // Placeholder
      }
    });
    
    return calculatedMetrics;
  }

  calculateEngagementMetric(results) {
    // Calculate engagement based on interaction frequency and duration
    const totalInteractions = results.length;
    const avgDuration = results.reduce((sum, r) => sum + (r.result.duration || 0), 0) / Math.max(1, totalInteractions);
    
    return Math.min(1, (totalInteractions * 0.1 + avgDuration * 0.001) / 2);
  }

  calculateFeedbackMetric(results) {
    const ratings = results.map(r => r.result.rating).filter(r => r !== undefined);
    return ratings.length > 0 ? ratings.reduce((sum, r) => sum + r, 0) / (ratings.length * 5) : 0;
  }

  calculateInteractionTimeMetric(results) {
    const durations = results.map(r => r.result.duration).filter(d => d !== undefined);
    const avgDuration = durations.length > 0 ? durations.reduce((sum, d) => sum + d, 0) / durations.length : 0;
    
    return Math.min(1, avgDuration / 60000); // Normalize to minutes
  }

  determineABTestWinner(variants, metrics) {
    const variantScores = Object.entries(variants).map(([index, variant]) => {
      if (!variant.metrics || Object.keys(variant.metrics).length === 0) {
        return { variant: variant.name, score: 0, confidence: 0 };
      }
      
      // Calculate composite score
      const score = Object.values(variant.metrics).reduce((sum, value) => sum + value, 0) / Object.keys(variant.metrics).length;
      
      return {
        variant: variant.name,
        score,
        confidence: Math.min(1, variant.participants / 50) // Higher confidence with more participants
      };
    });
    
    // Find highest scoring variant
    const winner = variantScores.reduce((best, current) => 
      current.score > best.score ? current : best
    );
    
    return {
      variant: winner.variant,
      confidence: winner.confidence,
      recommendations: winner.score > 0.7 ? 
        [`Implement ${winner.variant} configuration`] : 
        ['Results inconclusive, extend test duration']
    };
  }

  generateAccuracyRecommendations(analysis) {
    const recommendations = [];
    
    if (analysis.accuracy < 0.7) {
      recommendations.push('Overall accuracy below threshold - review clustering parameters');
    }
    
    if (analysis.precision < 0.6) {
      recommendations.push('High false positive rate - increase similarity thresholds');
    }
    
    if (analysis.recall < 0.6) {
      recommendations.push('High false negative rate - decrease similarity thresholds');
    }
    
    if (analysis.f1Score < 0.65) {
      recommendations.push('Balance precision and recall by adjusting feature weights');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Performance within acceptable ranges - continue monitoring');
    }
    
    return recommendations;
  }

  logAdaptation(type, data) {
    this.adaptationLog.push({
      timestamp: Date.now(),
      type,
      data,
      id: this.generateId()
    });
    
    // Keep log size manageable
    if (this.adaptationLog.length > 100) {
      this.adaptationLog = this.adaptationLog.slice(-50);
    }
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Get learning system status and recommendations
   */
  getSystemStatus() {
    const engagementMetrics = this.getUserEngagementMetrics();
    const accuracyAnalysis = this.analyzeDetectionAccuracy();
    
    return {
      feedbackCount: this.feedbackHistory.size,
      interactionCount: this.interactionHistory.size,
      activeABTests: Array.from(this.abTestExperiments.values()).filter(t => t.status === 'active').length,
      completedExperiments: this.experimentResults.size,
      adaptationCount: this.adaptationLog.length,
      
      performance: {
        accuracy: accuracyAnalysis.accuracy,
        userSatisfaction: engagementMetrics.feedbackRating / 5,
        engagement: Math.min(1, engagementMetrics.avgSessionDuration / 300000) // 5 minutes max
      },
      
      recommendations: [
        ...accuracyAnalysis.recommendations,
        ...(engagementMetrics.feedbackRating < 3 ? ['Improve user experience based on feedback'] : []),
        ...(this.feedbackHistory.size < 50 ? ['Collect more user feedback for better learning'] : [])
      ],
      
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = ContinuousLearningEngine;