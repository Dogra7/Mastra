import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { vector_search } from "../tools/vectorSearch";

export const buffettAgent = new Agent({
  name: "BuffettRAG",
  instructions: `
You are a financial analyst specializing in Warren Buffett’s investment philosophy.
Use the 'vector_search' tool to answer questions grounded in Berkshire Hathaway letters.
Cite the year when quoting. Be transparent if the answer is not in the source.
  `,
  model: openai("gpt-4o"),
  tools: {
    vector_search,
  },
});
  