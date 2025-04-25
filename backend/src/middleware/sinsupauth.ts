import prismaClient from "../db/db";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
export const usersinsupauth = async(req:Request, res:Response, next:NextFunction)=>{
const token = req.headers.authorization
if(!token){
    return void res.status(400).json({
        error: "jwt not present"
    })

    
}
const decoded = jwt.verify( token, //@ts-ignore
 process.env.JWT_SECRET)
 const user = await prismaClient.user.findFirst({
    where:{
        id: decoded.userId
    }
 })
 if(!user){
    return void res.status(400).json({
        error: "This is a authenticated endpoint and you are not authorized to view this w/o signin/signup"
    })
    
 }
 next()
}
export const devsinsupauth = async(req:Request, res:Response, next:NextFunction)=>{
    const token = req.headers.authorization
    if(!token){
        return void res.status(400).json({
            error: "jwt not present"
        })
    
        
    }
    const decoded = jwt.verify( token, //@ts-ignore
     process.env.JWT_SECRET)
     const user = await prismaClient.developer.findFirst({
        where:{
            id: decoded.userId
        }
     })
     if(!user){
        return void res.status(400).json({
            error: "This is a authenticated endpoint and you are not authorized to view this w/o signin/signup"
        })
        
     }
     next()
    }