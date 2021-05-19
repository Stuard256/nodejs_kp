const user = require('../models/all')

const Sequelize = require('../config/db');

Sequelize.sync({force: true});