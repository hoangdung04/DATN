import { Router } from "express";
import * as controller from "../../controllers/client/order.controller.js";
import { requireClientAuth } from "../../middlewares/client/auth.middleware.js";

const router = Router();
router.post("/", controller.index);
router.get("/success", controller.success);
router.get("/history", requireClientAuth, controller.history);

export const orderRoutes = router;
