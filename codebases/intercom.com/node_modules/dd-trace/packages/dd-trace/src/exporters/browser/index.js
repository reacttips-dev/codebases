'use strict'

const URL = require('url-parse')

const MAX_SIZE = 64 * 1024 // 64kb
const DELIMITER = '\r\n'

// TODO: rename and refactor to support Node
// TODO: flush more often

class BrowserExporter {
  constructor ({ clientToken, url, site, env }) {
    this._queue = []
    this._flushing = false
    this._clientToken = clientToken
    this._env = env
    this._url = url || new URL(`https://public-trace-http-intake.logs.${site}`)
    this._size = 0

    window.addEventListener('beforeunload', () => this._flush())
    window.addEventListener('visibilitychange', () => this._flush())
  }

  export (spans) {
    const meta = this._traceMeta()
    const json = JSON.stringify({ spans, meta })
    const size = json.length + (this._queue.length > 0 ? DELIMITER.length : 0)

    if (this._size + size > MAX_SIZE) {
      if (this._flushing) return // drop trace to avoid multiple connections
      if (size > MAX_SIZE) return // drop trace because too large

      this._flush()
    }

    this._size += size
    this._queue.push(json)
  }

  setUrl (url) {
    this._url = url
  }

  _flush () {
    if (this._queue.length === 0) return

    this._flushing = true

    const url = `${this._url.href}/v1/input/${this._clientToken}`
    const body = this._queue.join(DELIMITER)

    this._queue = []
    this._size = 0

    send(url, body, () => {
      this._flushing = false
    })
  }

  _traceMeta () {
    const meta = {
      '_dd.source': 'browser'
    }

    addTag(meta, 'env', this._env)

    return meta
  }
}

function send (url, body, callback) {
  if (window.navigator && window.navigator.sendBeacon) {
    window.navigator.sendBeacon(url, body)
  } else if (window.fetch) {
    window.fetch(url, { body, method: 'POST', keepalive: true, mode: 'no-cors' })
      .then(callback, callback)
  } else {
    const req = new XMLHttpRequest()

    req.open('POST', url, true)
    req.addEventListener('loadend', callback)
    req.send(body)
  }
}

function addTag (meta, key, value) {
  if (!value) return

  meta[key] = value
}

module.exports = BrowserExporter
