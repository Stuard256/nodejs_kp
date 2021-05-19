const Sequelize = require('sequelize');
const db = require('../config/db');

let message = db.define('message', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    content: {
        type: Sequelize.TEXT
    },
}, {
    indexes: [{
        unique: false,
        fields: ['fromUserId'] // foreign key
    }, {
        unique: false,
        fields: ['toUserId'] // foreign key
    }, {
        unique: false,
        fields: ['createdAt']
    }]
});

module.exports = message;