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
const router = express_1.default.Router();
const USER_BODY = zod_1.default.object({
    name: zod_1.default.string(),
    email: zod_1.default.string().email(),
    company: zod_1.default.string(),
    password: zod_1.default.string(),
    phone: zod_1.default.string(),
    rating: zod_1.default.number().multipleOf(0.01)
});
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parseduser = USER_BODY.safeParse(req.body);
    if (!parseduser.success) {
        return void res.status(400).json({ error: "Invalid user data" });
    }
    try {
        const user = yield db_1.default.user.create({
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
    }
    catch (error) {
        return void res.status(500).json({ error: "Internal Server Error" });
    }
}));
exports.default = router;
