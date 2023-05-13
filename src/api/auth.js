const auth = require('express').Router();

require('dotenv').config({ path: '../../env/.env' });

const User = require('../database/model/user');
const bcrypt= require("bcrypt")
const {createJWT } = require("../helper/jwt")
auth.post('/register', async (req, res) => {
	try {
		const { name,password,mobileNo,gender,email,userType,licensePlate } = req.body;

		if(!name||!password||!mobileNo||!email){
            return res.status(400).json({message: "Enter all details"})
        }
        if(userType&&!licensePlate) return res.status(404).json({message: "Enter license plate number"})
        let pwd= await bcrypt.hash(password,10);
        const userExists = await User.findOne({email})
        if(userExists){
            return res.status(400).json({message:"User already exists"})
        }
		let user = await User.create({
			name,
			password:pwd,
			mobileNo,
			gender,
            email,
            userType,
            licensePlate

		});

		const token =await createJWT(user);
        return res.status(200).json({name,mobileNo, email,userType,licensePlate,token})
	} catch (err) {
		console.log(err);
		return res
			.status(500)
			.json({ message: 'Server error. Try again later' });
	}
});

auth.post('/login', async (req, res) => {
	try {
		const { email,password } = req.body;

		if (!email || !password)
			return res.status(401).json({
				message: 'Enter all details',
			});
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
				message: 'User not found',
			});
        }

        if(await bcrypt.compare(password,user.password)){
            const token = await createJWT(user)
            const {name,mobileNo,email,userType,licensePlate} = user
            return res.status(200).json({token,name,mobileNo,email,userType,licensePlate})
        }
        return res.status(400).json({message: "Incorrect Password"})
	} catch (err) {
		console.log(err);
		return res
			.status(500)
			.json({ message: 'Server error. Try again later' });
	}
});

module.exports = auth;