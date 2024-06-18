import express, { Request, Response } from "express";
import User from "../models/User";
import auth from "../middlewares/auth";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IExtendedRequest } from "../models/interfaces/extenderRequest";

const router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
  const { username, password, email } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    new User({ username, password, email });
    const newUser = await user.save();
    delete newUser.password;
    res.json(user);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    const payload = { user: { id: user.id } };
    jwt.sign(payload, "secret", { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

router.get("/me", auth, async (req: IExtendedRequest, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

router.put(
  "/:id/role",
  auth,
  //   roles.admin,
  async (req: Request, res: Response) => {
    const { role } = req.body;
    try {
      let user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }
      user.role = role;
      await user.save();
      res.json(user);
    } catch (err) {
      res.status(500).send("Server Error");
    }
  }
);

export default router;
