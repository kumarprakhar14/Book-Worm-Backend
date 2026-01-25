import express from "express";
import "dotenv/config";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js"
import bookRoutes from "./routes/books.routes.js"
import { connectDB } from "./lib/db.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes)

app.get('/health', (req, res) => {
    res.json({ status: 200, message: "API is healthy" })
})

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
    connectDB()
})