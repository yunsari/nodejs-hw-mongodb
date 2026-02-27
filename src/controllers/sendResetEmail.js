import createHttpError from 'http-errors';
import { User } from '../db/models/user.js';
import { transporter } from '../services/email.js';
import { createResetToken } from '../utils/createResetToken.js';

export const sendResetEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const token = createResetToken(email);

  const resetLink =
    `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Password reset',
      html: `
        <h3>Password Reset</h3>
        <p>Click link below:</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    });
  } catch (err) {
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
};