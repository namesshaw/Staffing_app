import express from "express"
const router = express.Router()
import adminrouter from "./admin"
import devrouter   from "./dev"
router.use("/admin", adminrouter)
router.use("/dev", devrouter)
export default router