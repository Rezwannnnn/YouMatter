import express from "express";
import { loginUser, registerUser, updateAnonymousName } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// User routes
router.put("/anonymous-name", protect, updateAnonymousName);

export default router;