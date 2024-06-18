import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { IExtendedRequest } from "../models/interfaces/extenderRequest";

export async function createUser(req: Request, res: Response) {
  const { username, password, email } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, process.env.HASH_SALT);
    user = new User({ username, password: hashedPassword, email });

    const newUser = await user.save();

    return res.json(newUser);
  } catch (err) {
    return res.status(500).send("Server Error");
  }
}

export async function loginUser(req: Request, res: Response) {
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
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
      (err, token) => {
        if (err) {
          throw err;
        }

        return res.json({ token });
      }
    );
  } catch (err) {
    return res.status(500).send("Server Error");
  }
}

export async function getMe(req: IExtendedRequest, res: Response) {
  try {
    const user = await User.findById(req.user.id).select("-password");

    return res.json(user);
  } catch (err) {
    return res.status(500).send("Server Error");
  }
}

export async function updateRole(req: Request, res: Response) {
  const { role } = req.body;
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    user.role = role;
    await user.save();

    return res.json(user);
  } catch (err) {
    return res.status(500).send("Server Error");
  }
}
