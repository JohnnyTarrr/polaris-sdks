# crewai-polaris

Polaris News tools for [CrewAI](https://www.crewai.com) agents. Drop verified news intelligence into any CrewAI workflow.

## Install

```bash
pip install crewai-polaris
```

## Quick Start

```python
from crewai import Agent, Task, Crew
from crewai_polaris import PolarisSearchTool, PolarisFeedTool

search = PolarisSearchTool(api_key="your-api-key")
feed = PolarisFeedTool(api_key="your-api-key")

researcher = Agent(
    role="News Analyst",
    goal="Find and analyze the latest news",
    tools=[search, feed],
)

task = Task(
    description="What are the top AI developments today?",
    agent=researcher,
    expected_output="A summary of today's top AI news",
)

crew = Crew(agents=[researcher], tasks=[task])
result = crew.kickoff()
```

## Tools

| Tool | Description |
|------|------------|
| `PolarisSearchTool` | Search verified news briefs with confidence scores |
| `PolarisFeedTool` | Get latest intelligence feed |
| `PolarisBriefTool` | Get a specific brief by ID |
| `PolarisExtractTool` | Extract article content from URLs |
| `PolarisEntityTool` | Look up entity coverage |
| `PolarisTrendingTool` | Get trending entities |
| `PolarisCompareTool` | Compare outlet coverage of a story |
| `PolarisResearchTool` | Deep multi-source research (5 credits) |
| `PolarisVerifyTool` | Fact-check a claim against briefs (3 credits) |

All tools accept `api_key` in the constructor. If omitted, the SDK reads from `POLARIS_API_KEY` or `~/.polaris/credentials`.

## License

MIT
