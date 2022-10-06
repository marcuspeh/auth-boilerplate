import Router from "koa-router"

import cryptoRoutes from "./cryptoRoute"
import userRoutes from "./userRoute"

const router = new Router()
router.prefix("/api")

// Set up routes
router.use("/crypto", cryptoRoutes)
router.use("/user", userRoutes)

export default router