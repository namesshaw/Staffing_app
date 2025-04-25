import express from "express"
const router = express.Router()
import adminrouter from "./admin"
router.use("/admin", adminrouter)
export default router