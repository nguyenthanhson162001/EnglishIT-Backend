const { Sequelize, DataTypes, Model } = require('sequelize');
const SequelizeSlugify = require('sequelize-slugify');
const Process = require('..//..//config/mysql/index').getSequlize().define('Process', {
    // Model attributes are defined here
    name: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    backgroundProcess: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.TEXT
    },
    slug: {
        type: DataTypes.STRING,
        unique: true
    }
}, {
    timestamps: false
});
SequelizeSlugify.slugifyModel(Process, { source: ['name'] });
// Process.sync({ alter: true })
module.exports = Process;