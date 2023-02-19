//const { CustomAPIError } = require('../errors');
const { StatusCodes } = require('http-status-codes');
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    //set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again',
  };

  /* if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  } */ //no es necesario ya que funciona igual al crear customError

  if (err.name === 'ValidationError') {
    //console.log(Object.values(err.errors));
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(',');
    customError.statusCode = 400;
  } //err.errors necesita de object.values para que forme el array de valores y asi poder usar map

  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field,please choose another value`;
    customError.statusCode = 400;
  }

  if (err.name === 'CastError') {
    customError.msg = `No item found with id : ${err.value}`;
    customError.statusCode = 404;
  }
  //return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })   //para ver el objeto error completo que devulve mongoose
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
