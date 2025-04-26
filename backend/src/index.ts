import  prismaClient  from "./db/db.js"
import express from "express"
const app = express()
import cors from "cors" 

import mainrouter from "./routes"
app.use(cors())
app.use(express.json())
app.use("/api/v1", mainrouter)
app.listen(3000, ()=>{ 
    console.log("Listening on port 3000")
})