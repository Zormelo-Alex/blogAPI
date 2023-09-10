import bcrypt from "bcrypt"
const saltRounds = 10
import jwt from "jsonwebtoken";
import env from "dotenv"
env.config()

export const middleware = (req, res, next) => {
    console.log(`Route: ${req.method} ${req.originalUrl}`);
    next()
}

export const hashUserPassword = async (password) => {
   try {
     const hashed = await bcrypt.hash(password, saltRounds)
     return hashed
   } catch (error) {
    return error
   }
}

export const comparePassword = async (password, hash) => {
    try {
        const authenticate = await bcrypt.compare(password, hash)
        return authenticate
    } catch (error) {
        return error
    }
}

export const generateAccessToken = (user) => {
    // console.log(process.env.ACCESS_TOKEN_SECRET)
    // console.log(user)
    return jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET)
} 

export const authenticateToken = (req, res, next) => {
    //getting the token from the header info
    const authorizationHeader = req.headers['authorization']
    //if there's an authorization header info split on the space and store token
    const token = authorizationHeader && authorizationHeader.split(" ")[1]

    //console.log(token)
    if(!token) return res.status(401).send("token not found")
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
        if(err) return res.status(403).send("token verification error")
        //store user object in the req
        req.user = user
        next()
    })
}