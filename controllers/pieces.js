 const express = require('express');

 const router = express.Router();

 const Piece = require('../models/pieces.js');
 const Thread = require('../models/threads.js');

 router.post('/', async (req, res) => {

   const thethread = await Thread.findById(req.body.thread);
   if (thethread.lastuser!=req.body.id) {
     if (thethread.lastuser!=req.body.respondto) {

     console.log('body data: ', req.body);
     try {
       const createdPiece = await Piece.create(req.body);
       res.redirect('/threads/' + createdPiece.thread);
       } catch (err) {
         req.session.body="Please Fill Out The Content Section!";
         res.redirect('/threads/' + req.body.thread);
       }
       }
     }
     else {
       req.session.body="You cannot respond to this thread, you were the last one to reply, or someone already replied";
       res.redirect('/threads/' + req.body.thread);
     }
       });


     module.exports = router;
