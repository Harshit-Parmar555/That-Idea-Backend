import express from "express";
import { signup, logout, checkAuth } from "../controllers/user.controller.js";
import { protectedRoute } from "../middlewares/auth.js";

// User router
const userRouter = express.Router();

// User signup route
userRouter.post("/signup", signup);
// User logout route
userRouter.get("/logout", logout);
// User authentication route
userRouter.get("/checkAuth", protectedRoute, checkAuth);

export { userRouter };
