import express from "express";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import zod from "zod";
import { userAuth } from "../middleware/Auth";
import { User } from "../interfaces";
import dotenv from "dotenv";
dotenv.config();
interface UserRequest extends Request {
  user?: User;
}

import prismaClient from "../db/db";
const router = express.Router();
const PROJECT = zod.object({
  name: zod.string(),
  roomid: zod.string().optional(),
  budget: zod.number().multipleOf(0.1),
  timeline: zod.number(),
  required_developers: zod.number(),
});
const USER_BODY = zod.object({
  name: zod.string(),
  email: zod.string().email(),
  company: zod.string(),
  password: zod.string(),
  phone: zod.string(),
  rating: zod.number().multipleOf(0.01).optional(),
});
const SIGNINBODY = zod.object({
  email: zod.string().email(),
  password: zod.string(),
});
router.post("/signup", async (req: Request, res: Response) => {
  const parsedUser = USER_BODY.safeParse(req.body);

  if (!parsedUser.success) {
    return void res.status(400).json({ error: "Invalid user data" });
  }

  try {
    const user = await prismaClient.user.create({
      data: {
        name: parsedUser.data.name,
        email: parsedUser.data.email,
        company: parsedUser.data.company,
        password: parsedUser.data.password,
        phone: parsedUser.data.phone,
        rating: parsedUser.data.rating,
      },
    });

    const token = jwt.sign(
      {
        userId: user.id,
      },
      //@ts-ignore
      process.env.USER_JWT_SECRET
    );
    return void res.status(200).json({
      token: token,
    });
  } catch (error) {
    return void res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/info", userAuth, async(req, res) =>{
    try{
       return void res.status(202).json((req as any).user);
    }catch(e){
      console.log(e);
      return void res.status(504).json({
        message : "Cant fetch info"
      })
    }
})
router.post("/signin", async (req: Request, res: Response) => {
  const parsedSignin = SIGNINBODY.safeParse(req.body);
  if (!parsedSignin.success) {
    return void res.status(400).json({
      error: "Inputs format not correct should be handled in frontend itself",
    });
  }
  const user = await prismaClient.user.findFirst({
    where: {
      email: parsedSignin.data.email,
    },
  });
  if (!user) {
    return void res.status(400).json({
      error: "You are not signedup yet",
    });
  }
  if (user.password === parsedSignin.data.password) {
    const token = jwt.sign(
      {
        userId: user.id,
      },
      //@ts-ignore
      process.env.USER_JWT_SECRET
    );
    return void res.status(200).json({
      token: token,
    });
  }
  return void res.status(400).json({
    error: "Please check your email or password",
  });
});
router.post("/addproject",userAuth ,async (req: UserRequest, res: Response) => {
  debugger
    const parsedProject = PROJECT.safeParse(req.body);
    if (!parsedProject.success) {
      return void res.status(400).json({
        message: "Invalid inputs",
      });
    }
    const created_by = req.user?.id;
    try {
      if (created_by) {
        const room = await prismaClient.room.create({
          data: {
            admin: created_by,
          },
        });
        if (room) {
          const project = await prismaClient.project.create({
            data: {
              name: parsedProject.data.name,
              roomid: room.Roomid,
              created_by: created_by,
              budget: parsedProject.data.budget,
              timeline: parsedProject.data.timeline,
              required_developers: parsedProject.data.required_developers,
            },
          });
          console.log(project);
          return void res.status(200).json({
            message: project,
            room: room,
          });
        } else {
          return void res.status(400).json({
            message: "Room not created hence project not created",
          });
        }
      } else {
        return void res.status(400).json({
          message: "Relogin as created by not available",
        });
      }
    } catch (error) {
      console.log(error);
      return void res.status(400).json({
        error: error,
      });
    }
  }
);
router.put("/edit/:field", userAuth, async (req, res) => {
    
  const field = req.params.field;
  const change = req.body.change;
  const userId = (req as any).user?.id;
  try {
      const data = await prismaClient.user.update({
          where: { id: userId },
          data: {
              [field]: change,
          },
      });
      return void res.status(200).json({
          
          message: "Updated Successfully",
      });
  } catch (e) {
      console.log(e);
      return void res.status(511).json({
          message: "Failed to update",
      });
  }
});

router.get("/myprojects", userAuth, async (req, res) => {
  const userId = (req as any).user?.id;
  try {
      const projects = await prismaClient.user.findMany({
          where: { id: userId },
          select : {projects : true}
      })
      console.log(projects)
      return void res.status(200).json(projects)
  } catch (e) {
      console.log(e);
      return void res.status(511).json({
          message: "Couldnt get the projects"
      })
  }

});
export default router;
