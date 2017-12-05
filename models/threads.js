  const mongoose = require('mongoose');

 const threadSchema = mongoose.Schema({
   url: String,
   title: String,
   start: String,
   views: Number,
   user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
   lastuser: {type: mongoose.Schema.Types.ObjectId, ref:'User'}
 });

 module.exports = mongoose.model('Thread', threadSchema);
