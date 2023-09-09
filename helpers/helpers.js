import bcrypt from "bcrypt"
const saltRounds = 10

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