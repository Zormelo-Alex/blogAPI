import { db } from "../app.js"


export const getPosts = (req, res) => {
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
}

export const addPost = (req, res) => {
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
}
