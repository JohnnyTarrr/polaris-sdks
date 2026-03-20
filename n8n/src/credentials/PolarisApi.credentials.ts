import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class PolarisApi implements ICredentialType {
  name = 'polarisApi';
  displayName = 'Polaris API';
  documentationUrl = 'https://docs.thepolarisreport.com';

  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
      description: 'Your Polaris API key (starts with pr_)',
    },
  ];
}
