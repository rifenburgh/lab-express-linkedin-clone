const express               = require('express');
const router                = express.Router();
const User                  = require('../models/user.js');
const bcrypt                = require('bcrypt');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'W5D2E2 - LinkedIn' });
});

router.get('/signup', (req, res, next) => {
  res.render('authentication/signup.ejs');
});
router.post('/signup', (req, res, next) => {
  console.log("Signup Post Started");
  const username            = req.body.username;
  const password            = req.body.password;
  const name                = req.body.name;
  const email               = req.body.email;

  //Check for blank username OR password
  //Check for duplicate usernames
  const errorMessage = false;
  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);
  const userInfo = {
    username: username,
    password: hashPassword,
    name: name,
    email: email
  };
  const newUser = new User(userInfo);
  newUser.save((err) => {
    if(err) {
      res.render('authentication/signup.ejs', {
        errorMessage: "Unable to Login, the internet broke."
      });
      return;
    }
    res.redirect('/');
  });
});
router.get('/login', (req, res, next) => {
  res.render('authentication/login.ejs');
});
router.post('/post', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.passowrd;

  if (username === '' || password === '') {
    res.render('authentication/login.ejs', {
      errorMessage: 'Username/Password cannot be blank.'
    });
  }
  User.findOne({username: username}, (err, user) => {
    if (err) {
      next(err);
      return;
    }
    if (!user) {
      res.render('authentication/login.ejs', {
        errorMessage: 'The username does not exist.'
      });
      return;
    }
    if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      res.redirect('/');
    } else {
      res.render('authentication/login.ejs', {
        errorMessage: 'The password is incorrect.'
      });
    }
  });
});
module.exports = router;
