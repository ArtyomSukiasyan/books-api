import { Request, Response } from "express";
import { errorMessages } from "../constants/errorMessages";
import { IExtendedRequest } from "../models/interfaces/extenderRequest";
import User from "../models/User";

function generateId() {
  const bigNumberToGenerateRandom = 1000000000000000;

  return Math.round(Math.random() * bigNumberToGenerateRandom);
}

export async function getMe(req: IExtendedRequest, res: Response) {
  try {
    const user = await User.findById(req.user.id).select("-password");

    return res.json(user);
  } catch (err) {
    return res.status(500).send(errorMessages.serverError);
  }
}

export default { generateId, getMe };
