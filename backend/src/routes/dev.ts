import express from "express"
import zod, { ParseStatus } from "zod"
import prismaClient from "../db/db"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const router = express.Router()
const DEVELOPER = zod.object({
     name:        zod.string(),
     YOE:         zod.number().multipleOf(0.1),
     email:       zod.string(),
     phone:       zod.string(),
     password:    zod.string(),
     rating:      zod.string()
})
const SIGNINBODY = zod.object({
    email:    zod.string(),
    password: zod.string()
})
router.post("/signup", async(req, res)=>{
    const parseddev = DEVELOPER.safeParse(req.body)
    if(!parseddev.success){
        return void res.status(400).json({
            error: "Invalid Format"
        })
    }
    const devloper = await prismaClient.developer.create({
        data:{
            name :parseddev.data.name,
            YOE :parseddev.data.YOE,
            email :parseddev.data.email,
            phone :parseddev.data.phone,
            password :parseddev.data.password,
        }
    })
    if(!devloper){
        return void res.status(400).json({
            error: "Unable to create a record try after some time"
        })
    }
    const token = jwt.sign({
                userId: devloper.id
            }
            //@ts-ignore
        , process.env.JWT_SECRET
        )
        return void res.status(200).json({
            token: token
        })
} )
router.post("/signin", async(req, res)=>{
const parsedsignin = SIGNINBODY.safeParse(req.body)
if(!parsedsignin.success){
    return void res.status(400).json({
        error: "Invalid Format"
    })
}
const developer = await prismaClient.developer.findFirst({
    where: {
        email: parsedsignin.data.email
    }
})
if(!developer){
    return void res.status(400).json({
        error: "You are not signedup"
    })
    
}
if(developer.password===req.body.password){
    const token = jwt.sign({
        userId: developer.id
    }, 
//@ts-ignore
process.env.JWT_SECRET
)
return void res.status(400).json({
    token: token
})
}
return void res.status(200).json({
    error: "Inputs are incorrect please check your username and password"
})
})
export default router