import express from "express"
import sqlite  from "sqlite3"
const app = express()
import postRoute from "./routes/posts.js"
import { middleware } from "./helpers/middleware.js"

export const db = new sqlite.Database("test.db", (err)=>{
    if(err) return console.log("db failed to connect " + err)
    console.log("db connected succ****")
})
const query = "CREATE TABLE IF NOT EXISTS quote(ID INTEGER PRIMARY KEY, movie, quote, character)"
db.run(query, (err, data)=>{
    if(err) return console.log("something went wrong" + err)
})


app.use(express.json())
app.use("/", postRoute)



app.get("/", middleware, (req, res) => {
    return res.status(200).send("Blog API service is up and running...")
    });



app.listen(4000, ()=>{
    console.log("Port open at 4000")
})