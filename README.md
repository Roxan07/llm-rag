# LLM RAG System

A Retrieval-Augmented Generation (RAG) system that allows users to upload documents (text/PDF) and query them for synthesized answers using LLM.

## Features

- Document ingestion (PDF and text files)
- Vector embeddings for retrieval
- LLM-based answer synthesis
- Simple web interface
- REST API

## Tech Stack

- TypeScript
- Bun
- Express
- Groq API (for LLM)
- @xenova/transformers (for local embeddings)
- Zod (validation)
- Multer (file uploads)

## Setup

1. Clone the repository
2. Install dependencies: `bun install`
3. Set up environment variables in `.env`:
   - `GROQ_API_KEY`: Your Groq API key
4. Build the project: `bun run build`
5. Start the server: `bun run start`

The server will run on port 3000. Open `http://localhost:3000` in your browser for the web interface.

## API Endpoints

- `POST /api/documents/upload`: Upload a document (form-data with 'document' field)
- `POST /api/query`: Query the system (JSON with 'query' field)

## Usage

1. Upload documents using the web interface or API
2. Ask questions about the uploaded content
3. Receive synthesized answers based on the documents

## Demo

[Add demo video link here]
