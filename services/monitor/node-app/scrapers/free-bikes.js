
const request = require('superagent')
const winston = require('winston')
const config = require('../lib/config')
const FreeBikes = require('../models/free-bikes')

const scrapeUrl = 'https://map.socialbicycles.com/bikes?network_id=' + config.get('SCRAPE_NETWORK_ID')
let timer = null

let init = () => Promise.resolve()

let start = () => {
    console.log('Start free bikes scraper...')
    return scraper()
}

let stop = () => clearInterval(timer)

module.exports = { init, start, stop }

function scraper () {
    return request.get(scrapeUrl)
        .then(res => res.body)
        .then(records => records.length)
        .then(amount => FreeBikes.create({
            ts: Date.now(),
            amount
        }))
        .then(() => next())
        .catch(err => next(err))
}

function next (err) {
    if (err) {
        winston.error(err)
    }
    timer = setTimeout(scraper, config.get('SCRAPE_INTERVAL_SHORT'))
}
