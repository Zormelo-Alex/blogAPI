import express from "express"
import { authenticateToken, middleware } from "../helpers/helpers.js";
import { addComment, deleteComment, getAllComments } from "../controllers/comments.js";
const router = express.Router()

router.get("/allComments", middleware, authenticateToken, getAllComments)
router.post("/", middleware, authenticateToken, addComment)
router.post("/delete/:id", middleware, authenticateToken, deleteComment)

export default router;