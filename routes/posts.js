import express from "express"
import { addPost, getPosts } from "../controllers/posts.js"
import { middleware } from "../helpers/middleware.js"
const router = express.Router()


router.get("/posts", middleware, getPosts)
router.post("/post", middleware, addPost)

export default router;