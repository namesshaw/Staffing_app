import express from "express"
import { Request, Response} from "express"
import jwt from "jsonwebtoken"
import zod from "zod"
import { usersinsupauth } from "../middleware/sinsupauth"
import dotenv from "dotenv"
dotenv.config()

import prismaClient from "../db/db"
const router=express.Router()

const USER_BODY = zod.object({
  name:     zod.string(),
  email:    zod.string().email(),
  company:  zod.string(),
  password: zod.string(),
  phone:    zod.string(),
  rating:   zod.number().multipleOf(0.01)

})
const SIGNINBODY = zod.object({
    email: zod.string().email(),
    password: zod.string()
})
router.post("/signup", async (req: Request, res: Response) => {
    const parseduser = USER_BODY.safeParse(req.body);
  
    if (!parseduser.success) {
      return void res.status(400).json({ error: "Invalid user data" });
    }
  
    try {
      const user = await prismaClient.user.create({
        data: {
          name: parseduser.data.name,
          email: parseduser.data.email,
          company: parseduser.data.company,
          password: parseduser.data.password,
          phone: parseduser.data.phone,
          rating: parseduser.data.rating,
          
        },
      });
  
      const token = jwt.sign({
        userId: user.id
      }, 
      //@ts-ignore
      process.env.JWT_SECRET)
      return void res.status(200).json({
        token:token
      })
    } catch (error) {
      return void res.status(500).json({ error: "Internal Server Error" });
    }
  })
  router.post("/signin", async(req: Request, res: Response)=>{
    const parsedsignin = SIGNINBODY.safeParse(req.body)
    if(!parsedsignin.success){
        return void res.status(400).json({
            error: "Inputs format not correct should be handled in frontend itself"
        })
    }
    const user = await prismaClient.user.findFirst({
        where:{
            email: parsedsignin.data.email
        }
    })
    if(!user){

        return void res.status(400).json({
            error: "You are not signedup yet"
        })

    }
     if(user.password === parsedsignin.data.password){
        const token = jwt.sign({
            userId: user.id
        }
        //@ts-ignore
    , process.env.JWT_SECRET
    )
    return void res.status(200).json({
        token: token
    })
     }
     return void res.status(400).json({
        error: "Please check your email or password"
     })
  })

  
export default router