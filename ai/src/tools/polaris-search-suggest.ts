import { tool } from "ai";
import { z } from "zod";
import { polarisGet, type ToolOptions } from "./_fetch.js";

export const polarisSearchSuggest = (options: ToolOptions = {}) =>
  tool({
    description:
      "Get search autocomplete suggestions — returns matching topics, tickers, and entities as the user types a query.",
    parameters: z.object({
      q: z
        .string()
        .describe("Partial search query to get suggestions for"),
    }),
    execute: async ({ q }) => {
      return polarisGet(options, "/api/v1/search/suggest", { q });
    },
  });
