import { tool } from "ai";
import { z } from "zod";
import { polarisGet, type ToolOptions } from "./_fetch.js";

export const polarisMarketMovers = (options: ToolOptions = {}) =>
  tool({
    description:
      "Get top market movers — gainers, losers, and most active stocks by volume. Useful for a quick snapshot of what is moving in the market right now.",
    parameters: z.object({}),
    execute: async () => {
      return polarisGet(options, "/api/v1/market/movers");
    },
  });
