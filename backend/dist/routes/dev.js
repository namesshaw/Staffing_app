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
const zod_1 = __importDefault(require("zod"));
const db_1 = __importDefault(require("../db/db"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
const DEVELOPER = zod_1.default.object({
    name: zod_1.default.string(),
    YOE: zod_1.default.number().multipleOf(0.1),
    email: zod_1.default.string(),
    phone: zod_1.default.string(),
    password: zod_1.default.string(),
    rating: zod_1.default.string()
});
const SIGNINBODY = zod_1.default.object({
    email: zod_1.default.string(),
    password: zod_1.default.string()
});
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parseddev = DEVELOPER.safeParse(req.body);
    if (!parseddev.success) {
        return void res.status(400).json({
            error: "Invalid Format"
        });
    }
    const devloper = yield db_1.default.developer.create({
        data: {
            name: parseddev.data.name,
            YOE: parseddev.data.YOE,
            email: parseddev.data.email,
            phone: parseddev.data.phone,
            password: parseddev.data.password,
        }
    });
    if (!devloper) {
        return void res.status(400).json({
            error: "Unable to create a record try after some time"
        });
    }
    const token = jsonwebtoken_1.default.sign({
        userId: devloper.id
    }
    //@ts-ignore
    , process.env.JWT_SECRET);
    return void res.status(200).json({
        token: token
    });
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedsignin = SIGNINBODY.safeParse(req.body);
    if (!parsedsignin.success) {
        return void res.status(400).json({
            error: "Invalid Format"
        });
    }
    const developer = yield db_1.default.developer.findFirst({
        where: {
            email: parsedsignin.data.email
        }
    });
    if (!developer) {
        return void res.status(400).json({
            error: "You are not signedup"
        });
    }
    if (developer.password === req.body.password) {
        const token = jsonwebtoken_1.default.sign({
            userId: developer.id
        }, 
        //@ts-ignore
        process.env.JWT_SECRET);
        return void res.status(400).json({
            token: token
        });
    }
    return void res.status(200).json({
        error: "Inputs are incorrect please check your username and password"
    });
}));
exports.default = router;
