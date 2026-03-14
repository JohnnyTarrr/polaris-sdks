# Polaris News — Cursor Plugin

Verified, bias-scored intelligence briefs from [The Polaris Report](https://thepolarisreport.com). 8 MCP tools for search, feed, extraction, entity tracking, trend analysis, source comparison, and deep research.

## Setup

1. Get your API key at [thepolarisreport.com/developers](https://thepolarisreport.com/developers)
2. Set the environment variable:
   ```sh
   export POLARIS_API_KEY=pr_live_your_key_here
   ```
3. Install the plugin from the Cursor marketplace, or add manually to `~/.cursor/mcp.json`:
   ```json
   {
     "mcpServers": {
       "polaris": {
         "url": "https://api.thepolarisreport.com/api/v1/mcp",
         "headers": {
           "Authorization": "Bearer ${env:POLARIS_API_KEY}"
         }
       }
     }
   }
   ```

## Tools

| Tool | Description |
|------|-------------|
| `polaris_search` | Search verified news briefs by topic |
| `polaris_feed` | Get latest briefs, filter by category or source |
| `polaris_brief` | Full brief details by ID |
| `polaris_extract` | Extract article content from URLs |
| `polaris_entities` | Briefs mentioning a specific entity |
| `polaris_trending` | Trending entities by mention count |
| `polaris_compare` | Compare source coverage and bias on a topic |
| `polaris_research` | Deep research with key findings and entity map |
