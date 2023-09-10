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
        const { post} = req.query
        const {comment} = req.body
        if(!comment || !post) return res.status(400).send("invalid comment")

        const user = req.user.user

        const findQuery = `SELECT * FROM users WHERE ID = "${user.id}"`

        db.all(findQuery, (err, dbuser)=>{
            if(err) return res.status(500).send("error with the db " + err)
            if (dbuser.length < 1) return res.status(500).send("user not found")
            dbuser = dbuser[0]
        
            const date = new Date()
            const postCheck = `SELECT * FROM posts WHERE ID = ${post}`
            const query = `INSERT INTO comments(comment, uid, createDate, postId) VALUES(?,?,?,?)`
            
            db.all(postCheck, (err, dbpost)=>{
                if(err) return res.status(500).send("error "+ err)
                if(dbpost.length < 1) return res.status(400).send("sorry post doesn't exist")
                
                db.all(query, [comment, dbuser.ID, date, post], (err, data)=>{
                    if(err) return res.status(500).send("error "+ err)
                    res.status(200).send("comment added succesfully")
                })
            })
        })
    } catch (error) {
        return res.status(500).send("sorry something went wrong" + error)
    }
}

export const deleteComment = (req, res) => {
    try {
        const commentid = req.params.id
        const user = req.user.user

        const findQuery = `SELECT * FROM users WHERE ID = "${user.id}"`

        db.all(findQuery, (err, dbuser)=>{
            if(err) return res.status(500).send("error with the db " + err)
            if (dbuser.length < 1) return res.status(500).send("user not found")
            dbuser = dbuser[0]

            const query = `SELECT * FROM comments WHERE ID = ${commentid}`

            db.all(query, (err, comment)=>{
                if(err) return res.status(500).send("error with the db " + err)
                if (comment.length < 1) return res.status(500).send("no match")
                comment = comment[0]
                if(dbuser.ID != comment.uid) return res.status(400).send("Access denied!")

                const deleteQuery = `DELETE FROM comments WHERE ID = ${commentid}`

                db.all(deleteQuery,(err, data)=>{
                    if(err) return res.status(500).send("failed to delete" + err)
                    return res.status(200).send("comment deleted!")
                })
            
            })
        })
    } catch (error) {
        return res.status(500).send("sorry something went wrong" + error)
    }
}