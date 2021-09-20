'use strict'

require('core-js/stable/object/assign') // TODO: remove dependency
require('core-js/stable/set') // TODO: remove dependency
require('core-js/stable/map') // TODO: remove dependency
require('core-js/stable/typed-array') // TODO: remove dependency

const platform = require('./src/platform')
const browser = require('./src/platform/browser')
const ext = require('../../ext')

platform.use(browser)

const TracerProxy = require('./src/proxy')
const tracer = new TracerProxy()

module.exports = tracer
module.exports.default = module.exports
module.exports.tracer = module.exports

window.ddtrace = { tracer, ext }
