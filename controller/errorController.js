const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;

  return new AppError(message, 400);
};

const handleDuplicateFieldsDb = ({ message }) => {
  const value = message.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const errMessage = `duplicate field value ${value}: please enter a different value`;
  return new AppError(errMessage, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data: ${errors.join('. ')}`;

  return new AppError(message, 400);
};

const handleJwtError = () =>
  new AppError('Invalid token please login again', 401);

const handleTokenExpiredError = () => new AppError('token expired', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational trusted error
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // programming or other unkown errors don't leak details to users
  } else {
    // 1 - log error
    console.log('Error 🍟', err);

    // Send general message
    res.status(500).json({
      status: 'error',
      message: 'something went wrong',
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // let error = { ...err };
    if (err.name === 'CastError') err = handleCastErrorDB(err);
    if (err.code === 11000) err = handleDuplicateFieldsDb(err);
    if (err.name === 'ValidationError') err = handleValidationError(err);
    if (err.name === 'JsonWebTokenError') err = handleJwtError();
    if (err.name === 'TokenExpiredError') err = handleTokenExpiredError();

    sendErrorProd(err, res);
  }
};

module.exports = globalErrorHandler;
