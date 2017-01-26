
const request = require('superagent')
const winston = require('winston')
const async = require('async')
const config = require('../lib/config')
const HubsInfo = require('../models/hubs-info')

const scrapeUrl = 'https://map.socialbicycles.com/hubs?network_id=' + config.get('SCRAPE_NETWORK_ID')
let timer = null

let init = () => Promise.resolve()

let start = () => {
    console.log('Start hubs info scraper...')
    return scraper()
}

let stop = () => clearTimeout(timer)

module.exports = { init, start, stop }

function scraper () {
    winston.info('Scrape hubs info...')
    return request.get(scrapeUrl)
        .then(res => res.body)
        .then(hubs => HubsInfo.truncate()
            .then(() => updateRecords(hubs)))
        .then(() => next())
        .catch(err => next(err))
}

function next (err) {
    if (err) {
        winston.error(err)
    }
    timer = setTimeout(scraper, config.get('SCRAPE_INTERVAL_SHORT'))
}

function updateRecords (records) {
    return new Promise((resolve, reject) => {
        async.eachLimit(records, config.get('MYSQL_INSERT_BACTH'), (record, next) => {
            updateRecord(record)
                .then(() => next())
                .catch(err => next(err))
        }, err => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

function updateRecord (record) {
    return new Promise((resolve, reject) => {
        let p = HubsInfo.create({
            hub_id: record.id,
            name: record.name,
            address: record.address,
            bikes: record.available_bikes,
            racks: record.free_racks
        })
        p.then(() => setTimeout(() => resolve(), config.get('MYSQL_INSERT_DELAY')))
        p.catch(err => setTimeout(() => reject(err), config.get('MYSQL_INSERT_DELAY')))
    })
}
