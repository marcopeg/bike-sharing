
const async = require('async')

const scrapers = [
    require('./free-bikes'),
    require('./hubs-info'),
    require('./hubs')
]

let init = () => Promise.all(scrapers.map(scraper => scraper.init()))

// let start = () => Promise.all(scrapers.map(scraper => scraper.start()))

let start = () => new Promise((resolve, reject) => {
    async.eachSeries(scrapers, (scraper, next) => {
        scraper.start()
            .then(() => next())
            .catch(err => next(err))
    }, err => err ? reject(err) : resolve())
})

module.exports = { init, start }
