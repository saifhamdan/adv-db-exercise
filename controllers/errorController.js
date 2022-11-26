const AppError = require('../utils/appError');

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

// validation error handler
const handleValidationErrorDB = (err) => {
  return new AppError(err, 400);
};

// duplicate key error handler
const handleDuplicateKeyError = (err, req, res) => {

  const message = `Duplicate error field '${Object.keys(err.keyValue)[0]}' value '${Object.values(err.keyValue)[0]
    }' please use another value`;

  return new AppError(message, 400);
};

// development mode error handling
const developmentErrorHandler = (err, req, res, next) => {
  if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/downloads')) {
    console.error('ERROR 💥', err);
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/downloads')) {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error('ERROR 💥', err);
    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    developmentErrorHandler(err, req, res, next);
  } else if (process.env.NODE_ENV === 'production') {
    // validation error handler
    if (err._message) err = handleValidationErrorDB(err);

    // duplicate key error handler
    if (err.code === 11000) err = handleDuplicateKeyError(err);

    if (err.name === 'JsonWebTokenError') err = handleJWTError();
    if (err.name === 'TokenExpiredError') err = handleJWTExpiredError();

    sendErrorProd(err, req, res);
  }
};
