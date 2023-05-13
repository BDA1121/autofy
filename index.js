require('dotenv').config({ path: './src/env/.env' });

const cors = require('cors');
const express = require('express');
const app = express();
const port = process.env.APP_PORT;
const path = require('path');
require('./src/database/setup.js');

const apiRouter = require('./src/api/api');
const authRouter = require('./src/api/auth');

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

global.appRoot = path.resolve(__dirname);

app.use('/api', apiRouter);
app.use('/auth', authRouter);

app.listen(port, () => console.log(`server started at port ${port}`));