import Joi from 'joi';
import { emailRegexp } from '../constants/users.js';

export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(3).required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(3).required(),
});

export const sendResetSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPwdSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).required(),
});