import express from "express"
import { Request, Response} from "express"
import prismaClient from "../db/db"
const router=express.Router()
//@ts-ignore
router.post("/signup", async(req: Request, res: Response) => {
    return res.status(200).json({
        message: "HggggggAHdfA"
    })
})
export default router