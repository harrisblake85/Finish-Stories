const mongoose = require('mongoose');

const pieceSchema = mongoose.Schema({
  url: String,
  content: { type: String, required: true },
  thread: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread'},
  user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  respondto:{type: mongoose.Schema.Types.ObjectId, ref:'User'}
});

module.exports = mongoose.model('Piece', pieceSchema);
