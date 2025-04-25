import express from "express"
const router = express.Router()
import clientRouter from "./client"
import devRouter   from "./dev"
router.use("/client", clientRouter)
router.use("/dev", devRouter)
export default router