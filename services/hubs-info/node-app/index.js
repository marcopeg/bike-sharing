
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

    models.HubInfo = conn.define('hubs_info', {
        hub_id: Sequelize.INTEGER,
        name: Sequelize.STRING,
        address: Sequelize.STRING,
        bikes: Sequelize.INTEGER,
        racks: Sequelize.INTEGER
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
    request
        .get('https://map.socialbicycles.com/hubs?network_id=24')
            .then(res => res.body)
            .then(hubs => models.HubInfo.truncate()
                .then(() => Promise.all(hubs.map(hub => models.HubInfo.create({
                    hub_id: hub.id,
                    name: hub.name,
                    address: hub.address,
                    bikes: hub.available_bikes,
                    racks: hub.free_racks
                }))))
            )
            .catch(err => winston.log('ERROR', err))
}
