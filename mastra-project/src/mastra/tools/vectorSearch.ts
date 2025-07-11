// src/mastra/tools/vectorSearch.ts

import { createTool, ToolExecutionContext } from "@mastra/core";
import { PgVector } from "@mastra/pg";
import { z } from "zod";
import { embed } from "ai";
import { openai } from "@ai-sdk/openai";
import dotenv from "dotenv";

dotenv.config();

// Define schema
const inputSchema = z.object({
  query: z.string(),
});

const outputSchema = z.object({
  results: z.array(z.string()),
});

// Setup vector store
const vectorStore = new PgVector({
  connectionString: process.env.DATABASE_URL!,
});

// Export tool
export const vector_search = createTool({
  id: "vector_search",
  description: "Search Berkshire Hathaway letters using semantic vector search",
  inputSchema,
  outputSchema,

  // This is the correct signature Mastra expects
  async execute(context: ToolExecutionContext<typeof inputSchema>) {
    const { query } = context.parsedInput;

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
  },
});
