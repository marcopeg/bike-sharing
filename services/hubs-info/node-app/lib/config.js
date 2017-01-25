/**
 * App Configuration
 * =================
 *
 * Strict ENV based configuration proxy
 */

exports.init = () => Promise.resolve()

exports.get = key => {
    if (process.env[key] === undefined) {
        throw new Error('Env "' + key + '" not defined')
    }
    return process.env[key]
}
