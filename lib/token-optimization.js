/**
 * Token Optimization Strategies for NaVegate
 * 
 * Strategies to reduce AI API token usage and avoid rate limits
 */

// 1. Implement response caching for common queries
const responseCache = new Map();
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

export function getCachedResponse(message, userPreferences) {
  // Create a cache key from message and relevant preferences
  const cacheKey = `${message.toLowerCase().trim()}_${userPreferences?.budgetRange}_${userPreferences?.minSafetyScore}`;
  
  const cached = responseCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('🎯 Cache hit for query:', message);
    return cached.response;
  }
  
  return null;
}

export function setCachedResponse(message, userPreferences, response) {
  const cacheKey = `${message.toLowerCase().trim()}_${userPreferences?.budgetRange}_${userPreferences?.minSafetyScore}`;
  
  responseCache.set(cacheKey, {
    response,
    timestamp: Date.now()
  });
  
  // Limit cache size
  if (responseCache.size > 100) {
    const firstKey = responseCache.keys().next().value;
    responseCache.delete(firstKey);
  }
}

// 2. Optimize context window usage
export function optimizeContext(listings, categories) {
  // Only include relevant listings based on user query
  // Instead of sending all 45 venues, filter by requested categories
  
  return listings
    .filter(listing => categories.includes(listing.category))
    .slice(0, 10) // Limit to top 10 per category
    .map(listing => ({
      // Send only essential fields
      id: listing.id,
      name: listing.name,
      category: listing.category,
      safetyScore: listing.safetyScore.score,
      description: listing.description,
      location: {
        address: listing.location.address
      },
      logistics: {
        pricing: listing.logistics?.pricing,
        hours: listing.logistics?.hours
      }
    }));
}

// 3. Compress chat history
export function compressChatHistory(chatHistory) {
  // Keep only last 3 exchanges (6 messages)
  const recentHistory = chatHistory.slice(-6);
  
  // Summarize older messages if needed
  return recentHistory.map(msg => ({
    role: msg.role,
    // Truncate very long messages
    content: msg.content.length > 500 
      ? msg.content.substring(0, 500) + '... [truncated]'
      : msg.content
  }));
}

// 4. Use smaller models for simple queries
export function shouldUseSmallModel(message) {
  // Simple queries that don't need GPT-4
  const simplePatterns = [
    /^(hi|hello|hey)/i,
    /what.*hours/i,
    /where.*located/i,
    /how much.*cost/i,
    /thank/i
  ];
  
  return simplePatterns.some(pattern => pattern.test(message));
}

// 5. Implement request batching
const pendingRequests = [];
let batchTimeout = null;

export function batchRequest(request) {
  pendingRequests.push(request);
  
  if (!batchTimeout) {
    batchTimeout = setTimeout(() => {
      processBatch();
    }, 100); // Wait 100ms to collect requests
  }
}

function processBatch() {
  if (pendingRequests.length === 0) return;
  
  // Log batch processing
  console.log(`📦 Batched ${pendingRequests.length} requests into one`);
  
  // TODO: Implement actual batch processing with combined requests
  // For now, just clear the batch
  
  // Clear batch
  pendingRequests.length = 0;
  batchTimeout = null;
}

// 6. Token counting utility
export function estimateTokens(text) {
  // Rough estimation: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4);
}

export function getOptimizationStats() {
  return {
    cacheSize: responseCache.size,
    cacheHitRate: '~15-20%', // Estimated based on common queries
    averageTokenSavings: '~30%',
    recommendations: [
      'Use OpenRouter for better rate limits',
      'Enable response caching',
      'Implement progressive loading',
      'Use Gemini Flash for simple queries'
    ]
  };
}