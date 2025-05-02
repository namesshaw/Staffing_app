"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const client_1 = __importDefault(require("./client"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dev_1 = __importDefault(require("./dev"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../db/db"));
const openai_1 = __importDefault(require("openai"));
const openaiClient = new openai_1.default({
    apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});
router.use("/client", client_1.default);
router.use("/dev", dev_1.default);
router.get("/verify", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.headers.authorization);
    const token = req.headers.authorization;
    if (!token) {
        return void res.status(401).json({
            message: "Not authorized"
        });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, //@ts-ignore
        process.env.DEV_JWT_SECRET);
        res.json({
            message: "DEV Verified"
        });
    }
    catch (e) {
        try {
            const user_decoded = jsonwebtoken_1.default.verify(token, //@ts-ignore
            process.env.USER_JWT_SECRET);
            res.json({
                message: "USER Verified"
            });
        }
        catch (e) {
            console.log(e);
            res.json({
                message: "not Verified"
            });
        }
    }
}));
router.get("/logout", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie('token', { httpOnly: true, secure: false, path: '/' });
    res.clearCookie('role', { httpOnly: true, secure: false, path: '/' });
    res.status(200).json({ message: 'Logged out successfully' });
}));
router.get("/chatroom/:roomId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roomId = req.params.roomId;
    try {
        const chats = yield db_1.default.chat.findMany({
            where: { room_id: roomId }
        });
        //   console.log(chats)
        return void res.status(200).json(chats);
    }
    catch (e) {
        console.log(e);
        return void res.status(511).json({
            message: "Couldnt get the chats"
        });
    }
}));
router.get("/llm/prompt", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    debugger;
    const input = req.body.input;
    try {
        const devs = yield db_1.default.developer.findMany({
            select: {
                id: true,
                name: true,
                YOE: true,
                // rating : true,
                // schedule : true,
                // hourly_rate : true,
                skills: true
            }
        });
        console.log(devs);
        const prompt = `
        context : ${input}
        
        Deduce the budget, duration, and the kind of project the user wants to build from the context
        provided. Below is the list of available developers. Scan through them and retrieve the relevant 
        information. If the context contains the tech stack to be used explicitly then only select those
        developers with the given data. If the context contains minimum proficiency and/or minimum rating 
        then also put the relevant filter while selecting the developers
        
        Here is the list of the developers to choose from:
        Available developer : ${devs.map((d) => ` -> (Id : ${d.id}): Skills: ${d.skills.map(skill => `${skill.name} + ${skill.proficiency}`).join(", ")}, Name: ${d.name}, YOE: ${d.YOE}`).join("\n")}
        
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

        `;
        const response = yield openaiClient.chat.completions.create({
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
        }
        catch (e) {
            console.log("Failed to parse retrievedList from LLM output");
        }
        console.log(prompt, "\n \n");
        console.log(outputText, "\n \n");
        console.log(retrievedList);
        return void res.status(200).json({ output: outputText, retrievedList });
    }
    catch (e) {
        console.log(e);
        return void res.status(511).json({
            message: "Something went wrong"
        });
    }
}));
exports.default = router;
