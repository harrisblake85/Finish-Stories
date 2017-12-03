  const mongoose = require('mongoose');

  const UsersSchema = new mongoose.Schema({
  username: String,
  password: String
  });

  module.exports = mongoose.model('UsersSchema', UsersSchema)
