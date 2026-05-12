import { Router } from "express";
import * as controller from "../../controllers/admin/order.controller.js";
import { requireAuth } from "../../middlewares/admin/auth.middleware.js";
import { checkPermission } from "../../middlewares/admin/permission.middleware.js";

const router = Router();

router.use(requireAuth);

router.get("/", controller.index);
router.patch("/:id/status", controller.updateStatus);

export const orderRoutes = router;
