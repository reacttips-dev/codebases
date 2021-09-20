'use strict'

class Loader {
  constructor (instrumenter) {
    this._instrumenter = instrumenter
  }

  reload (plugins) {
    plugins.forEach((meta, plugin) => {
      this._instrumenter.unload(plugin)
      this._instrumenter.load(plugin, meta)
    })
  }

  load (instrumentation, config) {
    const nodule = window[instrumentation.name]
    const override = this._instrumenter.patch(instrumentation, nodule, config)

    window[instrumentation.name] = override || nodule
  }
}

module.exports = Loader
