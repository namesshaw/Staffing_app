
import  prismaClient  from "./db/db.js"
import express from "express"
const app = express()
const cors = require("cors")
app.use(cors())
app.use(express.json())
prismaClient.$connect()
    .then(() => console.log('Successfully connected to database'))
    .catch((error) => console.error('Error connecting to database:', error))
app.use("/", async(req,res)=>{
    
    const user = await prismaClient.user.findFirst({
        where:{
            name:"ShriangWanikar"
        }
    })
    if (!user){
        console.log("Hello")
    }
})
app.listen(3000, ()=>{
    console.log("Listening on port 3000")
})