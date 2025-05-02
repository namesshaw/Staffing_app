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
router.get("/logout", async(req, res)=>{
    res.clearCookie('token', { httpOnly: true, secure: false, path: '/' });
    res.clearCookie('role', { httpOnly: true, secure: false, path: '/' });
  
    res.status(200).json({ message: 'Logged out successfully' });
})
router.get("/chatroom/:roomId", async(req, res)=>{
    const roomId = req.params.roomId;
    try{
      const chats = await prismaClient.chat.findMany({
        where : {room_id : roomId}
      });
    //   console.log(chats)
      return void res.status(200).json(chats)
      
    }catch(e){
      console.log(e);
      return void res.status(511).json({
          message: "Couldnt get the chats"
      })
    }
})




export default router