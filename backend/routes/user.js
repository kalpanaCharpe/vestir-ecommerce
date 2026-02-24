import express from "express";
import { getProfile, updateProfile, getAllUsers, deleteUser, logoutUser, deleteOwnProfile } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import { updateProfileValidator } from "../middleware/validators.js";
import validateRequest from "../middleware/validateRequest.js";

const router = express.Router();

// User routes
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.post("/profile", authMiddleware, logoutUser)
router.delete("/profile", authMiddleware, deleteOwnProfile); //user self-delete

// Admin routes
router.get("/", authMiddleware, adminMiddleware, getAllUsers);
router.delete("/:userId", authMiddleware, adminMiddleware, deleteUser);

export default router;