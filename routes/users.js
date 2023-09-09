import express from "express"
const router = express.Router()
import { middleware } from "../helpers/helpers.js"
import { deleteUser, getUser, getUsers, updateUser } from "../controllers/users.js"
import multer from "multer"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)+ '-' + file.originalname.slice(0, 5)+".png"
        //name of file
        cb(null, uniqueSuffix)
    }
})
const upload = multer({ storage: storage })

router.get("/", middleware, getUsers)
router.get("/:id", middleware, getUser)
router.put("/:id", middleware, upload.single('image'), updateUser)
router.post("/delete/:id", middleware, deleteUser)

export default router