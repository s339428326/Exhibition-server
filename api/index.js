const app = require('../src/app');
const mongoDB = require('./mongoDB');
mongoDB();
module.exports = app;
