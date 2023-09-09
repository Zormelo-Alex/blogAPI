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
        let pictureURL = null
        if(req.file){
            pictureURL = req.file.filename
        }
        let {username, password, email, DOB} = req.body
        const id = req.params.id

        if(!username || !password || !email || !id) return res.status(400).send("Invalid details")

        const query = `SELECT * FROM users WHERE ID = ${id}`
        db.all(query, async(err, user)=>{
            if(err) return res.status(500).send("error " + err)
            if(user.length < 1) return res.status(400).send("user not found")
            user = user[0]
            const authenticate = await comparePassword(password, user.password)
            if(!authenticate) return res.status(400).send("Access denied")
            DOB ? DOB = DOB : DOB = null

            const update = "UPDATE users SET username = ?, email = ?, pictureURL = ?, DOB = ?  WHERE ID = ?"
            const values = [username, email, pictureURL, DOB]

            db.all(update, [...values, id], (err, data)=>{
                if(err) return res.status(500).send("error " + err)
                return res.status(200).send("user updated successfully")
            })
        })
    } catch (error) {
        return error
    }
}

export const deleteUser = (req, res) => {
    try {
        const id = req.params.id
        const {password} = req.body
        if(!password || !id) return res.status(400).send("Invalid details")

        const query = `SELECT * FROM users WHERE ID = ${id}`
        db.all(query, async(err, user)=>{
            if(err) return res.status(500).send("error " + err)
            if(user.length < 1) return res.status(400).send("user not found")
            user = user[0]
            const authenticate = await comparePassword(password, user.password)
            if(!authenticate) return res.status(400).send("Access denied")

            const update = `DELETE FROM users WHERE ID = ${id}`

            db.all(update, (err, data)=>{
                if(err) return res.status(500).send("error " + err)
                return res.status(200).send("user deleted successfully")
            })
        })
    } catch (error) {
        return error
    }
}