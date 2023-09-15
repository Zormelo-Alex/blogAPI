import { db } from "../database.js"
import { comparePassword, generateAccessToken, hashUserPassword } from "../helpers/helpers.js"

const query = "CREATE TABLE IF NOT EXISTS users(ID INTEGER PRIMARY KEY, username, password, email, pictureURL, createDate, DOB)"
db.run(query, (err)=>{
    if(err) return console.log("something went wrong" + err)
})

export const signUp = async(req, res) => {
    try {
        let {username, password, email} = req.body
        const date = new Date()
        if(!username || !password || !email) return res.status(400).send("All fields required!")
        password = await hashUserPassword(password)

        const getQuery = `SELECT * FROM users WHERE email = "${email}"`
        db.all(getQuery, (err, user)=>{
            if(err) return res.status(500).send("something went wrong getting info " + err)
            if(user.length > 0) return res.status(400).send("Sorry user already exists")

            const query =  `INSERT INTO users(username, password, email, pictureURL, createDate, DOB) VALUES (?,?,?,?,?,?)`
        
            db.all(query, [username, password, email, null, date, null], (err, data)=>{
                if(err) return res.status(500).send("couldn't create user " + err)

                db.all(getQuery, async (err, user)=>{
                    if(err) return res.status(500).send("something went wrong getting info " + err)
                    if(user.length < 1) return res.status(400).send("not foubd")
        
                    user = user[0]
        
                    let id = user.ID
                    const token = generateAccessToken({id})

                    return res.status(200).send({
                        message: "user created successfully",
                        signup: true,
                        token: token,
                        user: user
                    })
                })
            })
        })

    } catch (error) {
        return res.status(500).send("something went wrong " + error)
    }
}

export const signIn = (req, res) => {
    try {
        const {email, password} = req.body
        if(!email || !password) return res.status(400).send("All fields required !!")

        const getQuery = `SELECT * FROM users WHERE email = "${email}"`

        db.all(getQuery, async (err, user)=>{
            if(err) return res.status(500).send("something went wrong getting info " + err)
            if(user.length < 1) return res.status(400).send("Wrong email")

            user = user[0]

            const authenticate = await comparePassword(password, user.password)
            if(!authenticate) return res.status(400).send("Wrong password")
            let id = user.ID
            const token = generateAccessToken({id})
            return res.status(200).send({
                message: "user Sign in successful",
                signin: true,
                token: token,
                user: user
            })
        })

    } catch (error) {
        return res.status(500).send("something went wrong " + error)
    }
}

