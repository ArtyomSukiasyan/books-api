import express from "express";
import auth from "../middlewares/auth";
import {
  createUser,
  getMe,
  loginUser,
  updateRole,
} from "../controllers/UserController";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/me", auth, getMe);
router.put("/:id/role", auth, updateRole);

export default router;
