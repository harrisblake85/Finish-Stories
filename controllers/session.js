  const express = require('express');
  const router = express.Router();
  const User   = require('../models/users.js');
  const bcrypt = require('bcrypt');

  router.get('/', async (req, res) => {
    const allUsers = await User.find();
    console.log(allUsers);
   res.send({users:allUsers});
  });

  router.get('/login', (req, res) => {
   res.render("threads/login.ejs",{message:req.session.message});
  });

  router.get('/deleteall', async (req, res) => {
    const allUser = await User.remove();
    res.redirect("/threads/");
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
         console.log(req.session, req.body)

         res.redirect('/threads')
       } else {
        console.log('else in bcrypt compare')
        req.session.message = 'Username or password are incorrect';
        res.redirect('/user/login')
       }

    } else {
      req.session.message = 'Username or password are incorrect';
      res.redirect('/user/login')

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
  userDbEntry.password = passwordHash

  // lets put the password into the database

  User.create(userDbEntry, (err, user) => {
    if (err) {
      console.log(err);
      req.session.message="Username already taken!"
      res.redirect('/user/login')
    }
    else {
      console.log(user)
      req.session.username = user.username;
      req.session.logged  = true;
      res.redirect('/')
    }

  });
  })

  router.get('/update',  (req, res) => { //any route will work
  	req.session.username = 'something';
   console.log(req.session);
   res.redirect("/threads/")
  });

  router.get('/logout', (req, res) => {
   req.session.destroy();
   res.redirect('/');
  });

  // export the controller
  module.exports = router;
