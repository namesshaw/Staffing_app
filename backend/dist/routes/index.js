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
exports.default = router;
