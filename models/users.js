  const mongoose = require('mongoose');

  const UserSchema = new mongoose.Schema({
  username: {type:String, unique:true,lowercase: true },
  password: String,
  admin:{type:String, default:false}
  });

  module.exports = mongoose.model('User', UserSchema)
