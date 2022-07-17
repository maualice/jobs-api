const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide valid email',
    ],
  },

  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
  },
});

UserSchema.pre('save', async function (next) {
  //middleware de mongoose que dice antes de guardar el documento hacé...
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next(); //segun documentacion,al usar async sacandole next funciona igual
});

/* UserSchema.methods.getName = function () {
  return this.name;
}; */

UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id, name: this.name }, 'jwtSecret', {
    expiresIn: '30d',
  });
};

module.exports = mongoose.model('User', UserSchema);
