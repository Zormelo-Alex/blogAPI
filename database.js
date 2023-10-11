import sqlite  from "sqlite3"

export const db = new sqlite.Database("./test.db", (err)=>{
    if(err) return console.log("db failed to connect " + err)
    console.log("db connected succ****")
})
