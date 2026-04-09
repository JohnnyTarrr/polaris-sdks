import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

const BASE_URL = 'https://api.veroq.ai';

export class Veroq implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'VEROQ',
    name: 'veroq',
    icon: 'file:veroq.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the VEROQ Intelligence API',
    defaults: {
      name: 'VEROQ',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'veroqApi',
        required: true,
      },
    ],
    properties: [
      // ------ Resource ------
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Alt Data', value: 'altData' },
          { name: 'Ask', value: 'ask' },
          { name: 'Briefs', value: 'briefs' },
          { name: 'Crypto', value: 'crypto' },
          { name: 'Energy', value: 'energy' },
          { name: 'Entities', value: 'entities' },
          { name: 'Fast Tier', value: 'fast' },
          { name: 'Intelligence', value: 'intelligence' },
          { name: 'Market Data', value: 'marketData' },
          { name: 'Reports', value: 'reports' },
          { name: 'Research', value: 'research' },
          { name: 'Search', value: 'search' },
          { name: 'SEC EDGAR', value: 'edgar' },
          { name: 'Social', value: 'social' },
          { name: 'Ticker', value: 'ticker' },
          { name: 'Travel', value: 'travel' },
          { name: 'Web', value: 'web' },
          { name: 'World Data', value: 'worldData' },
        ],
        default: 'ask',
      },

      // ------ Ask operations ------
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['ask'] } },
        options: [
          { name: 'Ask', value: 'ask', description: 'Ask any question about markets, companies, or economics' },
          { name: 'Verify', value: 'askVerify', description: 'Fact-check a claim against the intelligence corpus' },
        ],
        default: 'ask',
      },

      // ------ Ask input fields ------
      {
        displayName: 'Question',
        name: 'question',
        type: 'string',
        default: '',
        required: true,
        displayOptions: { show: { resource: ['ask'], operation: ['ask'] } },
        description: 'Natural-language question (e.g. "How is NVDA doing today?")',
      },
      {
        displayName: 'Claim',
        name: 'askClaim',
        type: 'string',
        default: '',
        required: true,
        displayOptions: { show: { resource: ['ask'], operation: ['askVerify'] } },
        description: 'The claim to fact-check (e.g. "Apple is acquiring Disney")',
      },

      // ------ Briefs operations ------
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['briefs'] } },
        options: [
          { name: 'Get Feed', value: 'getFeed', description: 'Get latest intelligence briefs' },
          { name: 'Get Brief', value: 'getBrief', description: 'Get a specific brief by ID' },
          { name: 'Get Timeline', value: 'getTimeline', description: 'Get timeline for a topic' },
          { name: 'Historical', value: 'historical', description: 'Get historical briefs from a date' },
          { name: 'Trending', value: 'trending', description: 'Get trending briefs' },
        ],
        default: 'getFeed',
      },

      // ------ Search operations ------
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['search'] } },
        options: [
          { name: 'Search', value: 'search', description: 'Search briefs by keyword' },
          { name: 'Search Suggest', value: 'searchSuggest', description: 'Get search autocomplete suggestions' },
          { name: 'Web Search', value: 'webSearch', description: 'Search the web' },
        ],
        default: 'search',
      },

      // ------ Intelligence operations ------
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['intelligence'] } },
        options: [
          { name: 'Compare Sources', value: 'compareSources', description: 'Compare sources on a topic' },
          { name: 'Context', value: 'context', description: 'Get contextual analysis' },
          { name: 'Contradictions', value: 'contradictions', description: 'Get contradictions across sources' },
          { name: 'Forecast', value: 'forecast', description: 'Generate a forecast' },
          { name: 'Impact Analysis', value: 'impactAnalysis', description: 'Cross-category impact analysis for a topic' },
          { name: 'Topic Research', value: 'topicResearch', description: 'Research a topic with contextual analysis' },
          { name: 'Verify', value: 'verify', description: 'Verify a claim' },
        ],
        default: 'verify',
      },

      // ------ Reports operations ------
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['reports'] } },
        options: [
          { name: 'Generate Report', value: 'generateReport', description: 'Generate a new report for a ticker' },
          { name: 'Get Report', value: 'getReport', description: 'Get a report by ID' },
        ],
        default: 'generateReport',
      },

      // ------ Web operations ------
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['web'] } },
        options: [
          { name: 'Crawl', value: 'crawl', description: 'Crawl a URL' },
          { name: 'Extract', value: 'extract', description: 'Extract content from a URL' },
        ],
        default: 'crawl',
      },

      // ------ Market Data operations ------
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['marketData'] } },
        options: [
          { name: 'Candles', value: 'candles', description: 'Get OHLCV candlestick data for a ticker' },
          { name: 'Commodities', value: 'commodities', description: 'Get commodities data' },
          { name: 'Congress Trades', value: 'congressTrades', description: 'Get congressional trading activity' },
          { name: 'Earnings', value: 'earnings', description: 'Get earnings data for a ticker' },
          { name: 'Economy Indicator', value: 'economyIndicator', description: 'Get economic indicator data' },
          { name: 'Forex', value: 'forex', description: 'Get foreign exchange rates' },
          { name: 'IPO Calendar', value: 'ipoCalendar', description: 'Get upcoming IPOs' },
          { name: 'Market Movers', value: 'marketMovers', description: 'Get top market movers (gainers, losers, active)' },
          { name: 'Market Summary', value: 'marketSummary', description: 'Get overall market summary and indices' },
          { name: 'Sectors', value: 'sectors', description: 'Get sector performance data' },
          { name: 'Technicals', value: 'technicals', description: 'Get technical analysis indicators for a ticker' },
        ],
        default: 'candles',
      },

      // ------ Crypto operations ------
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['crypto'] } },
        options: [
          { name: 'Chart', value: 'cryptoChart', description: 'Get price chart data for a cryptocurrency' },
          { name: 'DeFi Protocol', value: 'defiProtocol', description: 'Get DeFi protocol data' },
          { name: 'Get Crypto', value: 'crypto', description: 'Get cryptocurrency data' },
          { name: 'Top Cryptos', value: 'cryptoTop', description: 'Get top cryptocurrencies by market cap' },
        ],
        default: 'crypto',
      },

      // ------ Social operations ------
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['social'] } },
        options: [
          { name: 'Social Sentiment', value: 'socialSentiment', description: 'Get social media sentiment for a ticker' },
          { name: 'Social Sentiment (Entity)', value: 'socialSentimentEntity', description: 'Get social sentiment for any entity' },
          { name: 'Social Trending', value: 'socialTrending', description: 'Get trending tickers on social media' },
        ],
        default: 'socialSentiment',
      },

      // ------ Ticker operations ------
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['ticker'] } },
        options: [
          { name: 'Ticker Analysis', value: 'tickerAnalysis', description: 'Get full analysis for a ticker' },
          { name: 'Ticker News', value: 'tickerNews', description: 'Get recent news for a ticker' },
        ],
        default: 'tickerNews',
      },

      // ------ Fast Tier operations ------
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['fast'] } },
        options: [
          { name: 'Heatmap', value: 'heatmap', description: 'Get market heatmap' },
          { name: 'Macro', value: 'macro', description: 'Get macro overview' },
          { name: 'Movers', value: 'movers', description: 'Get fast movers' },
          { name: 'Signals', value: 'signals', description: 'Get fast signals' },
          { name: 'Snapshot', value: 'snapshot', description: 'Get fast snapshot for a ticker' },
        ],
        default: 'signals',
      },

      // ------ Travel operations ------
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['travel'] } },
        options: [
          { name: 'FAA', value: 'faa', description: 'Get FAA data' },
          { name: 'Overview', value: 'overview', description: 'Get travel overview' },
          { name: 'TSA', value: 'tsa', description: 'Get TSA throughput data' },
        ],
        default: 'overview',
      },

      // ------ SEC EDGAR operations ------
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['edgar'] } },
        options: [
          { name: 'Filings', value: 'filings', description: 'Get SEC filings for a ticker' },
          { name: 'Financials', value: 'financials', description: 'Get financial statements for a ticker' },
          { name: 'Insider', value: 'insider', description: 'Get insider trading data for a ticker' },
        ],
        default: 'filings',
      },

      // ------ Energy operations ------
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['energy'] } },
        options: [
          { name: 'Overview', value: 'overview', description: 'Get energy market overview' },
        ],
        default: 'overview',
      },

      // ------ Alt Data operations ------
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['altData'] } },
        options: [
          { name: 'Attention', value: 'attention', description: 'Get attention data for an entity' },
          { name: 'COT', value: 'cot', description: 'Get Commitment of Traders data for a commodity' },
          { name: 'Yields', value: 'yields', description: 'Get yield curve data' },
        ],
        default: 'yields',
      },

      // ------ Research operations ------
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['research'] } },
        options: [
          { name: 'Bills', value: 'bills', description: 'Get recent congressional bills' },
          { name: 'FDA', value: 'fda', description: 'Get FDA approvals or recalls' },
          { name: 'GitHub Trending', value: 'githubTrending', description: 'Get trending GitHub repositories' },
          { name: 'Papers', value: 'papers', description: 'Get research papers' },
          { name: 'Regulations', value: 'regulations', description: 'Get recent regulations' },
        ],
        default: 'papers',
      },

      // ------ World Data operations ------
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['worldData'] } },
        options: [
          { name: 'GDP', value: 'gdp', description: 'Get global GDP data' },
          { name: 'Hacker News', value: 'hackernews', description: 'Get top Hacker News stories' },
          { name: 'Jobs', value: 'jobs', description: 'Get jobs data' },
        ],
        default: 'hackernews',
      },

      // ------ Entities operations ------
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['entities'] } },
        options: [
          { name: 'Entity Briefs', value: 'entityBriefs', description: 'Get briefs for a named entity' },
          { name: 'Trending', value: 'entityTrending', description: 'Get trending entities' },
        ],
        default: 'entityTrending',
      },

      // ------ Input fields ------

      // Brief ID (for getBrief)
      {
        displayName: 'Brief ID',
        name: 'briefId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: { show: { resource: ['briefs'], operation: ['getBrief'] } },
        description: 'The ID of the brief to retrieve',
      },

      // Query (for search, suggest, webSearch, getTimeline)
      {
        displayName: 'Query',
        name: 'query',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            operation: ['search', 'searchSuggest', 'webSearch', 'getTimeline'],
          },
        },
        description: 'Search query or topic',
      },

      // Claim (for verify)
      {
        displayName: 'Claim',
        name: 'claim',
        type: 'string',
        default: '',
        required: true,
        displayOptions: { show: { resource: ['intelligence'], operation: ['verify'] } },
        description: 'The claim to verify',
      },

      // Topic (for forecast, context, topicResearch, impactAnalysis, compareSources)
      {
        displayName: 'Topic',
        name: 'topic',
        type: 'string',
        default: '',
        required: true,
        displayOptions: { show: { resource: ['intelligence'], operation: ['forecast', 'context', 'topicResearch', 'impactAnalysis', 'compareSources'] } },
        description: 'The topic to analyze',
      },

      // URL (for crawl, extract)
      {
        displayName: 'URL',
        name: 'url',
        type: 'string',
        default: '',
        required: true,
        displayOptions: { show: { resource: ['web'] } },
        description: 'The URL to process',
      },

      // Limit (optional, multiple operations)
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 10,
        displayOptions: {
          show: {
            operation: ['getFeed', 'search', 'webSearch', 'cryptoTop'],
          },
        },
        description: 'Maximum number of results to return',
      },

      // Depth (for forecast)
      {
        displayName: 'Depth',
        name: 'depth',
        type: 'options',
        options: [
          { name: 'Standard', value: 'standard' },
          { name: 'Deep', value: 'deep' },
        ],
        default: 'standard',
        displayOptions: { show: { resource: ['intelligence'], operation: ['forecast'] } },
        description: 'Analysis depth',
      },

      // Category (for search, getFeed)
      {
        displayName: 'Category',
        name: 'category',
        type: 'string',
        default: '',
        displayOptions: { show: { operation: ['search', 'getFeed'] } },
        description: 'Filter by category',
      },

      // ------ Market Data input fields ------

      // Symbol (for candles, technicals, earnings)
      {
        displayName: 'Symbol',
        name: 'symbol',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['marketData'],
            operation: ['candles', 'technicals', 'earnings'],
          },
        },
        description: 'Ticker symbol (e.g. AAPL, MSFT, NVDA)',
      },

      // Interval (for candles)
      {
        displayName: 'Interval',
        name: 'interval',
        type: 'options',
        options: [
          { name: '1 Minute', value: '1m' },
          { name: '5 Minutes', value: '5m' },
          { name: '15 Minutes', value: '15m' },
          { name: '30 Minutes', value: '30m' },
          { name: '1 Hour', value: '1h' },
          { name: '1 Day', value: '1d' },
          { name: '1 Week', value: '1wk' },
          { name: '1 Month', value: '1mo' },
        ],
        default: '1d',
        displayOptions: { show: { resource: ['marketData'], operation: ['candles'] } },
        description: 'Candlestick interval',
      },

      // Range (for candles, technicals)
      {
        displayName: 'Range',
        name: 'range',
        type: 'options',
        options: [
          { name: '1 Day', value: '1d' },
          { name: '5 Days', value: '5d' },
          { name: '1 Month', value: '1mo' },
          { name: '3 Months', value: '3mo' },
          { name: '6 Months', value: '6mo' },
          { name: '1 Year', value: '1y' },
          { name: '5 Years', value: '5y' },
        ],
        default: '1mo',
        displayOptions: { show: { resource: ['marketData'], operation: ['candles', 'technicals'] } },
        description: 'Time range for data',
      },

      // Forex pair (optional)
      {
        displayName: 'Currency Pair',
        name: 'pair',
        type: 'string',
        default: '',
        displayOptions: { show: { resource: ['marketData'], operation: ['forex'] } },
        description: 'Currency pair (e.g. EURUSD). Leave empty to get all major pairs.',
      },

      // Commodity symbol (optional)
      {
        displayName: 'Commodity Symbol',
        name: 'commoditySymbol',
        type: 'string',
        default: '',
        displayOptions: { show: { resource: ['marketData'], operation: ['commodities'] } },
        description: 'Commodity symbol (e.g. GC=F for gold). Leave empty to get all commodities.',
      },

      // Economy indicator (optional)
      {
        displayName: 'Indicator',
        name: 'indicator',
        type: 'string',
        default: '',
        displayOptions: { show: { resource: ['marketData'], operation: ['economyIndicator'] } },
        description: 'Economic indicator name (e.g. gdp, cpi, unemployment). Leave empty to get all indicators.',
      },

      // ------ Crypto input fields ------

      // Crypto symbol (for crypto, cryptoChart)
      {
        displayName: 'Symbol',
        name: 'cryptoSymbol',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            resource: ['crypto'],
            operation: ['crypto', 'cryptoChart'],
          },
        },
        description: 'Cryptocurrency symbol (e.g. bitcoin, ethereum). For Get Crypto, leave empty to get overview.',
      },

      // Days (for cryptoChart)
      {
        displayName: 'Days',
        name: 'days',
        type: 'number',
        default: 30,
        displayOptions: { show: { resource: ['crypto'], operation: ['cryptoChart'] } },
        description: 'Number of days of chart history',
      },

      // DeFi protocol (optional)
      {
        displayName: 'Protocol',
        name: 'protocol',
        type: 'string',
        default: '',
        displayOptions: { show: { resource: ['crypto'], operation: ['defiProtocol'] } },
        description: 'DeFi protocol name (e.g. aave, uniswap). Leave empty to get all protocols.',
      },

      // ------ Social input fields ------

      // Symbol (for socialSentiment)
      {
        displayName: 'Symbol',
        name: 'socialSymbol',
        type: 'string',
        default: '',
        required: true,
        displayOptions: { show: { resource: ['social'], operation: ['socialSentiment'] } },
        description: 'Ticker symbol (e.g. AAPL, TSLA, BTC)',
      },

      // ------ Ticker input fields ------

      // Symbol (for tickerNews, tickerAnalysis)
      {
        displayName: 'Symbol',
        name: 'tickerSymbol',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['ticker'],
            operation: ['tickerNews', 'tickerAnalysis'],
          },
        },
        description: 'Ticker symbol (e.g. AAPL, MSFT, NVDA)',
      },

      // ------ Reports input fields ------

      // Ticker (for generateReport)
      {
        displayName: 'Ticker',
        name: 'reportTicker',
        type: 'string',
        default: '',
        required: true,
        displayOptions: { show: { resource: ['reports'], operation: ['generateReport'] } },
        description: 'Ticker symbol to generate report for (e.g. AAPL, MSFT)',
      },

      // Tier (for generateReport)
      {
        displayName: 'Tier',
        name: 'reportTier',
        type: 'options',
        options: [
          { name: 'Quick', value: 'quick' },
          { name: 'Full', value: 'full' },
          { name: 'Deep', value: 'deep' },
        ],
        default: 'quick',
        displayOptions: { show: { resource: ['reports'], operation: ['generateReport'] } },
        description: 'Report depth tier',
      },

      // Report ID (for getReport)
      {
        displayName: 'Report ID',
        name: 'reportId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: { show: { resource: ['reports'], operation: ['getReport'] } },
        description: 'The ID of the report to retrieve',
      },

      // ------ Fast Tier input fields ------

      // Ticker (for fast/snapshot)
      {
        displayName: 'Ticker',
        name: 'fastTicker',
        type: 'string',
        default: '',
        required: true,
        displayOptions: { show: { resource: ['fast'], operation: ['snapshot'] } },
        description: 'Ticker symbol (e.g. AAPL, MSFT, NVDA)',
      },

      // ------ SEC EDGAR input fields ------

      // Ticker (for edgar/filings, insider, financials)
      {
        displayName: 'Ticker',
        name: 'edgarTicker',
        type: 'string',
        default: '',
        required: true,
        displayOptions: { show: { resource: ['edgar'], operation: ['filings', 'insider', 'financials'] } },
        description: 'Ticker symbol (e.g. AAPL, MSFT, NVDA)',
      },

      // ------ Alt Data input fields ------

      // Commodity (for alt/cot)
      {
        displayName: 'Commodity',
        name: 'commodity',
        type: 'string',
        default: '',
        required: true,
        displayOptions: { show: { resource: ['altData'], operation: ['cot'] } },
        description: 'Commodity identifier (e.g. crude-oil, gold, sp500)',
      },

      // Entity (for alt/attention)
      {
        displayName: 'Entity',
        name: 'altEntity',
        type: 'string',
        default: '',
        required: true,
        displayOptions: { show: { resource: ['altData'], operation: ['attention'] } },
        description: 'Entity name to get attention data for',
      },

      // ------ Research input fields ------

      // Category (for research/papers, optional)
      {
        displayName: 'Category',
        name: 'researchCategory',
        type: 'string',
        default: '',
        displayOptions: { show: { resource: ['research'], operation: ['papers'] } },
        description: 'Filter papers by category (optional)',
      },

      // Type (for research/fda, optional)
      {
        displayName: 'Type',
        name: 'fdaType',
        type: 'options',
        options: [
          { name: 'All', value: '' },
          { name: 'Approvals', value: 'approvals' },
          { name: 'Recalls', value: 'recalls' },
        ],
        default: '',
        displayOptions: { show: { resource: ['research'], operation: ['fda'] } },
        description: 'Filter by FDA action type',
      },

      // ------ Entities input fields ------

      // Limit (for entities/trending, optional)
      {
        displayName: 'Limit',
        name: 'entitiesLimit',
        type: 'number',
        default: 10,
        displayOptions: { show: { resource: ['entities'], operation: ['entityTrending'] } },
        description: 'Maximum number of trending entities to return',
      },

      // Name (for entities/{name}/briefs)
      {
        displayName: 'Entity Name',
        name: 'entityName',
        type: 'string',
        default: '',
        required: true,
        displayOptions: { show: { resource: ['entities'], operation: ['entityBriefs'] } },
        description: 'Name of the entity (e.g. Apple, Elon Musk)',
      },

      // ------ Briefs new input fields ------

      // From (for historical)
      {
        displayName: 'From Date',
        name: 'historicalFrom',
        type: 'string',
        default: '',
        required: true,
        displayOptions: { show: { resource: ['briefs'], operation: ['historical'] } },
        description: 'Start date in YYYY-MM-DD or YYYY format',
      },

      // ------ Market Data new input fields ------

      // Symbol (for congressTrades, optional)
      {
        displayName: 'Symbol',
        name: 'congressSymbol',
        type: 'string',
        default: '',
        displayOptions: { show: { resource: ['marketData'], operation: ['congressTrades'] } },
        description: 'Filter by ticker symbol (optional)',
      },

      // ------ Social new input fields ------

      // Entity (for socialSentimentEntity)
      {
        displayName: 'Entity',
        name: 'socialEntity',
        type: 'string',
        default: '',
        required: true,
        displayOptions: { show: { resource: ['social'], operation: ['socialSentimentEntity'] } },
        description: 'Entity name to get social sentiment for',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const credentials = await this.getCredentials('veroqApi');
    const apiKey = credentials.apiKey as string;

    const headers = { Authorization: `Bearer ${apiKey}` };

    for (let i = 0; i < items.length; i++) {
      const resource = this.getNodeParameter('resource', i) as string;
      const operation = this.getNodeParameter('operation', i) as string;

      let response: any;

      // --- Ask ---
      if (resource === 'ask') {
        if (operation === 'ask') {
          const question = this.getNodeParameter('question', i) as string;
          response = await this.helpers.httpRequest({
            method: 'POST',
            url: `${BASE_URL}/api/v1/ask`,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: { question },
          });
        } else if (operation === 'askVerify') {
          const claim = this.getNodeParameter('askClaim', i) as string;
          response = await this.helpers.httpRequest({
            method: 'POST',
            url: `${BASE_URL}/api/v1/verify`,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: { claim },
          });
        }
      }

      // --- Briefs ---
      if (resource === 'briefs') {
        if (operation === 'getFeed') {
          const limit = this.getNodeParameter('limit', i, 10) as number;
          const category = this.getNodeParameter('category', i, '') as string;
          const qs: Record<string, any> = { per_page: limit, sort: 'date' };
          if (category) qs.category = category;
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/feed`,
            headers,
            qs,
          });
        } else if (operation === 'getBrief') {
          const briefId = this.getNodeParameter('briefId', i) as string;
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/brief/${briefId}`,
            headers,
          });
        } else if (operation === 'getTimeline') {
          const query = this.getNodeParameter('query', i) as string;
          response = await this.helpers.httpRequest({
            method: 'POST',
            url: `${BASE_URL}/api/v1/timeline`,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: { topic: query },
          });
        } else if (operation === 'trending') {
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/trending`,
            headers,
          });
        } else if (operation === 'historical') {
          const from = this.getNodeParameter('historicalFrom', i) as string;
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/historical`,
            headers,
            qs: { from },
          });
        }
      }

      // --- Search ---
      if (resource === 'search') {
        const query = this.getNodeParameter('query', i) as string;
        if (operation === 'search') {
          const limit = this.getNodeParameter('limit', i, 10) as number;
          const category = this.getNodeParameter('category', i, '') as string;
          const qs: Record<string, any> = { q: query, limit };
          if (category) qs.category = category;
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/search`,
            headers,
            qs,
          });
        } else if (operation === 'searchSuggest') {
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/search/suggest`,
            headers,
            qs: { q: query },
          });
        } else if (operation === 'webSearch') {
          const limit = this.getNodeParameter('limit', i, 10) as number;
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/web-search`,
            headers,
            qs: { q: query, limit },
          });
        }
      }

      // --- Intelligence ---
      if (resource === 'intelligence') {
        if (operation === 'verify') {
          const claim = this.getNodeParameter('claim', i) as string;
          response = await this.helpers.httpRequest({
            method: 'POST',
            url: `${BASE_URL}/api/v1/verify`,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: { claim },
          });
        } else if (operation === 'forecast') {
          const topic = this.getNodeParameter('topic', i) as string;
          const depth = this.getNodeParameter('depth', i, 'standard') as string;
          response = await this.helpers.httpRequest({
            method: 'POST',
            url: `${BASE_URL}/api/v1/forecast`,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: { topic, depth },
          });
        } else if (operation === 'context') {
          const topic = this.getNodeParameter('topic', i) as string;
          response = await this.helpers.httpRequest({
            method: 'POST',
            url: `${BASE_URL}/api/v1/intelligence`,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: { topic },
          });
        } else if (operation === 'topicResearch') {
          const topic = this.getNodeParameter('topic', i) as string;
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/context`,
            headers,
            qs: { topic },
          });
        } else if (operation === 'impactAnalysis') {
          const topic = this.getNodeParameter('topic', i) as string;
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/intelligence`,
            headers,
            qs: { topic },
          });
        } else if (operation === 'contradictions') {
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/contradictions`,
            headers,
          });
        } else if (operation === 'compareSources') {
          const topic = this.getNodeParameter('topic', i) as string;
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/compare/sources`,
            headers,
            qs: { topic },
          });
        }
      }

      // --- Web ---
      if (resource === 'web') {
        const url = this.getNodeParameter('url', i) as string;
        if (operation === 'crawl') {
          response = await this.helpers.httpRequest({
            method: 'POST',
            url: `${BASE_URL}/api/v1/crawl`,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: { url },
          });
        } else if (operation === 'extract') {
          response = await this.helpers.httpRequest({
            method: 'POST',
            url: `${BASE_URL}/api/v1/extract`,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: { url },
          });
        }
      }

      // --- Market Data ---
      if (resource === 'marketData') {
        if (operation === 'candles') {
          const symbol = this.getNodeParameter('symbol', i) as string;
          const interval = this.getNodeParameter('interval', i, '1d') as string;
          const range = this.getNodeParameter('range', i, '1mo') as string;
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/ticker/${encodeURIComponent(symbol)}/candles`,
            headers,
            qs: { interval, range },
          });
        } else if (operation === 'technicals') {
          const symbol = this.getNodeParameter('symbol', i) as string;
          const range = this.getNodeParameter('range', i, '1mo') as string;
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/ticker/${encodeURIComponent(symbol)}/technicals`,
            headers,
            qs: { range },
          });
        } else if (operation === 'earnings') {
          const symbol = this.getNodeParameter('symbol', i) as string;
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/ticker/${encodeURIComponent(symbol)}/earnings`,
            headers,
          });
        } else if (operation === 'marketMovers') {
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/market/movers`,
            headers,
          });
        } else if (operation === 'marketSummary') {
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/market/summary`,
            headers,
          });
        } else if (operation === 'forex') {
          const pair = this.getNodeParameter('pair', i, '') as string;
          const url = pair
            ? `${BASE_URL}/api/v1/forex/${encodeURIComponent(pair)}`
            : `${BASE_URL}/api/v1/forex`;
          response = await this.helpers.httpRequest({
            method: 'GET',
            url,
            headers,
          });
        } else if (operation === 'commodities') {
          const commoditySymbol = this.getNodeParameter('commoditySymbol', i, '') as string;
          const url = commoditySymbol
            ? `${BASE_URL}/api/v1/commodities/${encodeURIComponent(commoditySymbol)}`
            : `${BASE_URL}/api/v1/commodities`;
          response = await this.helpers.httpRequest({
            method: 'GET',
            url,
            headers,
          });
        } else if (operation === 'economyIndicator') {
          const indicator = this.getNodeParameter('indicator', i, '') as string;
          const url = indicator
            ? `${BASE_URL}/api/v1/economy/${encodeURIComponent(indicator)}`
            : `${BASE_URL}/api/v1/economy`;
          response = await this.helpers.httpRequest({
            method: 'GET',
            url,
            headers,
          });
        } else if (operation === 'ipoCalendar') {
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/ipo/calendar`,
            headers,
          });
        } else if (operation === 'sectors') {
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/sectors`,
            headers,
          });
        } else if (operation === 'congressTrades') {
          const congressSymbol = this.getNodeParameter('congressSymbol', i, '') as string;
          const qs: Record<string, any> = {};
          if (congressSymbol) qs.symbol = congressSymbol;
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/congress/trades`,
            headers,
            qs,
          });
        }
      }

      // --- Crypto ---
      if (resource === 'crypto') {
        if (operation === 'crypto') {
          const cryptoSymbol = this.getNodeParameter('cryptoSymbol', i, '') as string;
          const url = cryptoSymbol
            ? `${BASE_URL}/api/v1/crypto/${encodeURIComponent(cryptoSymbol)}`
            : `${BASE_URL}/api/v1/crypto`;
          response = await this.helpers.httpRequest({
            method: 'GET',
            url,
            headers,
          });
        } else if (operation === 'cryptoTop') {
          const limit = this.getNodeParameter('limit', i, 10) as number;
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/crypto/top`,
            headers,
            qs: { limit },
          });
        } else if (operation === 'cryptoChart') {
          const cryptoSymbol = this.getNodeParameter('cryptoSymbol', i) as string;
          const days = this.getNodeParameter('days', i, 30) as number;
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/crypto/${encodeURIComponent(cryptoSymbol)}/chart`,
            headers,
            qs: { days },
          });
        } else if (operation === 'defiProtocol') {
          const protocol = this.getNodeParameter('protocol', i, '') as string;
          const url = protocol
            ? `${BASE_URL}/api/v1/crypto/defi/${encodeURIComponent(protocol)}`
            : `${BASE_URL}/api/v1/crypto/defi`;
          response = await this.helpers.httpRequest({
            method: 'GET',
            url,
            headers,
          });
        }
      }

      // --- Social ---
      if (resource === 'social') {
        if (operation === 'socialSentiment') {
          const socialSymbol = this.getNodeParameter('socialSymbol', i) as string;
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/ticker/${encodeURIComponent(socialSymbol)}/social`,
            headers,
          });
        } else if (operation === 'socialTrending') {
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/social/trending`,
            headers,
          });
        } else if (operation === 'socialSentimentEntity') {
          const entity = this.getNodeParameter('socialEntity', i) as string;
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/social/sentiment/${encodeURIComponent(entity)}`,
            headers,
          });
        }
      }

      // --- Reports ---
      if (resource === 'reports') {
        if (operation === 'generateReport') {
          const ticker = this.getNodeParameter('reportTicker', i) as string;
          const tier = this.getNodeParameter('reportTier', i, 'quick') as string;
          response = await this.helpers.httpRequest({
            method: 'POST',
            url: `${BASE_URL}/api/v1/reports/generate`,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: { ticker, tier },
          });
        } else if (operation === 'getReport') {
          const reportId = this.getNodeParameter('reportId', i) as string;
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/reports/${encodeURIComponent(reportId)}`,
            headers,
          });
        }
      }

      // --- Ticker ---
      if (resource === 'ticker') {
        const tickerSymbol = this.getNodeParameter('tickerSymbol', i) as string;
        if (operation === 'tickerNews') {
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/ticker/${encodeURIComponent(tickerSymbol)}/news`,
            headers,
          });
        } else if (operation === 'tickerAnalysis') {
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/ticker/${encodeURIComponent(tickerSymbol)}/analysis`,
            headers,
          });
        }
      }

      // --- Fast Tier ---
      if (resource === 'fast') {
        if (operation === 'signals') {
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/fast/signals`,
            headers,
          });
        } else if (operation === 'macro') {
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/fast/macro`,
            headers,
          });
        } else if (operation === 'snapshot') {
          const ticker = this.getNodeParameter('fastTicker', i) as string;
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/fast/snapshot/${encodeURIComponent(ticker)}`,
            headers,
          });
        } else if (operation === 'movers') {
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/fast/movers`,
            headers,
          });
        } else if (operation === 'heatmap') {
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/fast/heatmap`,
            headers,
          });
        }
      }

      // --- Travel ---
      if (resource === 'travel') {
        if (operation === 'overview') {
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/travel/overview`,
            headers,
          });
        } else if (operation === 'tsa') {
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/travel/tsa`,
            headers,
          });
        } else if (operation === 'faa') {
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/travel/faa`,
            headers,
          });
        }
      }

      // --- SEC EDGAR ---
      if (resource === 'edgar') {
        const edgarTicker = this.getNodeParameter('edgarTicker', i) as string;
        if (operation === 'filings') {
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/edgar/filings/${encodeURIComponent(edgarTicker)}`,
            headers,
          });
        } else if (operation === 'insider') {
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/edgar/insider/${encodeURIComponent(edgarTicker)}`,
            headers,
          });
        } else if (operation === 'financials') {
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/edgar/financials/${encodeURIComponent(edgarTicker)}`,
            headers,
          });
        }
      }

      // --- Energy ---
      if (resource === 'energy') {
        if (operation === 'overview') {
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/energy/overview`,
            headers,
          });
        }
      }

      // --- Alt Data ---
      if (resource === 'altData') {
        if (operation === 'yields') {
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/alt/yields`,
            headers,
          });
        } else if (operation === 'cot') {
          const commodity = this.getNodeParameter('commodity', i) as string;
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/alt/cot/${encodeURIComponent(commodity)}`,
            headers,
          });
        } else if (operation === 'attention') {
          const entity = this.getNodeParameter('altEntity', i) as string;
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/alt/attention/${encodeURIComponent(entity)}`,
            headers,
          });
        }
      }

      // --- Research ---
      if (resource === 'research') {
        if (operation === 'papers') {
          const category = this.getNodeParameter('researchCategory', i, '') as string;
          const qs: Record<string, any> = {};
          if (category) qs.category = category;
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/research/papers`,
            headers,
            qs,
          });
        } else if (operation === 'githubTrending') {
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/research/github-trending`,
            headers,
          });
        } else if (operation === 'fda') {
          const fdaType = this.getNodeParameter('fdaType', i, '') as string;
          const qs: Record<string, any> = {};
          if (fdaType) qs.type = fdaType;
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/research/fda`,
            headers,
            qs,
          });
        } else if (operation === 'bills') {
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/research/bills`,
            headers,
          });
        } else if (operation === 'regulations') {
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/research/regulations`,
            headers,
          });
        }
      }

      // --- World Data ---
      if (resource === 'worldData') {
        if (operation === 'hackernews') {
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/world/hackernews`,
            headers,
          });
        } else if (operation === 'jobs') {
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/world/jobs`,
            headers,
          });
        } else if (operation === 'gdp') {
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/world/gdp`,
            headers,
          });
        }
      }

      // --- Entities ---
      if (resource === 'entities') {
        if (operation === 'entityTrending') {
          const limit = this.getNodeParameter('entitiesLimit', i, 10) as number;
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/entities/trending`,
            headers,
            qs: { limit },
          });
        } else if (operation === 'entityBriefs') {
          const name = this.getNodeParameter('entityName', i) as string;
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${BASE_URL}/api/v1/entities/${encodeURIComponent(name)}/briefs`,
            headers,
          });
        }
      }

      returnData.push({ json: response ?? {} });
    }

    return [returnData];
  }
}
