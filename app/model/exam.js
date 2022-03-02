const { Sequelize, DataTypes, Model } = require('sequelize');

const { Unit, Process, User } = require('..//model');
const Exam = require('../../config/mysql/index').getSequlize().define('Exam', {
    percentComplete: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    timer: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        }
    },
    unit_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Unit,
            key: 'id',
        }
    },
    process_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Process,
            key: 'id',
        }
    }
});
// Exam.sync({ force: true })
module.exports = Exam;