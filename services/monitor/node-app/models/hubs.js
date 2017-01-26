
const Sequelize = require('sequelize')
const conn = require('./sequelize')

module.exports = conn.define('hubs', {
    hub_id: Sequelize.INTEGER,
    bikes: Sequelize.INTEGER,
    racks: Sequelize.INTEGER
})
