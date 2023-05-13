const api = require('express').Router();

require('dotenv').config({ path: '../../env/.env' });
const User = require('../database/model/user');
const Ride = require('../database/model/rides');
const { verifyJWTUser,verifyJWTDriver } = require("../helper/jwt")
api.post('/initiate',verifyJWTUser, async (req, res) => {
	try {
		const { source,destination,scheduleTiming } = req.body;
        const {id} = req.jwt_payload
		if(!source||!destination||!scheduleTiming){
            return res.status(400).json({message: "Enter all details"})
        }
        const ride = await Ride.findOne({source,destination,scheduleTiming})
        if(ride){
            return res.status(200).json({message: "Ride already exists"})
        }
		let rideNew = await Ride.create({
			source,destination,scheduleTiming,userId:[id],noOfRiders:1  

		});
        return res.status(200).json({message:"Successfully created ride request"})
	} catch (err) {
		console.log(err.message);
		return res
			.status(500)
			.json({ message: 'Server error. Try again later' });
	}
});

api.post('/accept',verifyJWTDriver, async (req, res) => {
	try {
		const { rideId } = req.body;
        const driverId = req.jwt_payload.id

		if(!rideId){
            return res.status(400).json({message: "Enter all details"})
        }
        const ride = await Ride.findById(rideId);
        if(!ride){
            return res.status(404).json({message:"Ride does not exist"})
        }
        ride.status = true
        ride.riderId = driverId
        await ride.save()
        return res.status(200).json({message:"Successfully accepted ride"})
	} catch (err) {
		console.log(err.message);
		return res
			.status(500)
			.json({ message: 'Server error. Try again later' });
	}
});

api.post('/join',verifyJWTUser, async (req, res) => {
	try {
		const { rideId } = req.body;
        const userId =  req.jwt_payload.id

		if(!rideId){
            return res.status(400).json({message: "Enter all details"})
        }
        const ride = await Ride.findById(rideId);
        if(!ride){
            return res.status(404).json({message:"Ride does not exist"})
        }
        ride.noOfRiders +=1;
        ride.userId.push(userId);
        await ride.save()
        return res.status(200).json({message:"Successfully joined ride"})
	} catch (err) {
		console.log(err.message);
		return res
			.status(500)
			.json({ message: 'Server error. Try again later' });
	}
});

api.get('/allRides', async (req, res) => {
	try {

        const rides = await Ride.find().select(['source','destination','status','noOfRiders','scheduleTiming','_id']);
        return res.status(200).json({rides})
	} catch (err) {
		console.log(err.message);
		return res
			.status(500)
			.json({ message: 'Server error. Try again later' });
	}
});
api.get('/rides',verifyJWTUser, async (req, res) => {
	try {
        const userId = req.jwt_payload.id
        const rides = await Ride.find({
            userId:{$in:[userId]}
        }).select(['source','destination','status','noOfRiders','scheduleTiming']);
        return res.status(200).json({rides})
	} catch (err) {
		console.log(err.message);
		return res
			.status(500)
			.json({ message: 'Server error. Try again later' });
	}
});
api.get('/userDetails',verifyJWTUser, async (req, res) => {
	try {
        const userId = req.jwt_payload.id
        const userDet = await User.find({
            _id:{$in:[userId]}
        });
        return res.status(200).json({userDet})
	} catch (err) {
		console.log(err.message);
		return res
			.status(500)
			.json({ message: 'Server error. Try again later' });
	}
});
module.exports = api;