import { Response } from "express";
import { errorMessages } from "../constants/errorMessages";
import { IExtendedRequest } from "../models/interfaces/extenderRequest";
import crypto from "crypto";
import User, { IUser } from "../models/User";
import { FilterQuery } from "mongoose";

function generateId() {
  return crypto.randomBytes(16).toString("hex");
}

async function getMe(req: IExtendedRequest, res: Response) {
  try {
    const user = await User.findById(req.user.id).select("-password");

    return res.json(user);
  } catch (err) {
    return res.status(500).send(errorMessages.serverError);
  }
}

async function getUserByParams(params: FilterQuery<IUser>) {
  return User.findOne(params);
}

async function updateUserData({
  email,
  params,
}: {
  email: string;
  params: FilterQuery<IUser>;
}) {
  await User.updateOne(
    { email },
    {
      $set: params,
    }
  );
}

async function createUser(params: FilterQuery<IUser>) {
  const user = new User(params);

  return user.save();
}

export default {
  generateId,
  getMe,
  getUserByParams,
  updateUserData,
  createUser,
};
