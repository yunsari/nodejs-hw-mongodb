import {
  loginUser,
  logoutUser,
  refreshUsersSession,
  registerUser,
} from '../services/auth.js';

import createHttpError from 'http-errors';
import { sendEmail } from '../utils/sendEmail.js';
import { UsersCollection } from '../db/models/user.js';
import env from '../utils/env.js';

export const sendResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await UsersCollection.findOne({ email });
    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    const token = jwt.sign({ email }, env('JWT_SECRET'), { expiresIn: '15m' });

    const resetUrl = `${env('APP_DOMAIN')}/reset-password?token=${token}`;

    const mailResult = await sendEmail({
      to: email,
      subject: 'Reset your password',
      html: `<a href="${resetUrl}">Click here to reset your password</a>`,
    });

    if (!mailResult.accepted || mailResult.accepted.length === 0) {
      throw createHttpError(
        500,
        'Failed to send the email, please try again later.'
      );
    }

    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token) {
      throw createHttpError(400, 'Token is required');
    }

    let payload;
    try {
      payload = jwt.verify(token, env('JWT_SECRET'));
    } catch (err) {
      throw createHttpError(401, 'Token is expired or invalid.');
    }

    const user = await User.findOne({ email: payload.email });
    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    user.tokens = []; await user.save();

    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

export const registerUserController = async (req, res) => {
  const { body } = req;
  const user = await registerUser(body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user',
    data: user,
  });
};

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken: session.accessToken },
  });
};

export const refreshUserSessionController = async (req, res) => {
  const session = await refreshUsersSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    console.log(req.cookies.sessionId);
    await logoutUser(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};