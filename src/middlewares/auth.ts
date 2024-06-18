import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface IDecodedToken {
  user: {
    id: string;
  };
}

interface IExtendedRequest extends Request {
  user?: {
    id: string;
  };
}

export default function (
  req: IExtendedRequest,
  res: Response,
  next: NextFunction
): void {
  const token = req.header("x-auth-token");
  if (!token) {
    res.status(401).json({ msg: "No token, authorization denied" });
    return;
  }
  try {
    const decoded = jwt.verify(token, "secret") as IDecodedToken;
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
}
