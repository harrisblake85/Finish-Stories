const mongoose = require('mongoose');

const pieceSchema = mongoose.Schema({
  author: String,
  content: { type: String, required: true },
  thread: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread'}
});

module.exports = mongoose.model('Piece', pieceSchema);
