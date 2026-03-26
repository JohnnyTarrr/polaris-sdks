import { tool } from "ai";
import { z } from "zod";
import { polarisGet, type ToolOptions } from "./_fetch.js";

export const polarisDefiProtocol = (options: ToolOptions = {}) =>
  tool({
    description:
      "Get detailed data for a specific DeFi protocol — includes TVL history, chain breakdown, token info, and protocol metrics.",
    parameters: z.object({
      protocol: z
        .string()
        .describe("DeFi protocol slug (e.g. aave, uniswap, lido)"),
    }),
    execute: async ({ protocol }) => {
      const path = `/api/v1/crypto/defi/${encodeURIComponent(protocol.toLowerCase())}`;
      return polarisGet(options, path);
    },
  });
