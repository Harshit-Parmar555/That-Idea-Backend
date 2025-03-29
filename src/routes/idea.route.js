import express from "express";
import {
  addIdea,
  getIdeas,
  getUserIdeas,
  deleteIdea,
  searchIdea,
  getViewUser,
  getIdea,
  toggleLikeIdea,
} from "../controllers/idea.controller.js";
import { protectedRoute } from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.js";

// Idea router
const ideaRouter = express.Router();

// Add idea
ideaRouter.post(
  "/addIdea",
  protectedRoute,
  upload.single("coverImage"),
  addIdea
);
// Get all ideas
ideaRouter.get("/getIdeas", getIdeas);
// Get User ideas
ideaRouter.get("/getUserIdeas", protectedRoute, getUserIdeas);
// Delete ideas
ideaRouter.delete("/deleteIdea/:id", protectedRoute, deleteIdea);
// Search ideas
ideaRouter.get("/searchIdea", searchIdea);
// Get view user and ideas
ideaRouter.get("/getViewUser/:id", getViewUser);
// Like / Dislike idea
ideaRouter.put("/toggleIdeaLike/:id", protectedRoute, toggleLikeIdea);
// Get a single idea
ideaRouter.get("/getIdea/:id", getIdea);

export { ideaRouter };
