  const mongoose = require('mongoose');

 const threadSchema = mongoose.Schema({
   url: { type: String, require: true },
   submitted_by: String
 });

 module.exports = mongoose.model('Thread', threadSchema);
