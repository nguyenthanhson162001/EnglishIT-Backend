const Sequelize = require('sequelize');
var os = require("os");
var hostname = os.hostname();
const sequelize = new Sequelize('english_it', 'root', 'Son@162001', {
    host: '54.169.171.194',
    // host: hostname,
    dialect: 'mysql' /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
})
sequelize
    .authenticate()
    .then(() => console.log('Connection has been established successfully.'))
    .catch(err => console.error('Unable to connect to the database:', err));

module.exports = {
    getSequlize: function () {
        return sequelize
    }
}