import express from "express";
import cors from "cors";
import { documentsRouter } from "./routes/documents";
import { queryRouter } from "./routes/query";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// serve static files from public directory
app.use(express.static("public"));

// Routes
app.use("/api/documents", documentsRouter);
app.use("/api/query", queryRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
