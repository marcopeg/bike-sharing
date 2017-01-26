
const request = require('superagent')
const winston = require('winston')
const async = require('async')
const config = require('../lib/config')
const Hubs = require('../models/hubs')

let scrapeUrl = 'https://map.socialbicycles.com/hubs?network_id=' + config.get('SCRAPE_NETWORK_ID')
let timer = null

let init = () => Promise.resolve()

let start = () => {
    console.log('Start hubs scraper...')
    return scraper()
}

let stop = () => clearTimeout(timer)

module.exports = { init, start, stop }

function scraper () {
    winston.info('Scrape hubs...')
    return request.get(scrapeUrl)
        .then(res => res.body)
        .then(hubs => updateRecords(hubs))
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
        async.eachLimit(records, config.get('SCRAPE_INSERT_BACTH'), (record, next) => {
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
        let p = Hubs.create({
            hub_id: record.id,
            bikes: record.available_bikes,
            racks: record.free_racks
        })
        p.then(() => setTimeout(() => resolve(), config.get('SCRAPE_INSERT_DELAY')))
        p.catch(err => setTimeout(() => reject(err), config.get('SCRAPE_INSERT_DELAY')))
    })
}
