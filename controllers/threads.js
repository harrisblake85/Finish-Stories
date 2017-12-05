const express = require('express');
const router  = express.Router();

// models
const Thread = require('../models/threads.js');
const Piece = require('../models/pieces.js');
const User = require('../models/users.js');


router.get('/', async (req, res) => {
  const allThreads = await Thread.find();
  const changes= req.session.changes;
  req.session.changes="";

  if (req.session.logged) {
    res.render('threads/index.ejs', {
      threads: allThreads,
      username: req.session.username,
      changes:changes

    });
  } else {
    res.render('threads/index.ejs', {
      threads: allThreads,
      username:null,
      changes:changes
    });
  }

});
router.get('/new', async (req, res) => {

  const aUser = await User.findOne({username: req.session.username});
  if (aUser) {
    res.render('threads/new.ejs', {user:aUser});
  }
  else {
    req.session.message="You must login or register to make a new thread!"
    res.redirect("/user/login");
  }
});

//delete all
router.get('/deleteall', async (req, res) => {
  const allThreads = await Thread.remove();
  const allPieces = await Piece.remove();
  res.redirect("/threads/");
});


//delete

router.delete('/:id', async (req, res) => {
  const thethread = await Thread.findById(req.params.id);
  const currentuser = await User.findOne({username: req.session.username});
  const admin = await User.findOne({username: "admin"});

  if (currentuser.id==thethread.user||currentuser.id==admin.id) {
    const thread = await Thread.findByIdAndRemove(req.params.id);
    await Piece.remove({ thread: thread._id });
    req.session.changes="Successfully Deleted Story Thread";
    res.redirect("/threads/");

  }

  else {
    req.session.changes="Cannot Delete Story Thread, not logged into correct account!";
    res.redirect("/threads/");
  }

});

router.put('/:id/', async (req, res) => {
  const thethread = await Thread.findById(req.params.id);
  const currentuser = await User.findOne({username: req.session.username});
  const admin = await User.findOne({username: "admin"});

  if (currentuser.id==thethread.user||currentuser.id==admin.id) {
    await Thread.findByIdAndUpdate(req.params.id,req.body);
    req.session.changes="Changes To Story Thread Successful";
    res.redirect("/threads/");
  }

  else {
    req.session.changes="Cannot Change Story Thread, not logged into correct account!";
    res.redirect("/threads/");
  }
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
  const starterid=oneThread.user;
  const startuser = await User.findById(starterid);
  const pieces = await Piece.find({ thread: oneThread._id });
  const currentuser = await User.findOne({username: req.session.username});

  res.render('threads/show.ejs', {
    oneThread: oneThread,
    pieces: pieces,
    currentuser:currentuser,
    startuser:startuser,
    body:req.session.body
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
