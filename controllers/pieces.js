 const express = require('express');

 const router = express.Router();

 const Piece = require('../models/pieces.js');

 router.post('/', async (req, res) => {
   console.log('body data: ', req.body);
   try {
     const createdPiece = await Piece.create(req.body);
     res.redirect('/threads/' + createdPiece.thread);
     } catch (err) {
       res.send(err.message);
     }
     });

     module.exports = router;
