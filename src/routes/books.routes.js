import express from "express";
import protectRoute from "../middlewares/auth.middleware.js";
import { createbook, deleteBook, getBooks, getRecommendedBooks } from "../controllers/book.controller.js";

const router = express.Router();

router.post("/", protectRoute, createbook);
router.get("/", getBooks);
router.get("/user", protectRoute, getRecommendedBooks);
router.delete("/:id", protectRoute, deleteBook);

export default router;