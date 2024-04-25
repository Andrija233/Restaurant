import express from "express";
import UserRouterController from "../controllers/UserController";
import { jwtCheck } from "../middleware/auth";

const router = express.Router();

// router for index
router.post("/", jwtCheck, UserRouterController.createCurrentUser);

export default router;