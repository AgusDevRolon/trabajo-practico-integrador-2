import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { register, login, getProfile, updateProfile, logout } from "../controllers/auth.controller.js";


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.post("/logout", authMiddleware, logout);

export default router;