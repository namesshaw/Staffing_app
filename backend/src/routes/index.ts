import express from "express"
const router = express.Router()
import clientRouter from "./client"
import dotenv from "dotenv";
dotenv.config();
import devRouter   from "./dev"
import jwt from 'jsonwebtoken'
import prismaClient from "../db/db"

import OpenAI from "openai";
const openaiClient = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
  });

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


router.get("/llm/prompt", async(req, res) => {
    debugger
    const input = req.body.input;
    try{
        const devs = await prismaClient.developer.findMany({
            select : {
                id : true,
                name : true, 
                YOE : true,
                // rating : true,
                // schedule : true,
                // hourly_rate : true,
                skills : true
            }
        })
        console.log(devs)
        const prompt = `
        context : ${input}
        
        Deduce the budget, duration, and the kind of project the user wants to build from the context
        provided. Below is the list of available developers. Scan through them and retrieve the relevant 
        information. If the context contains the tech stack to be used explicitly then only select those
        developers with the given data. If the context contains minimum proficiency and/or minimum rating 
        then also put the relevant filter while selecting the developers
        
        Here is the list of the developers to choose from:
        Available developer : ${devs.map((d) => 
            ` -> (Id : ${d.id}): Skills: ${d.skills.map(skill => 
            `${skill.name} + ${skill.proficiency}`).join(", ")}, Name: ${d.name}, YOE: ${d.YOE}`
        ).join("\n")}
        
        Based on the context and the dev list choose and suggest
        - The most suitable tech stack
        - The number and type of developers needed
        - The best team composition from the available developers, considering their skills, 
          proficiency, and hourly rates (assume 8 hours/day work)
        - Ensure the total cost fits within the budget and the project can be completed 
          in the given duration

          Return your reasoning, the suggested tech stack, and the selected developers 
          (with their names) as a JSON array in a field called "retrievedList". Example:. 
          {
            "reasoning": "...",
            "techStack": ["React", "Node.js"],
            "retrievedList": [
                { "id": "dev1", "name": "Alice", "skills": ["React", "Node.js"], "YOE": 5 }
            ]
        }

        `

        const response = await openaiClient.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: "user", content: prompt }]
          });
        
        const outputText = response.choices[0].message.content;

        // Try to extract JSON from the LLM output
        let retrievedList = {};
        try {
          if (!outputText) {
            throw new Error("Output text is null or undefined");
          }
          const jsonStart = outputText.indexOf('{');
          const jsonEnd = outputText.lastIndexOf('}');
          if (jsonStart !== -1 && jsonEnd !== -1) {
            const jsonString = outputText.substring(jsonStart, jsonEnd + 1);
            retrievedList = JSON.parse(jsonString).retrievedList;
          }
        } catch (e) {
          console.log("Failed to parse retrievedList from LLM output");
        }

        console.log(prompt, "\n \n");
        console.log(outputText, "\n \n");
        console.log( retrievedList)
        
        return void res.status(200).json({ output: outputText, retrievedList })
        
    }
    catch(e){
        console.log(e);
        return void res.status(511).json({
            message: "Something went wrong"
        })
    }
})

export default router