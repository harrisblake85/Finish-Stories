  const mongoose = require('mongoose');

 const threadSchema = mongoose.Schema({
   url: {type:String, default:"https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"},
   title: {type:String, default:"A Title"},
   start: String,
   views: Number,
   user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
   lastuser: {type: mongoose.Schema.Types.ObjectId, ref:'User'}
 });

 module.exports = mongoose.model('Thread', threadSchema);
