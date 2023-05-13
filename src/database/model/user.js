const mongoose = require('mongoose');

module.exports = mongoose.model(
	'user',
	new mongoose.Schema({
		name: String,
		password: String,
		mobileNo: String,
		gender: String,
		email: String,
		userType: Boolean,
		licensePlate: String,
		activeRideId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'ride',
		},
	})
);