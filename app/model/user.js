const { Sequelize, DataTypes, Model } = require('sequelize');
// const  = require('sequelize/lib/dialects/mysql/data-types')
const User = require('../../config/mysql/index').getSequlize().define('User', {
    // Model attributes are defined here
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: 'NVARCHAR(255)',
    },
    firstName: {
        type: 'NVARCHAR(255)',
    },
    avatarURL: {
        type: DataTypes.STRING
    },
    codeSupplied: {
        type: DataTypes.STRING,
        allowNull: false
    },
    provide: {
        type: DataTypes.STRING
    }
}, {
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    // Other model options go here
});
// User.sync({ alter: true })
module.exports = User;