import bcrypt from "bcrypt";
import createHttpError from "create-http-error";
import { User } from "../models/user.js";
import { Session } from "../models/session.js";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens.js";

const ACCESS_TOKEN_LIFETIME = 15 * 60 * 1000;
const REFRESH_TOKEN_LIFETIME = 30 * 24 * 60 * 60 * 1000;

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, "Email in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const userObj = user.toObject();
  delete userObj.password;

  return userObj;
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw createHttpError(401);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw createHttpError(401);

  await Session.deleteMany({ userId: user._id });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken();

  const session = await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_LIFETIME),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_LIFETIME),
  });

  return { accessToken, refreshToken, session };
};

export const refreshSession = async (refreshToken) => {
  const session = await Session.findOne({ refreshToken });
  if (!session) throw createHttpError(401);

  if (session.refreshTokenValidUntil < new Date()) {
    throw createHttpError(401);
  }

  await Session.deleteOne({ _id: session._id });

  const accessToken = generateAccessToken(session.userId);
  const newRefreshToken = generateRefreshToken();

  await Session.create({
    userId: session.userId,
    accessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_LIFETIME),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_LIFETIME),
  });

  return { accessToken, refreshToken: newRefreshToken };
};

export const logoutUser = async (refreshToken) => {
  await Session.deleteOne({ refreshToken });
};
