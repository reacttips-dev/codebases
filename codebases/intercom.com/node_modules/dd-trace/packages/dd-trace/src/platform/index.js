'use strict'

module.exports = {
  use (impl) {
    Object.assign(this, impl)
  },

  configure (config) {
    this._config = config
  }
}
