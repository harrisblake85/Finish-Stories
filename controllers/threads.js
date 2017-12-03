 const express = require('express');
 const router  = express.Router();

 // models
 const Thread = require('../models/threads.js');
 const Piece = require('../models/pieces.js');


 router.get('/', async (req, res) => {
  const allThreads = await Thread.find();

  if (req.session.logged) {
    res.render('threads/index.ejs', {
      threads: allThreads,
      username: req.session.username
    });
  } else {
    res.redirect('/user/login');
  }
 });

 // show route
 router.get('/:id', async (req, res) => {
  const oneThread = await Thread.findById(req.params.id);
  const pieces = await Piece.find({ thread: oneThread._id });

  res.render('threads/show.ejs', {
    oneThread: oneThread,
    pieces: pieces
 });
 });

 // create route
 router.post('/', async (req, res) => {
  try {
    const createdThread = await Thread.create(req.body);
    res.redirect('/');
  } catch (err) {
    res.send(err.message);
  }
 });

 module.exports = router;
