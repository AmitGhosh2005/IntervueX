import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getStreamtoken } from "../controllers/chatControllers.js";

const router = express.Router();

router.get("/token" ,protectRoute, getStreamtoken);

export default router;