import express from "express"
const app = express()
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import commentRoutes from "./routes/comments.js"
import { middleware } from "./helpers/helpers.js"



app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth/", authRoutes)
app.use("/api/users/", userRoutes)
app.use("/api/posts/", postRoutes)
app.use("/api/comments/", commentRoutes)



app.get("/", middleware, (req, res) => {
    return res.status(200).send("Blog API service is up and running...")
    });



app.listen(4000, ()=>{
    console.log("Port open at 4000")
})