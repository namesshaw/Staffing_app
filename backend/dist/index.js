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
const db_js_1 = __importDefault(require("./db/db.js"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const cors = require("cors");
app.use(cors());
app.use(express_1.default.json());
db_js_1.default.$connect()
    .then(() => console.log('Successfully connected to database'))
    .catch((error) => console.error('Error connecting to database:', error));
app.use("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_js_1.default.user.findFirst({
        where: {
            name: "ShriangWanikar"
        }
    });
    if (!user) {
        console.log("Hello");
    }
}));
app.listen(3000, () => {
    console.log("Listening on port 3000");
});
