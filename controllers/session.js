  const express = require('express');
  const router = express.Router();
  const User   = require('../models/users.js');
  const Thread = require('../models/threads.js');
  const bcrypt = require('bcrypt');

  router.get('/', async (req, res) => {
    if (req.session.username) {

    }
    else {
      req.session.username = "unlogged";
    }
    const currentuser = await User.findOne({username: req.session.username});
    const allUsers = await User.find();
    console.log(allUsers);
   res.render("users/index.ejs",
   {users:allUsers,currentuser});
  });

  router.get('/login', async (req, res) => {
    const currentuser = await User.findOne({username: req.session.username});
    const message = req.session.message;
    req.session.message= "";
   res.render("users/login.ejs",{message:message,currentuser:currentuser});
  });

  router.get('/register', async (req, res) => {
    const currentuser = await User.findOne({username: req.session.username});
    const message = req.session.message;
    req.session.message= "";
   res.render("users/register.ejs",{message:message,currentuser:currentuser});
  });

  router.get('/logout', (req, res) => {
   req.session.destroy();
   res.redirect('/');
  });

  // router.get('/update',  (req, res) => { //any route will work
  // 	req.session.username = 'something';
  //  console.log(req.session);
  //  res.redirect("/threads/")
  // });

  router.get('/deleteall', async (req, res) => {

    try {
      const currentuser = await User.findOne({username: req.session.username});
      if (currentuser.admin===true) {
        const allUser = await User.remove({admin:false});
        req.session.changes="Successfully Deleted All Users";
        res.redirect("/users/");
      }
      else {
        req.session.changes="Cannot Delete All Users, Not an Admin";
        res.redirect("/users/");
      }
    } catch (e) {
      req.session.changes="Cannot Delete All Users, Not Logged In";
      res.redirect("/users/");
    }
    res.redirect("/users/");
  });

  //delete method (comes from delete button)
  router.delete('/:id', async (req, res) => {
    const theuser = await User.findById(req.params.id);
    try {
      const currentuser = await User.findOne({username: req.session.username});
      //deletes user and any threads they have along with pieces inside of them
      if (currentuser.id==theuser.id||currentuser.admin===true) {
        const user = await User.findByIdAndRemove(req.params.id);
        const userthreads=await Thread.remove({ user: user._id });
        for (thread0 of userthreads) {
          let deletepiece = await Piece.remove({thread:thread0});
        }

        req.session.changes="Successfully Deleted User";
        res.redirect("/users/");
      }

      else {
        req.session.changes="Cannot Delete User, not logged into correct account!";
        res.redirect("/users/");
      }
    } catch (e) {
      req.session.changes="Cannot Delete User, not logged into any account!";
      res.redirect("/users/");
    }

  });
//edit put route
  router.put('/:id/', async (req, res) => {
    const theuser = await User.findById(req.params.id);
    try {
      const currentuser = await User.findOne({username: req.session.username});

      if (currentuser.id==theuser.id||currentuser.admin===true) {
        const password = req.body.password;
        const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        req.body.password=passwordHash;
        await User.findByIdAndUpdate(req.params.id,req.body);
        req.session.changes="Changes To User Profile Successful";
        res.redirect("/users/");
      }

      else {
        req.session.changes="Cannot Change User Profile, not logged into correct account!";
        res.redirect("/users/");
      }
    } catch (e) {
      req.session.changes="Cannot Change User Profile, not logged into any account!";
      res.redirect("/users/");
    }

  });

  //edit get
  router.get('/:id/edit', async (req, res) => {
    const currentuser = await User.findOne({username: req.session.username});
    res.render('users/edit.ejs', {
      user: await User.findById(req.params.id),
      id: req.params.id,
      currentuser:currentuser

    });
  });


  router.get('/:id', async (req, res) => {

    const thisUser = await User.findById(req.params.id);
    const userthreads = await Thread.find({user:thisUser.id});
    console.log(thisUser);
    try {
      const currentuser = await User.findOne({username: req.session.username});
      console.log("current user:");
      console.log(currentuser);
      res.render("users/show.ejs",
      {user:thisUser,
      userthreads:userthreads,
      currentuser:currentuser});
    } catch (e) {
      const currentuser = null;
      res.render("users/show.ejs",
      {user:thisUser,
      userthreads:userthreads,
      currentuser:currentuser});
    }


  });


  router.post('/login', async (req, res) => {
  req.body.username=req.body.username.toLowerCase();
  const aUser = await User.findOne({username: req.body.username});
    if (aUser) {
       //now compare hash with the password from the form
       if (bcrypt.compareSync(req.body.password, aUser.password)) {
         req.session.message = '';
         req.session.username = req.body.username;
         req.session.logged  = true;
         req.session.session  = "";
         // console.log(req.session, req.body)

         res.redirect('/threads')
       } else {
        console.log('else in bcrypt compare')
        req.session.message = 'Username or password are incorrect';
        res.redirect('/users/login')
       }

    } else {
      req.session.message = 'Username or password are incorrect';
      res.redirect('/users/login')

    }
  });
  // at top of session.js

  router.post('/register', (req, res) => {
  // first we are going to hash the password
  const password = req.body.password;
  const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

  // lets create a object for our db entry;
  const userDbEntry = {};
  userDbEntry.username = req.body.username;
  userDbEntry.password = passwordHash;
  // lets put the password into the database

  User.create(userDbEntry, (err, user) => {
    if (err) {
      console.log(err);
      req.session.message="Username/Password is too short or username is already taken! Use the log in page if it is your profile."
      res.redirect('/users/register')
    }
    else {
      console.log(user)
      req.session.username = user.username;
      req.session.logged  = true;
      req.session.message  = "";
      res.redirect('/')
    }

  });
});


  // export the controller
  module.exports = router;
