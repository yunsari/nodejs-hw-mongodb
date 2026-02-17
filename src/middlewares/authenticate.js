import jwt from "jsonwebtoken";
import createHttpError from "create-http-error";
import { User } from "../db/models/user.js";

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(createHttpError(401));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) throw createHttpError(401);

    req.user = user;
    next();
  } catch (err) {
    return next(createHttpError(401, "Access token expired"));
  }
};
