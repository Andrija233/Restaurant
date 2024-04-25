import express from "express";
import UserRouterController from "../controllers/UserController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyUserRequest } from "../middleware/validation";

const router = express.Router();

// router for index
router.get("/", jwtCheck, jwtParse,  UserRouterController.getCurrentUser);
router.post("/", jwtCheck, UserRouterController.createCurrentUser);
router.put("/", jwtCheck, jwtParse, validateMyUserRequest, UserRouterController.updateCurrentUser);

export default router;