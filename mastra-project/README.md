mastra-project/
├── data/
│   └── pdfs/
├── scripts/
│   └── ingest-docs.ts
├── src/
│   └── index.ts (main app entry point)
├── .env
├── package.json
└── README.md



took 2 hours to solve the pdfparce error which was redirecting the pdf path to predefined pdf's in test folder inside pdf-parse package........It was occuring due to the predefined debug code inside /pdf-parse/index.js....Commenting-out that code worked for me.


testAgent is working fine....i.e. vectorSearch is working. But for some reason there is error parsing query using buffetAgent on playground