'use strict'

class Sampler {
  constructor (rate) {
    this._rate = rate
  }

  rate () {
    return this._rate
  }

  isSampled () {
    return this._rate === 1 || Math.random() < this._rate
  }
}

module.exports = Sampler
