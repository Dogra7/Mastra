import { createTool } from "@mastra/core";
import { PgVector } from "@mastra/pg";
import { z } from "zod";
import { embed } from "ai";
import { openai } from "@ai-sdk/openai";
import dotenv from "dotenv";

dotenv.config();

const vectorInput = z.object({
  query: z.string(),
});

const vectorOutput = z.object({
  results: z.array(z.string()),
});

const vectorStore = new PgVector({
  connectionString: process.env.DATABASE_URL!,
});

export const vector_search = createTool({
  id: "vector_search",
  description: "Search Berkshire Hathaway letters using semantic vector search",
  inputSchema: z.object({
    query: z.string(),
  }),
  outputSchema: z.object({
    results: z.array(z.string()),
  }),

execute: async (context) => {
  const input = context.parsedInput ?? context.input;

  if (!input || !input.query) {
    throw new Error("Missing 'query' input to vector_search tool.");
  }

  const { query } = input;

  const { embedding } = await embed({
    value: query,
    model: openai.embedding("text-embedding-3-small"),
  });

  const hits = await vectorStore.query({
    indexName: "berkshire_letters",
    queryVector: embedding,
    topK: 5,
  });

  const formatted = hits.map((hit) => {
    const year = hit.metadata?.year ?? "unknown";
    const snippet = (hit.metadata?.text ?? "").slice(0, 300);
    return `(${year}) ${snippet}...`;
  });

  return { results: formatted };
}

});
