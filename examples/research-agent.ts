/**
 * Build a Research Agent in 5 Minutes
 *
 * Uses Polaris to map a competitive landscape, correlate sector
 * movements, and analyze news impact — all from a single API.
 */
import { PolarisClient } from 'polaris-news-api';

const client = new PolarisClient({ apiKey: 'your_key' });

async function researchTicker(symbol: string) {
  console.log(`\nResearching ${symbol}...\n`);

  // 1. Get competitor landscape
  const comp = await client.competitors(symbol);
  const names = (comp.competitors ?? []).map((c: any) => c.ticker).join(', ');
  console.log(`Competitors: ${names}`);

  // 2. Correlate the sector
  const tickers = [symbol, ...(comp.competitors ?? []).slice(0, 4).map((c: any) => c.ticker)];
  const corr = await client.correlation(tickers, { days: 90 });
  console.log(`Correlation matrix (${corr.period_days}d): ${corr.tickers.join(', ')}`);

  // 3. Check news impact
  const impact = await client.newsImpact(symbol);
  console.log(`News impact events: ${(impact.impacts ?? []).length}`);

  // 4. Get composite score
  const score = await client.tickerScore(symbol);
  console.log(`Signal: ${(score as any).signal} (${(score as any).composite_score})`);

  // 5. Screen for related opportunities
  const screen = await client.screenerNatural(`strong momentum ${(comp as any).sector ?? 'tech'} stocks`);
  console.log(`\nRelated opportunities: ${screen.results.length} matches`);
  for (const r of screen.results.slice(0, 3)) {
    console.log(`  ${r.ticker} — sentiment: ${r.sentiment_score}`);
  }
}

researchTicker('NVDA');
