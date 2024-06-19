import { Request, Response } from "express";
import { IExtendedRequest } from "../models/interfaces/extenderRequest";
import passwordService from "../services/password.service";
import jwtService from "../services/jwt.service";
import mailService from "../services/mail.service";
import { mailValues } from "../constants/mailValues";
import { errorMessages } from "../constants/errorMessages";
import userService from "../services/user.service";

export async function createUser(req: Request, res: Response) {
  const { username, password, email } = req.body;
  try {
    let user = await userService.getUserByParams({ email });
    if (user) {
      return res.status(400).json({ msg: errorMessages.userExist });
    }

    const hashedPassword = await passwordService.hash(password);

    const mailConfirmationId = userService.generateId();

    await mailService.sendMail(
      mailValues.confirmation(mailConfirmationId, user.email)
    );

    const newUser = await userService.createUser({
      username,
      password: hashedPassword,
      email,
      mailConfirmationId,
    });

    return res.json(newUser);
  } catch (err) {
    console.log(err);

    return res.status(500).send(errorMessages.serverError);
  }
}

export async function loginUser(req: Request, res: Response) {
  const { username, password } = req.body;
  try {
    const user = await userService.getUserByParams({ username });
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
  return userService.getMe(req, res);
}

export async function updateRole(req: Request, res: Response) {
  const { role } = req.body;
  try {
    const user = await userService.getUserByParams({ id: req.params.id });
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

  const user = await userService.getUserByParams({ mailConfirmationId });
  if (!user) {
    return res.status(400).send({ error: errorMessages.notFound("User") });
  }

  await userService.updateUserData({
    email: user.email,
    params: {
      mailConfirmationId: null,
    },
  });

  return res.status(200).send({ msg: errorMessages.emailConfirmed });
}
