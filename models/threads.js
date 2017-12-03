  const mongoose = require('mongoose');

 const threadSchema = mongoose.Schema({
   url: String,
   submitted_by: String
 });

 module.exports = mongoose.model('Thread', threadSchema);
