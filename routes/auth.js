import express from "express"
import { middleware } from "../helpers/helpers.js"
import { signIn, signUp } from "../controllers/auth.js"
const router = express.Router()



router.post("/signUp", middleware, signUp)
router.post("/signIn", middleware, signIn)

export default router