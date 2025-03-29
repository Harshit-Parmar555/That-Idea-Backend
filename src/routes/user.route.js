import express from "express";
import { signup, logout, checkAuth } from "../controllers/user.controller.js";
import { protectedRoute } from "../middlewares/auth.js";

// User router
const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.get("/logout", logout);
userRouter.get("/checkAuth", protectedRoute, checkAuth);

export { userRouter };
