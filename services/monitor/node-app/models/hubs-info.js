
const Sequelize = require('sequelize')
const conn = require('./sequelize')

module.exports = conn.define('hubs_info', {
    hub_id: Sequelize.INTEGER,
    name: Sequelize.STRING,
    address: Sequelize.STRING,
    bikes: Sequelize.INTEGER,
    racks: Sequelize.INTEGER
})
