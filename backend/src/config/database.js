const knex = require('knex');
const path = require('path');
const knexfile = require(path.join(__dirname, '../../knexfile'));

const environment = process.env.NODE_ENV || 'development';
const config = knexfile[environment];

module.exports = knex(config);
