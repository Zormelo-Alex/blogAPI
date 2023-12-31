import { db } from "../database.js"

const query = "CREATE TABLE IF NOT EXISTS posts(ID INTEGER PRIMARY KEY, title, content, createDate, userID, pictureURL)"
db.run(query, (err)=>{
    if(err) return console.log("something went wrong" + err)
})


export const getPosts = (req, res) => {
    try {
        const query = `SELECT p.ID, p.title, p.content, p.createDate, p.userID, p.pictureURL, u.username, u.pictureURL AS profilePicture
        FROM posts p
        JOIN users u ON u.ID = p.userID`

        db.all(query, (err, data) => {
          if (err) return res.status(500).send("error with the db " + err)
          if (data.length < 1) return res.status(200).send("No match found!!!")
          return res.status(200).send(data)
        })
      } catch (error) {
        return res.status(500).send("something went wrong " + error)
      }
}

export const getRecentPosts = (req, res) => {
    try {
        const query = `SELECT p.ID, p.title, p.content, p.createDate, p.userID, p.pictureURL, u.username, u.pictureURL AS profilePicture
        FROM posts p
        JOIN users u ON u.ID = p.userID
        ORDER BY p.createDate DESC
        LIMIT 1;`
        

        db.all(query, (err, data) => {
          if (err) return res.status(500).send("error with the db " + err)
          if (data.length < 1) return res.status(200).send("No match found!!!")
        //   console.log(data)
          return res.status(200).send(data)
        })
      } catch (error) {
        return res.status(500).send("something went wrong " + error)
      }
}

export const getPost = (req, res)=>{
    try {
        const postid = req.params.id
        const query = `SELECT p.ID, p.title, p.content, p.createDate, p.userID, p.pictureURL, u.username, u.pictureURL AS profilePicture
        FROM posts p 
        JOIN users u ON u.ID = p.userID
        WHERE p.ID = ${postid}`

        const comments = `SELECT c.ID, c.comment, c.uid, u.username, u.pictureURL AS profilePicture
        FROM comments c 
        JOIN users u ON u.ID = c.uid
        WHERE postId = "${postid}"`

        
        db.all(query, (err, data)=>{
            if(err) return res.status(500).send("error with the db " + err)
            if (!data[0].ID) return res.status(200).send("No match found!!!")
            db.all(comments, (err, postComments)=> {
                if(err) return res.status(500).send("error with the db " + err)
                return res.status(200).send({post:data[0], postcomments: postComments})
            })
        })
    } catch (error) {
        return res.status(500).send("something went wrong " + error)
    }
}

export const addPost = (req, res) => {
    try {
        let pictureURL = null
        if(req.file){
            pictureURL = req.file.filename
        }
        const user = req.user.user

        const findQuery = `SELECT * FROM users WHERE ID = "${user.id}"`


        db.all(findQuery, (err, dbuser)=>{
            if(err) return res.status(500).send("error with the db " + err)
            if (dbuser.length < 1) return res.status(500).send("user not found")
            const {title, content} = req.body
            if(!title || !content) return res.status(400).send("All fields are required!!!")
            const date = new Date()
    
            const query = `INSERT INTO posts( title, content, createDate, userID, pictureURL) VALUES(?,?,?,?,?)`
            db.all(query,[title, content, date, dbuser[0].ID, pictureURL], (err, data)=>{
                if(err) return res.status(500).send("Couldn't save data")
                return res.status(200).send("new record added")
            })
        })
    } catch (error) {
        return res.status(500).send("sorry something went wrong " + error)
    }
}

export const updatePost = (req, res) => {
    try {
        const postid = req.params.id
        let pictureURL = null
        if(req.file){
            pictureURL = req.file.filename
        }
        const user = req.user.user

        const findQuery = `SELECT * FROM users WHERE ID = "${user.id}"`

        db.all(findQuery, (err, dbuser)=>{
            if(err) return res.status(500).send("error with the db " + err)
            if (dbuser.length < 1) return res.status(500).send("user not found")
            const {title, content} = req.body
            if(!title || !content) return res.status(400).send("All fields are required!!!")
            const date = new Date()
            dbuser = dbuser[0]
            
            const findPost = `SELECT * FROM posts WHERE ID = ${postid}`

            db.all(findPost, (err, post)=>{
                if(err) return res.status(500).send("error with the db " + err)
                if (post.length < 1) return res.status(500).send("post not found")
                post = post[0]
                if(dbuser.ID != post.userID) return res.status(400).send("Access denied!")

                const updateQuery = "UPDATE posts SET title = ?, content = ?, pictureURL = ?, createDate = ?  WHERE ID = ?"

                const values = [title, content, pictureURL, date]
                db.all(updateQuery,[...values, postid], (err, data)=>{
                    if(err) return res.status(500).send("update failed" + err)
                    return res.status(200).send("post updated!")
                })
            })
        })
    } catch (error) {
        return res.status(500).send("sorry something went wrong " + error)
    }
}

export const deletePost = (req, res) => {
    try {
        const postid = req.params.id
        const user = req.user.user

        const findQuery = `SELECT * FROM users WHERE ID = "${user.id}"`

        db.all(findQuery, (err, dbuser)=>{
            if(err) return res.status(500).send("error with the db " + err)
            if (dbuser.length < 1) return res.status(500).send("user not found")
            dbuser = dbuser[0]
            
            const findPost = `SELECT * FROM posts WHERE ID = ${postid}`

            db.all(findPost, (err, post)=>{
                if(err) return res.status(500).send("error with the db " + err)
                if (post.length < 1) return res.status(500).send("post not found")
                post = post[0]
                if(dbuser.ID != post.userID) return res.status(400).send("Access denied!")

                const deleteQuery = `DELETE FROM posts WHERE ID = ${postid}`

                db.all(deleteQuery,(err, data)=>{
                    if(err) return res.status(500).send("failed to delete" + err)
                    return res.status(200).send("post deleted!")
                })
            })
        })
    } catch (error) {
        return res.status(500).send("sorry something went wrong " + error)
    }
}
