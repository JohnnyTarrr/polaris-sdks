import { tool } from "ai";
import { z } from "zod";
import { polarisGet, type ToolOptions } from "./_fetch.js";

export const polarisCrypto = (options: ToolOptions = {}) =>
  tool({
    description:
      "Get crypto market data. Without a symbol, returns market overview (total market cap, BTC dominance, etc.). With a symbol (e.g. BTC, ETH, SOL), returns that token's price, volume, and metadata.",
    parameters: z.object({
      symbol: z
        .string()
        .optional()
        .describe("Crypto symbol (e.g. BTC, ETH, SOL). Omit for market overview."),
    }),
    execute: async ({ symbol }) => {
      const path = symbol
        ? `/api/v1/crypto/${encodeURIComponent(symbol.toUpperCase())}`
        : "/api/v1/crypto";
      return polarisGet(options, path);
    },
  });
