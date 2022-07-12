const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
  /* const { name, email, password } = req.body;

  const salt = await bcrypt.genSalt(10); // numero de round que se usaran para el hash,mayor es mejor,pero mayor tiempo de procesamiento
  const hashedPassword = await bcrypt.hash(password, salt);

  const tempUser = { name, email, password: hashedPassword }; //password tiene el valor de hashedPassword,pero si hago console.lg de password no aparece el hash,sino lo que viene de req.body?
  //console.log(tempUser); 

  const user = await User.create({ ...tempUser });
  res.status(StatusCodes.CREATED).json({ user });*/
  //todo esto se puede sacar al usar middleware pre de mongoose
  const user = await User.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ user });
};

const login = async (req, res) => {
  res.send('login user');
};

module.exports = {
  login,
  register,
};
