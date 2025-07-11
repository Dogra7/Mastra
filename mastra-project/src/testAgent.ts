// import { vector_search } from "./mastra/tools/vectorSearch";

// async function testTool() {
//   const result = await vector_search.execute({
//     parsedInput: { query: "Warren Buffett on diversification" },
//     config: {},
//     resources: {},
//     threadId: "test-thread",
//     runId: "test-run"
//   });

// console.log("✅ Tool Response:\n", JSON.stringify(result, null, 2));
// }

// testTool();

import { vector_search } from "./mastra/tools/vectorSearch";

async function testTool() {
  const result = await vector_search.execute({
    parsedInput: { query: "Warren Buffett on diversification" },
    config: {},
    resources: {},
    threadId: "test-thread",
    runId: "test-run"
  });

  console.log("✅ Tool Response:\n", JSON.stringify(result, null, 2));
}

testTool();






