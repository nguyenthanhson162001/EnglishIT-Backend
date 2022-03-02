const { Sequelize, DataTypes, Model } = require('sequelize');
const vocabulary = require('./vocabulary')
const typeVocabulary = require('../../config/mysql/index').getSequlize().define('typeVocabulary', {
    // Model attributes are defined here
    NameEnglish: {
        type: DataTypes.STRING,
        allowNull: false
    },
    NameVietnamese: {
        type: 'NVARCHAR(255)',
        allowNull: false
    },
    Abbreviation: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    timestamps: false
});

// typeVocabulary.sync({ alter: true })
module.exports = typeVocabulary;