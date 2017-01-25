
const config = require('./lib/config')
const winston = require('winston')
const request = require('superagent')
const Sequelize = require('sequelize')

let models = {}

config.init()
    .then(setupConfig)
    .then(setupWinston)
    .then(setupSequelize)
    .then(startScraper)
    .catch(logErrors)

function setupConfig () {
    return config.init()
}

function setupWinston () {
    winston.level = config.get('LOG_LEVEL')
}

function setupSequelize () {
    let conn = new Sequelize(config.get('MYSQL_DATABASE'), config.get('MYSQL_USER'), config.get('MYSQL_PASSWORD'), {
        host: config.get('MYSQL_HOST')
    })

    models.FreeBike = conn.define('free_bikes', {
        ts: Sequelize.STRING,
        amount: Sequelize.INTEGER
    })

    return conn.sync()
}

function logErrors (err) {
    winston.log('info', 'Startup error: ', err.message)
    winston.log('verbose', err)
}

function startScraper () {
    setInterval(scrapeBikes, config.get('SCRAPE_INTERVAL'))
    scrapeBikes()
}

function scrapeBikes () {
    console.log('Start scraping!')
    request.get('https://map.socialbicycles.com/bikes?network_id=24')
        .then(res => res.body)
        .then(records => records.length)
        .then(amount => models.FreeBike.create({
            ts: Date.now(),
            amount
        }))
        .catch(err => winston.log('ERROR', err))
}
