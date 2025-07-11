import { Mastra } from '@mastra/core/mastra';
import { PgVector } from '@mastra/pg';
import { buffettAgent } from './agents/buffettAgent';

const pgVector = new PgVector({
  connectionString: process.env.DATABASE_URL!,
});

export const mastra = new Mastra({
  agents: { buffettAgent },
  vectors: { pgVector }, // 👈 this is CRUCIAL
});
