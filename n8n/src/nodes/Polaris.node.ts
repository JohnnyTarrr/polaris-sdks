import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

const BASE_URL = 'https://api.thepolarisreport.com';

export class Polaris implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Polaris',
    name: 'polaris',
    icon: 'file:polaris.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Polaris Knowledge API',
    defaults: {
      name: 'Polaris',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'polarisApi',
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
          { name: 'Briefs', value: 'briefs' },
          { name: 'Search', value: 'search' },
          { name: 'Intelligence', value: 'intelligence' },
          { name: 'Web', value: 'web' },
        ],
        default: 'briefs',
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
          { name: 'Suggest', value: 'suggest', description: 'Get search suggestions' },
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
          { name: 'Verify', value: 'verify', description: 'Verify a claim' },
          { name: 'Forecast', value: 'forecast', description: 'Generate a forecast' },
          { name: 'Context', value: 'context', description: 'Get contextual analysis' },
        ],
        default: 'verify',
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

      // Query (for search, suggest, webSearch)
      {
        displayName: 'Query',
        name: 'query',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            operation: ['search', 'suggest', 'webSearch', 'getTimeline'],
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

      // Topic (for forecast, context)
      {
        displayName: 'Topic',
        name: 'topic',
        type: 'string',
        default: '',
        required: true,
        displayOptions: { show: { resource: ['intelligence'], operation: ['forecast', 'context'] } },
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
            operation: ['getFeed', 'search', 'webSearch'],
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
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const credentials = await this.getCredentials('polarisApi');
    const apiKey = credentials.apiKey as string;

    const headers = { Authorization: `Bearer ${apiKey}` };

    for (let i = 0; i < items.length; i++) {
      const resource = this.getNodeParameter('resource', i) as string;
      const operation = this.getNodeParameter('operation', i) as string;

      let response: any;

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
        } else if (operation === 'suggest') {
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

      returnData.push({ json: response ?? {} });
    }

    return [returnData];
  }
}
