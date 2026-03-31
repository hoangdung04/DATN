import express from "express";
const router = express.Router();

import * as controller from "../../controllers/client/cart.controller";

router.get("/", controller.index);

router.post("/list", controller.list);

export const cartRoute = router;