import mongoose from "mongoose";

// Idea schema
const ideaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    pitch: {
      type: String,
      required: [true, "Pitch is required"],
      trim: true,
    },
    coverImage: {
      type: String,
      required: [true, "Cover Image is required"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: [true, "User is required"],
    },
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "user",
      },
    ],
    category: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Idea model
export const Idea = mongoose.model("idea", ideaSchema);
