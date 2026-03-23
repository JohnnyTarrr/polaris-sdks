"""Crypto Portfolio Monitor

Track a crypto portfolio with real-time sentiment, correlations,
and automated alerts — powered by Polaris intelligence.
"""
from polaris_news import PolarisClient

client = PolarisClient(api_key="your_key")

# Define portfolio
portfolio = ["BTC", "ETH", "SOL", "AVAX", "LINK"]

print("Crypto Portfolio Monitor")
print("=" * 50)

# 1. Get prices and sentiment for each holding
for symbol in portfolio:
    data = client.crypto(symbol)
    price = data.get("price", data.get("current_price", "N/A"))
    change = data.get("change_24h", data.get("price_change_percentage_24h", 0))
    print(f"\n{symbol}: ${price} ({'+' if change and change > 0 else ''}{change}%)")

    # Get news sentiment
    ticker_data = client.ticker(symbol)
    sentiment = ticker_data.get("sentiment_score", "N/A")
    print(f"  Sentiment: {sentiment} | Briefs: {ticker_data.get('briefs_24h', 0)}")

# 2. Correlation matrix
print(f"\n{'=' * 50}")
print("Correlation Analysis (30d)")
corr = client.correlation(portfolio, days=30)
for i, ticker in enumerate(corr.get("tickers", portfolio)):
    row = corr.get("matrix", [[]])[i] if i < len(corr.get("matrix", [])) else []
    vals = " ".join(f"{v:6.2f}" if isinstance(v, (int, float)) else "  N/A " for v in row)
    print(f"  {ticker:>5} {vals}")

# 3. Set alerts for major moves
for symbol in portfolio[:3]:
    client.create_alert(
        ticker=symbol,
        alert_type="sentiment_below",
        threshold=-0.3,
    )
print(f"\nAlerts set for {', '.join(portfolio[:3])}")

# 4. Check recent triggers
triggered = client.triggered_alerts(limit=5)
alerts = triggered.get("alerts", [])
if alerts:
    print(f"\nRecent alerts ({len(alerts)}):")
    for a in alerts:
        print(f"  {a.get('ticker')} — {a.get('alert_type')} @ {a.get('triggered_at')}")
