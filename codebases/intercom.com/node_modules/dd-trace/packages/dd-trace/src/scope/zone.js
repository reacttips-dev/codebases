'use strict'

// TODO: Zone metrics

const Base = require('./base')
const Zone = window.Zone

let singleton = null

class Scope extends Base {
  constructor () {
    if (singleton) return singleton

    super()

    singleton = this
  }

  _active () {
    if (!Zone) return null

    return Zone.current.get('_datadog_span')
  }

  _activate (span, callback) {
    if (!Zone) return callback()

    const spec = {
      properties: {
        _datadog_span: span
      }
    }

    return Zone.current.fork(spec).run(() => callback())
  }
}

module.exports = Scope
