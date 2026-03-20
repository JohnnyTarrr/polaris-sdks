const authentication = require('./authentication');

const BASE_URL = 'https://api.thepolarisreport.com';

// ---------------------------------------------------------------------------
// Triggers (polling)
// ---------------------------------------------------------------------------

const newBrief = {
  key: 'newBrief',
  noun: 'Brief',
  display: {
    label: 'New Brief',
    description: 'Triggers when a new intelligence brief is published.',
  },
  operation: {
    type: 'polling',
    perform: async (z, bundle) => {
      const response = await z.request({
        url: `${BASE_URL}/api/v1/feed`,
        params: { sort: 'date', per_page: 5 },
      });
      return response.data.articles || response.data || [];
    },
    sample: {
      id: 'sample-brief-1',
      title: 'Sample Intelligence Brief',
      category: 'geopolitics',
      published_at: '2026-03-20T12:00:00Z',
    },
    outputFields: [
      { key: 'id', label: 'Brief ID' },
      { key: 'title', label: 'Title' },
      { key: 'category', label: 'Category' },
      { key: 'published_at', label: 'Published At' },
    ],
  },
};

const watchlistMatch = {
  key: 'watchlistMatch',
  noun: 'Watchlist Match',
  display: {
    label: 'Watchlist Match',
    description: 'Triggers when a new watchlist match is detected.',
  },
  operation: {
    type: 'polling',
    perform: async (z, bundle) => {
      const response = await z.request({
        url: `${BASE_URL}/api/v1/watch-matches`,
        params: { per_page: 5 },
      });
      return response.data.matches || response.data || [];
    },
    sample: {
      id: 'sample-match-1',
      entity: 'Sample Entity',
      matched_at: '2026-03-20T12:00:00Z',
    },
    outputFields: [
      { key: 'id', label: 'Match ID' },
      { key: 'entity', label: 'Entity' },
      { key: 'matched_at', label: 'Matched At' },
    ],
  },
};

const trendingEntity = {
  key: 'trendingEntity',
  noun: 'Trending Entity',
  display: {
    label: 'Trending Entity',
    description: 'Triggers when a new entity is trending.',
  },
  operation: {
    type: 'polling',
    perform: async (z, bundle) => {
      const response = await z.request({
        url: `${BASE_URL}/api/v1/entities/trending`,
        params: { limit: 5 },
      });
      const entities = response.data.entities || response.data || [];
      return entities.map((e) => ({ ...e, id: e.id || e.name }));
    },
    sample: {
      id: 'sample-entity',
      name: 'Sample Entity',
      mentions: 42,
    },
    outputFields: [
      { key: 'name', label: 'Entity Name' },
      { key: 'mentions', label: 'Mention Count' },
    ],
  },
};

// ---------------------------------------------------------------------------
// Actions (creates / searches)
// ---------------------------------------------------------------------------

const searchBriefs = {
  key: 'searchBriefs',
  noun: 'Brief',
  display: {
    label: 'Search Briefs',
    description: 'Search intelligence briefs by keyword.',
  },
  operation: {
    perform: async (z, bundle) => {
      const params = { q: bundle.inputData.query };
      if (bundle.inputData.category) params.category = bundle.inputData.category;
      if (bundle.inputData.limit) params.limit = bundle.inputData.limit;
      const response = await z.request({
        url: `${BASE_URL}/api/v1/search`,
        params,
      });
      return response.data.results || response.data || [];
    },
    inputFields: [
      { key: 'query', label: 'Search Query', required: true, type: 'string' },
      { key: 'category', label: 'Category', required: false, type: 'string' },
      { key: 'limit', label: 'Limit', required: false, type: 'integer' },
    ],
    sample: {
      id: 'sample-result-1',
      title: 'Sample Brief',
      score: 0.95,
    },
  },
};

const verifyClaim = {
  key: 'verifyClaim',
  noun: 'Verification',
  display: {
    label: 'Verify Claim',
    description: 'Verify a claim against the intelligence database.',
  },
  operation: {
    perform: async (z, bundle) => {
      const response = await z.request({
        url: `${BASE_URL}/api/v1/verify`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claim: bundle.inputData.claim }),
      });
      return response.data;
    },
    inputFields: [
      { key: 'claim', label: 'Claim', required: true, type: 'string', helpText: 'The claim to verify.' },
    ],
    sample: {
      verdict: 'supported',
      confidence: 0.87,
      sources: [],
    },
  },
};

const webSearch = {
  key: 'webSearch',
  noun: 'Web Result',
  display: {
    label: 'Web Search',
    description: 'Search the web through Polaris.',
  },
  operation: {
    perform: async (z, bundle) => {
      const params = { q: bundle.inputData.query };
      if (bundle.inputData.limit) params.limit = bundle.inputData.limit;
      if (bundle.inputData.verify) params.verify = bundle.inputData.verify;
      const response = await z.request({
        url: `${BASE_URL}/api/v1/web-search`,
        params,
      });
      return response.data.results || response.data || [];
    },
    inputFields: [
      { key: 'query', label: 'Search Query', required: true, type: 'string' },
      { key: 'limit', label: 'Limit', required: false, type: 'integer' },
      { key: 'verify', label: 'Verify Results', required: false, type: 'boolean' },
    ],
    sample: {
      title: 'Sample Web Result',
      url: 'https://example.com',
      snippet: 'A sample result.',
    },
  },
};

const getBrief = {
  key: 'getBrief',
  noun: 'Brief',
  display: {
    label: 'Get Brief',
    description: 'Retrieve a specific intelligence brief by ID.',
  },
  operation: {
    perform: async (z, bundle) => {
      const response = await z.request({
        url: `${BASE_URL}/api/v1/brief/${bundle.inputData.brief_id}`,
      });
      return response.data;
    },
    inputFields: [
      { key: 'brief_id', label: 'Brief ID', required: true, type: 'string' },
    ],
    sample: {
      id: 'sample-brief-1',
      title: 'Sample Brief',
      content: 'Brief content here.',
    },
  },
};

const getForecast = {
  key: 'getForecast',
  noun: 'Forecast',
  display: {
    label: 'Get Forecast',
    description: 'Generate a geopolitical forecast for a topic.',
  },
  operation: {
    perform: async (z, bundle) => {
      const body = { topic: bundle.inputData.topic };
      if (bundle.inputData.depth) body.depth = bundle.inputData.depth;
      const response = await z.request({
        url: `${BASE_URL}/api/v1/forecast`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      return response.data;
    },
    inputFields: [
      { key: 'topic', label: 'Topic', required: true, type: 'string' },
      { key: 'depth', label: 'Depth', required: false, type: 'string', helpText: 'Set to "deep" for extended analysis.' },
    ],
    sample: {
      topic: 'Sample topic',
      forecast: 'Sample forecast analysis.',
      confidence: 0.75,
    },
  },
};

// ---------------------------------------------------------------------------
// App definition
// ---------------------------------------------------------------------------

module.exports = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version || '15.0.0',
  authentication,
  beforeRequest: authentication.beforeRequest,
  triggers: {
    [newBrief.key]: newBrief,
    [watchlistMatch.key]: watchlistMatch,
    [trendingEntity.key]: trendingEntity,
  },
  searches: {
    [searchBriefs.key]: searchBriefs,
  },
  creates: {
    [verifyClaim.key]: verifyClaim,
    [webSearch.key]: webSearch,
    [getBrief.key]: getBrief,
    [getForecast.key]: getForecast,
  },
};
