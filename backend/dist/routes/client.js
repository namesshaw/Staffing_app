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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = __importDefault(require("zod"));
const Auth_1 = require("../middleware/Auth");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const db_1 = __importDefault(require("../db/db"));
const router = express_1.default.Router();
const PROJECT = zod_1.default.object({
    name: zod_1.default.string(),
    roomid: zod_1.default.string().optional(),
    budget: zod_1.default.number().multipleOf(0.1),
    timeline: zod_1.default.number(),
    required_developers: zod_1.default.number(),
});
const USER_BODY = zod_1.default.object({
    name: zod_1.default.string(),
    email: zod_1.default.string().email(),
    company: zod_1.default.string(),
    password: zod_1.default.string(),
    phone: zod_1.default.string(),
    rating: zod_1.default.number().multipleOf(0.01).optional(),
});
const SIGNINBODY = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string(),
});
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedUser = USER_BODY.safeParse(req.body);
    if (!parsedUser.success) {
        return void res.status(400).json({ error: "Invalid user data" });
    }
    try {
        const user = yield db_1.default.user.create({
            data: {
                name: parsedUser.data.name,
                email: parsedUser.data.email,
                company: parsedUser.data.company,
                password: parsedUser.data.password,
                phone: parsedUser.data.phone,
                rating: parsedUser.data.rating,
            },
        });
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
        }, 
        //@ts-ignore
        process.env.USER_JWT_SECRET);
        return void res.status(200).json({
            token: token,
        });
    }
    catch (error) {
        return void res.status(500).json({ error: "Internal Server Error" });
    }
}));
router.get("/info", Auth_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return void res.status(202).json(req.user);
    }
    catch (e) {
        console.log(e);
        return void res.status(504).json({
            message: "Cant fetch info"
        });
    }
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedSignin = SIGNINBODY.safeParse(req.body);
    if (!parsedSignin.success) {
        return void res.status(400).json({
            error: "Inputs format not correct should be handled in frontend itself",
        });
    }
    const user = yield db_1.default.user.findFirst({
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
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
        }, 
        //@ts-ignore
        process.env.USER_JWT_SECRET);
        return void res.status(200).json({
            token: token,
        });
    }
    return void res.status(400).json({
        error: "Please check your email or password",
    });
}));
router.post("/addproject", Auth_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const parsedProject = PROJECT.safeParse(req.body);
    if (!parsedProject.success) {
        return void res.status(400).json({
            message: "Invalid inputs",
        });
    }
    const created_by = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        if (created_by) {
            const room = yield db_1.default.room.create({
                data: {
                    admin: created_by,
                },
            });
            if (room) {
                const project = yield db_1.default.project.create({
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
            }
            else {
                return void res.status(400).json({
                    message: "Room not created hence project not created",
                });
            }
        }
        else {
            return void res.status(400).json({
                message: "Relogin as created by not available",
            });
        }
    }
    catch (error) {
        console.log(error);
        return void res.status(400).json({
            error: error,
        });
    }
}));
exports.default = router;
