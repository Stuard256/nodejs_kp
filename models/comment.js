const Sequelize = require('sequelize');
const db = require('../config/db');

let comment = db.define('comment', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    content: {
        type: Sequelize.TEXT
    }
}, {
    indexes: [{
        unique: false,
        fields: ['userId'] // foreign key
    }, {
        unique: false,
        fields: ['publicationId'] // foreign key
    }]
});

module.exports = comment;