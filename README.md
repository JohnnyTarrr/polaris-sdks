# Polaris SDKs

Official SDKs and framework integrations for [The Polaris Report](https://thepolarisreport.com) API.

## SDKs

| Language | Package | Install |
|----------|---------|---------|
| Python | [`polaris-news`](./python/) | `pip install polaris-news` |
| TypeScript | [`polaris-news-api`](./typescript/) | `npm install polaris-news-api` |
| Vercel AI SDK | [`@polaris-news/ai`](./ai/) | `npm install @polaris-news/ai` |
| CrewAI | [`crewai-polaris`](./crewai-polaris/) | `pip install crewai-polaris` |
| LangChain | [`langchain-polaris`](./python/langchain_polaris/) | `pip install langchain-polaris` |
| Cursor | [`polaris-news`](./cursor-plugin/) | [Add to Cursor](cursor://anysphere.cursor-deeplink/mcp/install?name=Polaris&config=eyJ1cmwiOiJodHRwczovL2FwaS50aGVwb2xhcmlzcmVwb3J0LmNvbS9hcGkvdjEvbWNwP2tleT1ZT1VSX0FQSV9LRVkifQ==) |

## Quick Start

### Authenticate via CLI

```bash
pip install polaris-news   # or: npm install polaris-news-api
polaris login              # opens GitHub — API key saved to ~/.polaris/credentials
```

### Python

```python
from polaris_news import PolarisClient

client = PolarisClient()  # auto-reads saved credentials
feed = client.feed(category="technology", limit=10)
for brief in feed.briefs:
    print(brief.headline)
```

### TypeScript

```typescript
import { PolarisClient } from "polaris-news-api";

const client = new PolarisClient();  // auto-reads saved credentials
const feed = await client.feed({ category: "technology", limit: 10 });
feed.briefs.forEach((brief) => console.log(brief.headline));
```

### API Key Resolution

Both SDKs resolve the API key in this order:
1. Explicit parameter (`api_key=` / `apiKey:`)
2. `POLARIS_API_KEY` environment variable
3. `~/.polaris/credentials` file (written by `polaris login`)

## Documentation

Full API documentation: https://thepolarisreport.com/docs

## License

MIT
