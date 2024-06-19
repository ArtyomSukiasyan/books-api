import { Request, Response } from "express";
import User from "../models/User";
import { IExtendedRequest } from "../models/interfaces/extenderRequest";
import passwordService from "../services/password.service";
import jwtService from "../services/jwt.service";
import mailService from "../services/mail.service";

const bigNumberToGenerateRandom = 10000000000000000;

export async function createUser(req: Request, res: Response) {
  const { username, password, email } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
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

    await mailService.sendMail({
      from: `Mail confirmation at Book API <${process.env.EMAIL_URL}>`,
      subject: "Confirm Your Email Address",
      text: `${process.env.MAIN_URL}/confirm-email/${mailConfirmationId}`,
      html: `<a
      href="${process.env.MAIN_URL}/confirm-email/${mailConfirmationId}"
      style="
        background-color: #4672e7;
        padding: 8px 16px;
        border-radius: 8px;
        text-decoration: none;
        color: #ffffff;
      "
      >Confirm email</a
    >`,

      to: user.email,
    });

    const newUser = await user.save();

    return res.json(newUser);
  } catch (err) {
    console.log(err);

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

    const isMatch = await passwordService.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    if (user.mailConfirmationId) {
      return res.status(400).json({ msg: "Email not confirmed" });
    }

    const payload = { user: { id: user.id } };
    const token = jwtService.generateToken(payload);

    return res.json({ token });
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

export async function confirmEmail(req: Request, res: Response) {
  const { mailConfirmationId } = req.params;

  const user = await User.findOne({ mailConfirmationId });

  const errors: { [key: string]: string } = {};

  if (!user) {
    return res.status(400).send({ error: "User not found" });
  }

  await User.updateOne(
    { email: user.email },
    {
      $set: {
        mailConfirmationId: null,
      },
    }
  );

  return res.status(200).send({ message: "Email confirmed successfully" });
}
