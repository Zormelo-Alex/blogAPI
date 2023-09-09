import express from "express"
import { middleware } from "../helpers/helpers.js";
import { addComment, getAllComments } from "../controllers/comments.js";
const router = express.Router()

router.get("/allComments", middleware, getAllComments)
router.post("/", middleware, addComment)

export default router;