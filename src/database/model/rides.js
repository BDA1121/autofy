const mongoose = require('mongoose');

module.exports = mongoose.model(
	'ride',
	new mongoose.Schema({
		source: String,
		destination: String,
		status: Boolean,
		noOfRiders: Number,
		riderId: {
            type: mongoose.Schema.Types.ObjectId,
			ref: 'user',
        },
        userId:[{
            type: mongoose.Schema.Types.ObjectId,
			ref: 'user',
        }],
        scheduleTiming: Date,
		
	})
);