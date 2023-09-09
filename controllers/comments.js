import { db } from "../database.js"

const query = "CREATE TABLE IF NOT EXISTS comments(ID INTEGER PRIMARY KEY, comment, uid, createDate, postId)"
db.run(query, (err)=>{
    if(err) return console.log("something went wrong" + err)
})


export const getAllComments = (req, res) => {
    try {
        const query = `SELECT * FROM comments`

        db.all(query, (err, data)=>{
            if(err) return res.status(500).send("error "+ err)
            if(data.length < 1) return res.status(400).send("No match")
            return res.status(200).send(data)
        })
    } catch (error) {
        return res.status(500).send("sorry something went wrong")
    }
}

export const addComment = (req, res) => {
    try {
        const { post, uid } = req.query
        const {comment} = req.body
        if(!comment || !post || !uid) return res.status(400).send("invalid comment")

        const date = new Date()
        const postCheck = `SELECT * FROM posts WHERE ID = ${post}`
        const query = `INSERT INTO comments(comment, uid, createDate, postId) VALUES(?,?,?,?)`
        
        db.all(postCheck, (err, post)=>{
            if(err) return res.status(500).send("error "+ err)
            if(post.length < 1) return res.status(400).send("sorry post doesn't exist")
            
            db.all(query, [comment, uid, date, post], (err, data)=>{
                if(err) return res.status(500).send("error "+ err)
                res.status(200).send("comment added succesfully")
            })
        })
    } catch (error) {
        return res.status(500).send("sorry something went wrong" + error)
    }
}