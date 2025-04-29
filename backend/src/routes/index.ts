import express from "express"
const router = express.Router()
import clientRouter from "./client"
import dotenv from "dotenv";
dotenv.config();
import devRouter   from "./dev"
import jwt from 'jsonwebtoken'
import prismaClient from "../db/db"

router.use("/client", clientRouter)

router.use("/dev", devRouter)

router.get("/verify", async(req, res) => {
    
    console.log(req.headers.authorization)
    const token = req.headers.authorization;
    if(!token){
        return void res.status(401).json({
            message : "Not authorized"
        })
    }
    try{
        const decoded = jwt.verify(token, //@ts-ignore
        process.env.DEV_JWT_SECRET);
        res.json({
            message : "DEV Verified"
        })
    }catch(e){
        try{
            const user_decoded = jwt.verify(token,//@ts-ignore
                 process.env.USER_JWT_SECRET);
            res.json({
                message : "USER Verified"
            })
        }catch(e){
            console.log(e)
            res.json({
                message : "not Verified"
            })
        }
    }
    
})
export default router