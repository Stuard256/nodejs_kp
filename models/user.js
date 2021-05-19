const Sequelize = require('sequelize');
const db = require('../config/db');

let user = db.define('user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nick: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    level: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    avatar: {
        type: Sequelize.STRING,
        allowNull: true,
    }
}, {
    indexes: [{
        unique: true,
        fields: ['email']
    }]
});

module.exports = user;