const Config = require('./Config');
const Express = require('express');
const ExpressUserAgent = require('express-useragent');

// Instantiate the Express
const App = Express();

// Allow JSON
App.use(Express.json());

// Add User Agent info support
App.use(ExpressUserAgent.express());

// Import routes using auto router
require('./Routes')('/Routes', App);

// TODO: Implement caching using https://www.npmjs.com/package/sequelize-simple-cache

App.listen(Config.Express.Port, () => console.log('Started on 3000'));

// Export for testing with Jest and Supertest
module.exports = App;