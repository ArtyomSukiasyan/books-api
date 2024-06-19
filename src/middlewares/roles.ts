import { Response, NextFunction } from "express";
import { IExtendedRequest } from "../models/interfaces/extenderRequest";

export const admin = (
  req: IExtendedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== 1) {
    res.status(403).json({ msg: "Access denied" });

    return;
  }
  next();
};
