import { db } from "../database.js"
import { comparePassword } from "../helpers/helpers.js"
const query = "CREATE TABLE IF NOT EXISTS users(ID INTEGER PRIMARY KEY, username, password, email, pictureURL, createDate, DOB)"
db.run(query, (err)=>{
    if(err) return console.log("something went wrong" + err)
})

export const getUsers = (req, res) => {
    try {
        const query = `SELECT * FROM users`
        db.all(query, (err, data)=>{
            if(err) return res.status(500).send("error " + err)
            if(data.length < 1) return res.status(400).send("no match")
            return res.status(200).send(data)
        })
    } catch (error) {
        return error
    }
}

export const getUser = (req, res) => {
    try {
        const id = req.params.id
        const query = `SELECT * FROM users WHERE ID = ${id}`
        db.all(query, (err, data)=>{
            if(err) return res.status(500).send("error " + err)
            if(data.length < 1) return res.status(400).send("user not found")
            return res.status(200).send(data[0])
        })
    } catch (error) {
        return error
    }
}

export const updateUser = (req, res) => {
    try {
        let pictureURL
        let values
        let update

        if(req.file){
            pictureURL = req.file.filename
        }
        let {username, email, DOB} = req.body

        if(!username || !email ) return res.status(400).send("Invalid details")

        const user = req.user.user

        const findQuery = `SELECT * FROM users WHERE ID = "${user.id}"`

        db.all(findQuery, (err, dbuser)=>{
            if(err) return res.status(500).send("error with the db " + err)
            if (dbuser.length < 1) return res.status(500).send("user not found")
            dbuser = dbuser[0]

            const query = `SELECT * FROM users WHERE ID = ${user.id}`
            db.all(query, async(err, user)=>{
                if(err) return res.status(500).send("error " + err)
                if(user.length < 1) return res.status(400).send("user not found")
                user = user[0]
                if(dbuser.ID != user.ID) return res.status(400).send("Access denied!")

                DOB ? DOB = DOB : DOB = null

                if(req.file){
                    update = "UPDATE users SET username = ?, email = ?, pictureURL = ?, DOB = ?  WHERE ID = ?"
                    values = [username, email, pictureURL, DOB]
                }else{
                    update = "UPDATE users SET username = ?, email = ?, DOB = ?  WHERE ID = ?"
                    values = [username, email, DOB]
                }

                // console.log(values)

                db.all(update, [...values, user.ID], (err, data)=>{
                    if(err) return res.status(500).send("error " + err)
                    return res.status(200).send("user updated successfully")
                })
            })
        })
    } catch (error) {
        return error
    }
}

export const deleteUser = (req, res) => {
    try {
        const id = req.params.id
        if(!id) return res.status(400).send("Invalid details")

        const user = req.user.user

        const findQuery = `SELECT * FROM users WHERE ID = "${user.id}"`

        db.all(findQuery, (err, dbuser)=>{
            if(err) return res.status(500).send("error with the db " + err)
            console.log(dbuser)
            if (dbuser.length < 1) return res.status(500).send("user not found")
            dbuser = dbuser[0]

            const query = `SELECT * FROM users WHERE ID = ${id}`
            db.all(query, async(err, user)=>{
                if(err) return res.status(500).send("error " + err)
                console.log(user)
                if(user.length < 1) return res.status(400).send("user not found")
                user = user[0]

                if(dbuser.ID != user.ID) return res.status(400).send("Access denied!")

                const deleteQuery = `DELETE FROM users WHERE ID = ${id}`

                db.all(deleteQuery, (err, data)=>{
                    if(err) return res.status(500).send("error " + err)
                    return res.status(200).send("user deleted successfully")
                })
            })
        })
    } catch (error) {
        return error
    }
}