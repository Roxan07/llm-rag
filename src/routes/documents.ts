import { Router } from "express";
import multer from "multer";
import fs from "fs";
import pdfParse from "pdf-parse";
import { z } from "zod";
import { embedAndStore } from "../services/rag";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("documents"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    let text = "";

    // Support PDF and text files. Fall back to file extension checks where needed.
    if (
      req.file.mimetype === "application/pdf" ||
      req.file.originalname.toLowerCase().endsWith(".pdf")
    ) {
      // Read file buffer and extract text
      const dataBuffer = fs.readFileSync(filePath);
      try {
        const data = await pdfParse(dataBuffer as any);
        text = data.text || "";
      } catch (pdfErr) {
        console.error("PDF parse error:", pdfErr);
        // Clean up uploaded file before returning
        await fs.promises.unlink(filePath).catch(() => {});
        return res
          .status(400)
          .json({ error: "Failed to extract text from PDF" });
      }
    } else if (
      req.file.mimetype === "text/plain" ||
      req.file.originalname.toLowerCase().endsWith(".txt")
    ) {
      text = fs.readFileSync(filePath, "utf-8");
    } else {
      // Unsupported file type
      await fs.promises.unlink(filePath).catch(() => {});
      return res.status(400).json({ error: "Unsupported file type" });
    }

    // Validate that we have text content
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return res
        .status(400)
        .json({ error: "No readable text content found in the file" });
    }

    // Clean up uploaded file
    await fs.promises.unlink(filePath);

    // Process and store the document
    try {
      await embedAndStore(text, req.file.originalname);
      res.json({ message: "Document uploaded and processed successfully" });
    } catch (embedError) {
      console.error("Error in embedAndStore:", embedError);
      return res
        .status(500)
        .json({ error: "Failed to process and store document" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process document" });
  }
});

export { router as documentsRouter };
