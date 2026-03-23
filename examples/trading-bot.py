"""Build a Trading Bot in 5 Minutes

Uses Polaris to find oversold stocks, score them, set alerts,
and backtest the strategy — all with news-driven intelligence.
"""
from polaris_news import PolarisClient

client = PolarisClient(api_key="your_key")

# 1. Find oversold stocks using natural language
results = client.screener_natural("oversold tech stocks with upcoming earnings")
print(f"Found {len(results['results'])} candidates")

for stock in results["results"][:3]:
    ticker = stock["ticker"]
    print(f"\n{'='*40}")
    print(f"{ticker} — {stock.get('name', '')}")

    # 2. Get composite trading score
    score = client.ticker_score(ticker)
    print(f"Signal: {score.get('signal')} (score: {score.get('composite_score')})")

    # 3. Check news impact
    impact = client.news_impact(ticker)
    print(f"News impact events: {len(impact.get('impacts', []))}")

# 4. Set an alert for the top pick
top_pick = results["results"][0]["ticker"]
alert = client.create_alert(
    ticker=top_pick,
    alert_type="sentiment_above",
    threshold=0.5,
)
print(f"\nAlert set for {top_pick}: {alert.get('id')}")

# 5. Backtest the strategy
backtest = client.backtest(
    strategy={
        "entry_filters": {"rsi_below": 30, "sentiment_above": 0.2},
        "exit_filters": {"rsi_above": 50},
        "asset_type": "equity",
        "sector": "Technology",
    },
    period="1y",
)
perf = backtest.get("performance", {})
print(f"\nBacktest: {perf.get('total_return_pct')}% return, "
      f"{perf.get('win_rate')}% win rate, "
      f"Sharpe {perf.get('sharpe_ratio')}")
