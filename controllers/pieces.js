 const express = require('express');

 const router = express.Router();

 const Piece = require('../models/pieces.js');

 router.post('/', async (req, res) => {
   console.log('body data: ', req.body);
   try {
     const createdPiece = await Piece.create(req.body);
     res.redirect('/threads/' + createdPiece.thread);
     } catch (err) {
       req.session.body="Please Fill Out The Content Section!";
       res.redirect('/threads/' + req.body.thread);
     }
     });

     module.exports = router;
