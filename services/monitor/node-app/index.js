
const config = require('./lib/config')
const winston = require('winston')
const models = require('./models')
const scrapers = require('./scrapers')

config.init()
    .then(setupConfig)
    .then(setupWinston)
    .then(() => models.init())
    .then(() => scrapers.init())
    .then(() => scrapers.start())
    .catch(logErrors)

function setupConfig () {
    return config.init()
}

function setupWinston () {
    winston.level = config.get('LOG_LEVEL')
}

function logErrors (err) {
    winston.log('info', 'Startup error: ', err.message)
    winston.log('verbose', err)
}
