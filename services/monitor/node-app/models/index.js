
const conn = require('./sequelize')

module.exports = {
    init: () => conn.sync()
}
