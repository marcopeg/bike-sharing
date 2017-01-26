
const Sequelize = require('sequelize')
const conn = require('./sequelize')

module.exports = conn.define('free_bikes', {
    ts: Sequelize.STRING,
    amount: Sequelize.INTEGER
})
