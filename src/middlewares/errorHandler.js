import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  const { status, message } = err;
  if (err instanceof HttpError) {
    res.status(status).json({
      status,
      message,
      data: err,
    });
    return;
  }
  res.status(500).json({
    message: 'Something went wrong',
    error: message,
  });
};