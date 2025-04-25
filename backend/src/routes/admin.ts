import express from "express"
import { Request, Response} from "express"
import jwt from "jsonwebtoken"
import zod from "zod"

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
  
      return void res.status(200).json({ message: user });
    } catch (error) {
      return void res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
export default router