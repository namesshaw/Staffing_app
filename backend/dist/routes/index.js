"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const client_1 = __importDefault(require("./client"));
const dev_1 = __importDefault(require("./dev"));
router.use("/client", client_1.default);
router.use("/dev", dev_1.default);
exports.default = router;
