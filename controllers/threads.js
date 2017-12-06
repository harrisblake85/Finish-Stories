const express = require('express');
const router  = express.Router();

// models
const Thread = require('../models/threads.js');
const Piece = require('../models/pieces.js');
const User = require('../models/users.js');

router.get('/', async (req, res) => {
  const currentuser = await User.findOne({username: req.session.username});
  const allThreads = await Thread.find();
  //sort threads by the most views
  //https://stackoverflow.com/questions/8837454/sort-array-of-objects-by-single-key-with-date-value
  allThreads.sort( (a, b) => {
    let keyA = b.views,
        keyB = a.views;
    // Compare the 2 dates
    if(keyA < keyB) return -1;
    if(keyA > keyB) return 1;
    return 0;
});
  let changes= req.session.changes;
  req.session.changes="";

  if (req.session.logged) {
    res.render('threads/index.ejs', {
      threads: allThreads,
      username: req.session.username,
      changes:changes,
      currentuser:currentuser

    });
  } else {
    res.render('threads/index.ejs', {
      threads: allThreads,
      username:null,
      changes:changes,
      currentuser:currentuser
    });
  }

});
router.get('/new', async (req, res) => {

  const aUser = await User.findOne({username: req.session.username});
  if (aUser) {
    res.render('threads/new.ejs', {currentuser:aUser});
  }
  else {
    req.session.message="You must login or register to make a new thread!"
    res.redirect("/users/login");
  }
});

//delete all
router.get('/deleteall', async (req, res) => {
  try {
    const currentuser = await User.findOne({username: req.session.username});
    if (currentuser.admin===true) {
      const allThreads = await Thread.remove();
      const allPieces = await Piece.remove();
      req.session.changes="Successfully Deleted All Story Threads";
      res.redirect("/threads/");
    }
    else {
      req.session.changes="Cannot Delete All Story Threads, Not an Admin";
      res.redirect("/threads/");
    }
  } catch (e) {
    req.session.changes="Cannot Delete All Story Threads, Not Logged In";
    res.redirect("/threads/");
  }

});

//delete method (comes from delete button)
router.delete('/:id', async (req, res) => {
  const thethread = await Thread.findById(req.params.id);
  try {
    const currentuser = await User.findOne({username: req.session.username});

    if (currentuser.id==thethread.user||currentuser.admin===true) {
      const thread = await Thread.findByIdAndRemove(req.params.id);
      await Piece.remove({ thread: thread._id });
      req.session.changes="Successfully Deleted Story Thread";
      res.redirect("/threads/");
    }

    else {
      req.session.changes="Cannot Delete Story Thread, not logged into correct account!";
      res.redirect("/threads/");
    }
  } catch (e) {
    req.session.changes="Cannot Delete Story Thread, not logged into any account!";
    res.redirect("/threads/");
  }

});

router.put('/:id/', async (req, res) => {
  const thethread = await Thread.findById(req.params.id);
  const admin = await User.findOne({username: "admin"});
  try {
    const currentuser = await User.findOne({username: req.session.username});

    if (currentuser.id==thethread.user||currentuser.admin===true) {
      await Thread.findByIdAndUpdate(req.params.id,req.body);
      req.session.changes="Changes To Story Thread Successful";
      res.redirect("/threads/");
    }

    else {
      req.session.changes="Cannot Change Story Thread, not logged into correct account!";
      res.redirect("/threads/");
    }
  } catch (e) {
    req.session.changes="Cannot Change Story Thread, not logged into any account!";
    res.redirect("/threads/");
  }

});

//edit get
router.get('/:id/edit', async (req, res) => {
  const currentuser = await User.findOne({username: req.session.username});
  res.render('threads/edit.ejs', {
    athread: await Thread.findById(req.params.id),
    id: req.params.id,
    currentuser:currentuser

  });
});


// show route
router.get('/:id', async (req, res) => {
  const thethread = await Thread.findById(req.params.id);
  const oneThread = await Thread.findByIdAndUpdate(req.params.id, {views:thethread.views+=1});
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
  const currentuser = await User.findOne({username: req.session.username});
  req.session.changes="Attempting to create your Story Thread!"
  if (currentuser) {
    try {
      const createdThread = await Thread.create(req.body);
      //
      res.redirect('/');
    } catch (err) {
      res.redirect('/');
    }
  }

});

module.exports = router;
