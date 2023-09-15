import express from "express"
const router = express.Router()
import { addPost, deletePost, getPost, getPosts, updatePost } from "../controllers/posts.js"
import { authenticateToken, middleware } from "../helpers/helpers.js"
import multer from "multer"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)+ '-' + file.originalname.slice(0, 1)+".png"
        //name of file
        cb(null, uniqueSuffix)
    }
})
const upload = multer({ storage: storage })


router.get("/", middleware, authenticateToken, getPosts)
router.get("/:id", middleware, authenticateToken, getPost)
router.post("/create", middleware, authenticateToken, upload.single('image'), addPost)
router.put("/update/:id", middleware, authenticateToken, upload.single('image'), updatePost)
router.post("/delete/:id", middleware, authenticateToken, deletePost)

export default router;