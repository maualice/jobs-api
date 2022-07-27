//const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const auth = async (req, res, next) => {
  //check header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Authentication invalid');
  }
  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    //attach the user to the job routes

    /* const user = User.findById(payload.id).select('-password');
    req.user = user; //se podria hace esto en vez de crear el objeto abajo,pero al no tener funcionalidad para borrar el usuario no tiene sentido hacer esta busqueda */

    req.user = { userId: payload.userId, name: payload.name };
    next(); //sin esto terminaria aca ,y no se podria sar las rutas de job
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid');
  }
};

module.exports = auth;
