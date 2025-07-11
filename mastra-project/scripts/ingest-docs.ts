import fs from "fs";
import path from "path";
// Fix for ESM import issue with pdf-parse
import pdfParse from "pdf-parse";


import { MDocument } from "@mastra/rag";
import { PgVector } from "@mastra/pg";
import { embedMany } from "ai";
import { openai } from "@ai-sdk/openai";
import dotenv from "dotenv";

dotenv.config();

const PDF_DIR = path.resolve("D:/Mastra/mastra-project/data/pdfs");

async function parsePDF(fp: string): Promise<string> {
  console.log(`📄 Parsing PDF: ${fp}`);
  const buf = fs.readFileSync(fp);
  const parsed = await pdfParse(buf);

  if (!parsed.text || parsed.text.trim().length < 100) {
    console.warn(`⚠️ Skipping '${fp}' — no readable text found.`);
    return "";
  }

  return parsed.text;
}

async function ingest() {
  if (!fs.existsSync(PDF_DIR)) {
    console.error(`❌ PDF directory not found: ${PDF_DIR}`);
    return;
  }

  const files = fs.readdirSync(PDF_DIR).filter(f => f.endsWith(".pdf"));

  if (files.length === 0) {
    console.warn(`⚠️ No PDF files found in: ${PDF_DIR}`);
    return;
  }

  const pg = new PgVector({ connectionString: process.env.DATABASE_URL! });

  console.log(`📚 Creating vector index 'berkshire_letters'...`);
  await pg.createIndex({ indexName: "berkshire_letters", dimension: 1536 });

  for (const file of files) {
    const filePath = path.join(PDF_DIR, file);
    console.log(`\n📥 Processing: ${filePath}`);

    const year = path.basename(file, ".pdf");
    const text = await parsePDF(filePath);
    if (!text) continue;

    const doc = MDocument.fromText(text, { year });
    const chunks = await doc.chunk({ strategy: "recursive", size: 512, overlap: 50 });
    const texts = chunks.map(c => c.text);

    console.log(`🧠 Generating embeddings for ${texts.length} chunks...`);
    const { embeddings } = await embedMany({
      values: texts,
      model: openai.embedding("text-embedding-3-small"),
    });

    await pg.upsert({
      indexName: "berkshire_letters",
      vectors: embeddings,
      metadata: chunks.map(c => ({ year: c.metadata?.year })),
    });

    console.log(`✅ Ingested ${file} (${chunks.length} chunks)`);
  }

  console.log(`\n🎉 All PDFs ingested successfully.`);
}

ingest().catch(err => {
  console.error("❌ Ingestion failed:", err);
});
