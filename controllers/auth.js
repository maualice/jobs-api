const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

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
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token }); //name: user.getName()
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  } //sin esto,si viene un pass vacio,en comparePass arrojaria un error,pero estaria vacio ya que no se esta manejando

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials');
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials');
  }

  //compare password
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = {
  login,
  register,
};
