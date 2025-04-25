import  prismaClient  from "./db/db.js"
import express from "express"
const app = express()
const cors = require("cors")
import mainrouter from "./routes/index.js"
app.use(cors())
app.use(express.json())
app.use("/api/v1", mainrouter)
app.listen(3000, ()=>{ 
    console.log("Listening on port 3000")
})