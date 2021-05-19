const Sequelize = require('sequelize');
const db = require('../config/db');

let publication_draft = db.define('publication_draft', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    uuid: {
        type: Sequelize.UUIDV4
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    content: {
        type: Sequelize.TEXT
    },
}, {
    indexes: [{
        unique: false,
        fields: ['userId'] // foreign key
    }, {
        unique: true,
        fields: ['uuid']
    }]
});

module.exports = publication_draft;