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

module.exports = router;
