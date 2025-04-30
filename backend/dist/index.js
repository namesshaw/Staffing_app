"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const socket_1 = require("./websocket/socket");
const routes_1 = __importDefault(require("./routes"));
const server = (0, socket_1.InitWebsocket)();
app.use((0, cors_1.default)({
    origin: 'http://localhost:3001',
    credentials: true,
}));
app.use(express_1.default.json());
app.use("/api/v1", routes_1.default);
app.listen(3000, () => {
    console.log("Listening on port 3000");
    console.log("WebSocket Server listening on port 8080");
});
