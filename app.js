const express = require("express")
const sqlite = require("sqlite3").verbose()
const app = express()
const db = new sqlite.Database("test.db", (err)=>{
    if(err) return console.log("db failed to connect " + err)
    console.log("db connected succ****")
})
const query = "CREATE TABLE IF NOT EXISTS quote(ID INTEGER PRIMARY KEY, movie, quote, character)"
db.run(query, (err, data)=>{
    if(err) return console.log("something went wrong" + err)
})


app.use(express.json())

const middleware = (req, res, next) => {
    console.log(`Route: ${req.method} ${req.originalUrl}`);
    next()
}


app.get("/", middleware, (req, res) => {
    return res.status(200).send("Blog API service is up and running...")
  });

app.get("/quote", middleware, (req, res) => {
    try {
      const query = `SELECT * FROM quote`
      db.all(query, (err, data) => {
        if (err) return res.status(500).send("error with the db " + err)
        if (data.length < 1) return res.status(200).send("No match found!!!")
        return res.status(200).send(data)
      })
    } catch (error) {
      return res.status(500).send("something went wrong")
    }
  });
  


app.post("/quote", middleware, (req, res)=>{
    try {
        const {movie, quote, character} = req.body

        const query = `INSERT INTO quote(movie, quote, character) VALUES(?,?,?)`
        db.all(query,[movie, quote, character], (err, data)=>{
            if(err) return res.status(500).send("Couldn't save data")
            return res.status(200).send("new record added")
        })
    } catch (error) {
        return res.status(500).send("sorry something went wrong")
    }
})


app.listen(4000, ()=>{
    console.log("Port open at 4000")
})