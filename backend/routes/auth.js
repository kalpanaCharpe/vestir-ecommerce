import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { registerValidator, loginValidator } from "../middleware/validators.js";
import validateRequest from "../middleware/validateRequest.js";


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;