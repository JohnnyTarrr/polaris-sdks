const BASE_URL = 'https://api.thepolarisreport.com';

const addApiKey = (request, z, bundle) => {
  request.headers = request.headers || {};
  request.headers['Authorization'] = `Bearer ${bundle.authData.api_key}`;
  return request;
};

module.exports = {
  type: 'custom',
  test: {
    url: `${BASE_URL}/api/v1/status`,
  },
  fields: [
    {
      key: 'api_key',
      label: 'API Key',
      required: true,
      type: 'string',
      helpText: 'Your Polaris API key (starts with pr_).',
    },
  ],
  connectionLabel: '{{bundle.inputData.email || "Polaris API"}}',
  beforeRequest: [addApiKey],
};
