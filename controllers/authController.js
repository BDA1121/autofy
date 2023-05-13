const User = require("../models/user");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Define user model

// Secret key for JWT
const secretKey = 'mysecretkey';

// Signup endpoint
const userSignUp = (req, res) => {
  console.log(req.body)
  const { username, password } = req.body;
  
  // Check if username is taken
  User.findOne({ username }, (err, existingUser) => {
    if (err) {
      console.log(err)
      console.log()
      return res.status(500).send('Internal server error3');
    }

    if (existingUser) {
      return res.status(409).send('Username is already taken');
    }

    // Hash password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).send('Internal server error1');
      }

      // Create new user
      const newUser = new User({ username, password: hashedPassword });
      newUser.save((err, savedUser) => {
        if (err) {
          console.log(err+'s')
          return res.status(500).send('Internal server error2');
        }
        console.log(password+'--'+hashedPassword)
        res.send('User created successfully');
      });
    });
  });
};

// Login endpoint
const userLogIn = (req, res) => {
  const { username, password } = req.body;

  // Find user by username
  User.findOne({ username }, (err, user) => {
    if (err) {
      return res.status(500).send('Internal server error');
    }

    if (!user) {
      return res.status(401).send('Invalid username or password');
    }
    console.log(user)
    // Compare password with hashed password
    bcrypt.compare(user.password,password, (err, result) => {
      if (err) {
        return res.status(500).send('Internal server error');
      }

      if (!result) {
        return res.status(401).send('Invalid username or password');
      }

      // Generate JWT
      const token = jwt.sign({ id: user._id, username: user.username }, secretKey);

      // Return JWT in response
      res.send({ token });
    });
    // bcrypt.hash(password, 10, (err, hashedPassword) => {
    //   if (err) {
    //     return res.status(500).send('Internal server error');
    //   }
    //   if(hashedPassword == user.password){
    //     const token = jwt.sign({ id: user._id, username: user.username }, secretKey);

    //     // Return JWT in response
    //     res.send({ token });
    //   }
    //   else{
    //     return res.status(401).send(hashedPassword+user.password);
    //   }
    //   // Create new user
      
    // });
  });
};

// Protected endpoint
// app.get('/protected', authenticateToken, (req, res) => {
//   res.send('Protected endpoint');
// });

// Middleware for authenticating JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).send('Unauthorized');
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).send('Forbidden');
    }

    req.user = user;
    next();
  });
}

exports.userSignUp = userSignUp;
exports.userLogIn = userLogIn;
