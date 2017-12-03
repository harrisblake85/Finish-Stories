const express = require('express');
const router  = express.Router();
//seed
const seed = require('../models/seed.js');
const seedpieces = require('../models/seedpieces.js');
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
router.get('/new', async (req, res) => {
  res.render('threads/new.ejs', {session:req.session});
});

//delete all
router.get('/deleteall', async (req, res) => {
  const allThreads = await Thread.remove();
  const allPieces = await Piece.remove();
  res.redirect("/threads/");
});

//seed
router.get('/seed', async (req, res) => {
  const seed1 = await Thread.create(seed);
  const seed2 = await Piece.create(seedpieces);
  res.redirect("/threads/");
});

//delete

router.delete('/:id', async (req, res) => {
  const thread = await Thread.findByIdAndRemove(req.params.id);
  res.redirect("/threads/");
  await Piece.remove({ thread: thread._id });
});
router.put('/:id/', async (req, res) => {
  await Thread.findByIdAndUpdate(req.params.id,req.body);
  res.redirect("/threads/");
});

//edit get
router.get('/:id/edit', async (req, res) => {
  res.render('threads/edit.ejs', {
    athread: await Thread.findById(req.params.id),
    id: req.params.id
  });
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
