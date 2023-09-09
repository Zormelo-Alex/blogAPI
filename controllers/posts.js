import { db } from "../database.js"

const query = "CREATE TABLE IF NOT EXISTS posts(ID INTEGER PRIMARY KEY, title, content, createDate, userID, pictureURL)"
db.run(query, (err)=>{
    if(err) return console.log("something went wrong" + err)
})


export const getPosts = (req, res) => {
    try {
        const query = `SELECT * FROM posts`
        db.all(query, (err, data) => {
          if (err) return res.status(500).send("error with the db " + err)
          if (data.length < 1) return res.status(200).send("No match found!!!")
          return res.status(200).send(data)
        })
      } catch (error) {
        return res.status(500).send("something went wrong")
      }
}

export const addPost = (req, res) => {
    try {
        let pictureURL = null
        if(req.file){
            pictureURL = req.file.filename
        }
        const user = req.params.uid
        const {title, content} = req.body
        if(!title || !content) return res.status(400).send("All fields are required!!!")
        const date = new Date()
 
        const query = `INSERT INTO posts( title, content, createDate, userID, pictureURL) VALUES(?,?,?,?,?)`
        db.all(query,[title, content, date, user, pictureURL], (err, data)=>{
            if(err) return res.status(500).send("Couldn't save data")
            return res.status(200).send("new record added")
        })
    } catch (error) {
        return res.status(500).send("sorry something went wrong")
    }
}
