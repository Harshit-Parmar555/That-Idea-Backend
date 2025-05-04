import { Idea } from "../models/idea.model.js";
import { uploadImageToFirebase } from "../utils/uploadImg.js";
import { User } from "../models/user.model.js";
import { getSortOption } from "../utils/sortHelper.js";
import mongoose from "mongoose";

// Add start controller
export const addIdea = async (req, res) => {
  try {
    const { name, description, pitch, category } = req.body;

    if (!name || !description || !pitch || !category) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all fields" });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Cover image is required" });
    }

    // Upload the image
    const coverImgURL = await uploadImageToFirebase(req.file);
    if (!coverImgURL) {
      return res
        .status(500)
        .json({ success: false, message: "Error in cover image upload" });
    }

    // Start Transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create new startup entry
      const newIdea = new Idea({
        name,
        description,
        pitch,
        category,
        coverImage: coverImgURL,
        user: req.user._id, // req.user is already set by middleware
      });

      await newIdea.save({ session });

      // Find the user and update their starts array
      const user = await User.findById(req.user._id).session(session);
      if (!user) {
        throw new Error("User not found");
      }
      user.ideas.push(newIdea);
      await user.save({ session });

      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        success: true,
        message: "Startup Idea Added Successfully",
        idea: newIdea,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get starts controller
export const getIdeas = async (req, res) => {
  try {
    const { sortBy } = req.query;

    let query = Idea.find().populate("user");
    const sortOption = getSortOption(sortBy);

    if (sortOption) {
      query = query.sort(sortOption);
      const results = await query;
      return res.status(200).json({ success: true, Ideas: results });
    }

    // Popular: handled manually
    const ideas = await query.lean();
    const sorted = ideas
      .map((i) => ({ ...i, likesCount: i.likes?.length || 0 }))
      .sort((a, b) => b.likesCount - a.likesCount);

    return res.status(200).json({ success: true, Ideas: sorted });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get my starts controller
export const getUserIdeas = async (req, res) => {
  try {
    const userIdeas = await Idea.find({ user: req.user._id }).populate("user");

    return res.status(200).json({
      success: true,
      message: "User ideas fetched successfully",
      ideas: userIdeas,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete start controller
export const deleteIdea = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Id not provided" });
    }

    const idea = await Idea.findById(id);

    if (!idea) {
      return res
        .status(404)
        .json({ success: false, message: "Startup Idea not found" });
    }

    // Ensure only the owner can delete
    if (idea.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized action" });
    }

    // Remove from user's startups list
    await User.findByIdAndUpdate(req.user._id, { $pull: { ideas: id } });

    await idea.deleteOne();

    return res
      .status(200)
      .json({ success: true, message: "Startup Idea deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Search start controller
export const searchIdea = async (req, res) => {
  try {
    const { query, sortBy } = req.query;

    if (!query) {
      return res
        .status(400)
        .json({ success: false, message: "Query required" });
    }

    const searchFilter = {
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { pitch: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    };

    let queryBuilder = Idea.find(searchFilter).populate("user");
    const sortOption = getSortOption(sortBy);

    if (sortOption) {
      queryBuilder = queryBuilder.sort(sortOption);
      const results = await queryBuilder;
      return res.status(200).json({ success: true, results });
    }

    // Popular: handled manually
    const ideas = await queryBuilder.lean();
    const sorted = ideas
      .map((i) => ({ ...i, likesCount: i.likes?.length || 0 }))
      .sort((a, b) => b.likesCount - a.likesCount);

    return res.status(200).json({ success: true, results: sorted });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get view user
export const getViewUser = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Check if ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID format" });
    }
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "ID not provided" });
    }

    // ✅ Populate `starts` and `user` inside `starts`
    const user = await User.findById(id)
      .populate({
        path: "ideas",
        populate: {
          path: "user",
        },
      })
      .exec();

    // ✅ If user not found, return error
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Toggle like
export const toggleLikeIdea = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Idea ID not provided" });
    }

    const idea = await Idea.findById(id);
    if (!idea) {
      return res
        .status(404)
        .json({ success: false, message: "Idea not found" });
    }

    const userIdStr = userId.toString();
    const likeIndex = idea.likes.findIndex(
      (like) => like.toString() === userIdStr
    );

    if (likeIndex > -1) {
      idea.likes.splice(likeIndex, 1); // remove like
      await idea.save();
      return res.status(200).json({
        success: true,
        message: "Idea unliked",
        liked: false,
        totalLikes: idea.likes.length,
      });
    } else {
      idea.likes.push(userId);
      await idea.save();
      return res.status(200).json({
        success: true,
        message: "Idea liked",
        liked: true,
        totalLikes: idea.likes.length,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};

// Get Single Idea
export const getIdea = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Idea ID not provided" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid idea ID format" });
    }

    const idea = await Idea.findById(id).populate("user");
    if (!idea) {
      return res
        .status(400)
        .send({ success: false, message: "Idea not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Idea fetched", idea });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
