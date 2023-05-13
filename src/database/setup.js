require('dotenv').config({ path: './src/env/.env' });
const mongoose = require('mongoose');

// checking connection to db
mongoose.connect(process.env.DATABASE_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (error) => console.log(error.message));
db.once('open', () => console.log('connected to database'));