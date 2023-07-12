require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const logger = require('morgan');
const compression = require('compression');
const dbConfig = require('./app/config/mongodb.config');
const nocache = require('nocache');

app.use(nocache());
app.use(cors());
// logger
app.use(logger('short'));
// MethodOverride
app.use(methodOverride('_method'));

// BodyParser Middleware
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));
app.use(express.json());
app.use(compression());

// handel favicon request
function ignoreFavicon(req, res, next) {
  if (req.originalUrl.includes('favicon.ico')) {
    res.status(204).end();
  }
  next();
}
app.use(ignoreFavicon);

// ROUTES
const hit = require('./app/routes/hit.routes');
const count = require('./app/routes/count.routes');

app.use('/hit', hit);
app.use('/count', count);

// Configure DB
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const url = dbConfig.live_url;
const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log('Connected to MongoDB.');
    /* test_data.initial_testData(); */
  } catch (err) {
    console.error('db', { message: err.message, url });
    process.exit(1);
  }
};
// Connecting to the database
connectDB();

module.exports = app;
