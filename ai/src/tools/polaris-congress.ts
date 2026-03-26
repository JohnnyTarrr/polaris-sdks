import { tool } from "ai";
import { z } from "zod";
import { polarisGet, type ToolOptions } from "./_fetch.js";

export const polarisCongress = (options: ToolOptions = {}) =>
  tool({
    description:
      "Get recent stock trades disclosed by U.S. Congress members. Optionally filter by a specific ticker symbol.",
    parameters: z.object({
      symbol: z
        .string()
        .optional()
        .describe("Ticker symbol to filter trades (e.g. NVDA). Omit for all recent congressional trades."),
    }),
    execute: async ({ symbol }) => {
      return polarisGet(options, "/api/v1/congress/trades", {
        symbol: symbol ? symbol.toUpperCase() : undefined,
      });
    },
  });
