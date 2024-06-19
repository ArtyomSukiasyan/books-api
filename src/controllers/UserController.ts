import { Request, Response } from "express";
import User from "../models/User";
import { IExtendedRequest } from "../models/interfaces/extenderRequest";
import passwordService from "../services/password.service";
import jwtService from "../services/jwt.service";
import mailService from "../services/mail.service";
import { mailValues } from "../constants/mailValues";
import { errorMessages } from "../constants/errorMessages";

const bigNumberToGenerateRandom = 1000000000000000;

export async function createUser(req: Request, res: Response) {
  const { username, password, email } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: errorMessages.userExist });
    }

    const hashedPassword = await passwordService.hash(password);

    const mailConfirmationId = Math.round(
      Math.random() * bigNumberToGenerateRandom
    );

    user = new User({
      username,
      password: hashedPassword,
      email,
      mailConfirmationId,
    });

    await mailService.sendMail(
      mailValues.confirmation(mailConfirmationId, user.email)
    );

    const newUser = await user.save();

    return res.json(newUser);
  } catch (err) {
    console.log(err);

    return res.status(500).send(errorMessages.serverError);
  }
}

export async function loginUser(req: Request, res: Response) {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: errorMessages.invalidCredentials });
    }

    const isMatch = await passwordService.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: errorMessages.invalidCredentials });
    }

    if (user.mailConfirmationId) {
      return res.status(400).json({ msg: errorMessages.emailNotConfirmed });
    }

    const payload = { user: { id: user.id } };
    const token = jwtService.generateToken(payload);

    return res.json({ token });
  } catch (err) {
    return res.status(500).send(errorMessages.serverError);
  }
}

export async function getMe(req: IExtendedRequest, res: Response) {
  try {
    const user = await User.findById(req.user.id).select("-password");

    return res.json(user);
  } catch (err) {
    return res.status(500).send(errorMessages.serverError);
  }
}

export async function updateRole(req: Request, res: Response) {
  const { role } = req.body;
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: errorMessages.notFound("User") });
    }
    user.role = role;
    await user.save();

    return res.json(user);
  } catch (err) {
    return res.status(500).send(errorMessages.serverError);
  }
}

export async function confirmEmail(req: Request, res: Response) {
  const { mailConfirmationId } = req.params;

  const user = await User.findOne({ mailConfirmationId });

  if (!user) {
    return res.status(400).send({ error: errorMessages.notFound("User") });
  }

  await User.updateOne(
    { email: user.email },
    {
      $set: {
        mailConfirmationId: null,
      },
    }
  );

  return res.status(200).send({ msg: errorMessages.emailConfirmed });
}
