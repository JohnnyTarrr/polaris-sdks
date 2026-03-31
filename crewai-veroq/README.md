# crewai-veroq

> **New:** VeroQ 2.0 adds Verified Swarm (multi-agent pipelines), Agent Runtime (finance/legal/research/compliance verticals), and secure external MCP integration. Available via the [MCP server](https://www.npmjs.com/package/veroq-mcp) and [SDKs](https://veroq.ai/docs).

VEROQ Intelligence tools for [CrewAI](https://www.crewai.com) agents. Drop verified intelligence into any CrewAI workflow.

## Install

```bash
pip install crewai-veroq
```

## Quick Start

```python
from crewai_veroq import VeroqAskTool, VeroqVerifyTool

tools = [VeroqAskTool(), VeroqVerifyTool()]
# Use with any CrewAI agent
```

Two tools cover 90% of use cases:

- **`VeroqAskTool`** -- ask any financial question in natural language
- **`VeroqVerifyTool`** -- fact-check any claim against verified intelligence

### Full Crew Example

```python
from crewai import Agent, Task, Crew
from crewai_veroq import VeroqAskTool, VeroqVerifyTool, VeroqSearchTool

ask = VeroqAskTool(api_key="your-api-key")
verify = VeroqVerifyTool(api_key="your-api-key")
search = VeroqSearchTool(api_key="your-api-key")

researcher = Agent(
    role="Financial Analyst",
    goal="Research and verify financial intelligence",
    tools=[ask, verify, search],
)

task = Task(
    description="How is NVDA doing? Verify that NVIDIA beat Q4 earnings.",
    agent=researcher,
    expected_output="Analysis with verified facts",
)

crew = Crew(agents=[researcher], tasks=[task])
result = crew.kickoff()
```

## Environment Variables

The tools accept `api_key` in the constructor. If omitted, the SDK checks these environment variables in order:

1. `VEROQ_API_KEY`
2. `POLARIS_API_KEY`

## Tools

| Tool | Description |
|------|------------|
| **`VeroqAskTool`** | **Ask any financial question in natural language** |
| **`VeroqVerifyTool`** | **Fact-check a claim against verified intelligence** |
| `VeroqSearchTool` | Search verified intelligence with confidence scores |
| `VeroqFullTool` | Cross-reference 9 sources |
| `VeroqFeedTool` | Get latest intelligence feed |
| `VeroqBriefTool` | Get a specific brief by ID |
| `VeroqExtractTool` | Extract article content from URLs |
| `VeroqEntityTool` | Look up entity coverage |
| `VeroqTrendingTool` | Get trending entities |
| `VeroqCompareTool` | Compare outlet coverage of a story |
| `VeroqResearchTool` | Deep multi-source research |
| `VeroqCandlesTool` | OHLCV candle data |
| `VeroqTechnicalsTool` | Technical indicators |
| `VeroqMarketMoversTool` | Top market movers |
| `VeroqEconomyTool` | Economic indicators |
| `VeroqCryptoTool` | Crypto market data |
| `VeroqDefiTool` | DeFi protocol data |
| `VeroqScreenerTool` | Stock screener |
| `VeroqInsiderTool` | Insider trading data |
| `VeroqFilingsTool` | SEC filings |
| `VeroqAnalystsTool` | Analyst ratings |
| `VeroqCongressTool` | Congressional trading data |
| `VeroqRunAgentTool` | Run a marketplace agent |

## Backward Compatibility

This package also exports all tools under their original `Polaris*` names for backward compatibility. Both `VeroqSearchTool` and `PolarisSearchTool` work identically.

## License

MIT
