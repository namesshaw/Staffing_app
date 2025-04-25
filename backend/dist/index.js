"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const cors = require("cors");
const index_js_1 = __importDefault(require("./routes/index.js"));
app.use(cors());
app.use(express_1.default.json());
app.use("/api/v1", index_js_1.default);
app.listen(3000, () => {
    console.log("Listening on port 3000");
});
