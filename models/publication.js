const Sequelize = require('sequelize');
const db = require('../config/db');

let model = db.define('publication', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    published: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    reviewed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    indexes: [{
        unique: false,
        fields: ['userId']
    }]
});

module.exports = model;