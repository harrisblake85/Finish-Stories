  const mongoose = require('mongoose');

  const userSchema = new mongoose.Schema({
  username: {type:String, unique:true,lowercase: true,default:"username", minlength:2, maxlength:16},
  password: {type:String, default:"password", minlength:2},
  admin:{type:Boolean, default:false},
  url: {type:String, default:"https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"}
  });

  module.exports = mongoose.model('User', userSchema)
