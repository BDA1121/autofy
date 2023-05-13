require("dotenv").config({ path: "../env/.env" });
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose")
const createJWT = async (user) => {
  return jwt.sign(
    {
      name: user.name,
      id: user._id,
      userType :user.userType
    },
    process.env.LOGIN_TOKEN_KEY,
  );
};

const verifyJWTDriver = (req, res, next) => {
  try {
    const token = req.headers['authorization'];
    if (!token) {
      return res.status(400).json({ message: "No token" });
    }
    jwt.verify(token, process.env.LOGIN_TOKEN_KEY, async (err, decoded) => {
      req.jwt_payload = decoded;

      if (err) {
        return res.status(400).json({
          message: "An unexpected error has occured! Please login again.",
        });
      }
      if (!mongoose.Types.ObjectId.isValid(decoded.id))
        return res.status(400).json({ message: "Invalid token" });
      if(!decoded.userType)
        return res.status(400).json({ message:"Unauthorized"})
      return next();
    });

    return null;
  } catch (err) {
    res.status(500).json({ message: "Server Error. Try again later" });
  }
};
const verifyJWTUser = (req, res, next) => {
    try {
        const token = req.headers['authorization'];
      if (!token) {
        return res.status(400).json({ message: " No token" });
      }
      jwt.verify(token, process.env.LOGIN_TOKEN_KEY, async (err, decoded) => {
        req.jwt_payload = decoded;
  
        if (err) {
          return res.status(400).json({
            message: "An unexpected error has occured! Please login again.",
          });
        }
        if (!mongoose.Types.ObjectId.isValid(decoded.id))
          return res.status(400).json({ message: "Invalid token" });
        if(decoded.userType)
            return res.status(400).json({ message:"Unauthorized"})
      
        return next();
      });
  
      return null;
    } catch (err) {
      return res.status(500).json({ message: "Server Error. Try again later" });
    }
  };
module.exports = { createJWT, verifyJWTUser,verifyJWTDriver };