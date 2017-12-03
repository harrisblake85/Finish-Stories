  const express = require('express');
  const router = express.Router();
  const User   = require('../models/users.js');
  const bcrypt = require('bcrypt');


  router.get('/login', (req, res) => {
   res.render("threads/login.ejs");
  });

  router.post('/login', (req, res, next) => {

  User.findOne({username: req.body.username}, (err, user) => {

    if (user) {
       //now compare hash with the password from the form
       if (bcrypt.compareSync(req.body.password, user.password)) {
         req.session.message = '';
         req.session.username = req.body.username;
         req.session.logged  = true;
         console.log(req.session, req.body)

         res.redirect('/')
       } else {
        console.log('else in bcrypt compare')
        req.session.message = 'Username or password are incorrect';
        res.redirect('/user/login')
       }

    } else {
      req.session.message = 'Username or password are incorrect';
      res.redirect('/user/login')

    } //end of if user
  });
  });
  // at top of session.js

  router.post('/register', (req, res, next) => {
  // first we are going to hash the password
  const password = req.body.password;
  const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

  // lets create a object for our db entry;
  const userDbEntry = {};
  userDbEntry.username = req.body.username;
  userDbEntry.password = passwordHash

  // lets put the password into the database
  User.create(userDbEntry, (err, user) => {
   console.log(user)

   // lets set up the session in here we can use the same code we created in the login
   req.session.username = user.username;
   req.session.logged  = true;
   res.redirect('/')
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
