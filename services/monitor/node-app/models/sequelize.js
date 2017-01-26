const Sequelize = require('sequelize')
const config = require('../lib/config')

module.exports = new Sequelize(config.get('MYSQL_DATABASE'), config.get('MYSQL_USER'), config.get('MYSQL_PASSWORD'), {
    host: config.get('MYSQL_HOST')
})
