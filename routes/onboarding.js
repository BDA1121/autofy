const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
// const tempOwener = require('../models/rider');
const path = require('path');
// const router = express.Router();
const authController = require('../controllers/authController')
// const helper = require('../helper/helper');
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));

// const verifyToken = require('../middleware/verifyTocken');


// var db = mongoose.connection;

// db.on("error", console.error.bind(console, "connection error"));
// db.once("open", function (callback) {
//   console.log("Connection succeeded.");
// });


//////////multer config//////////
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + '/uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  }
});

var upload = multer({
  storage: storage
});

//Register
router.use("/",(req, res,next) => {
  console.log('This is a middleware function.');
  next();
});
router.post('/register', authController.userSignUp);

router.get('/your-route', (req, res) => {
  console.log('hi')
  const data = { message: 'Hello', name: 'John' };
  res.send(data);
});
//login 

router.post('/login', authController.userLogIn);

router.post('/signUp', authController.userSignUp);

exports.router = router;