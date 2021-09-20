'use strict'

const shimmer = require('shimmer')
const log = require('./log')
const platform = require('./platform')
const { isTrue, isFalse } = require('./util')

shimmer({ logger: () => {} })

const plugins = platform.plugins

const disabldPlugins = platform.env('DD_TRACE_DISABLED_PLUGINS')

const collectDisabledPlugins = () => {
  return new Set(disabldPlugins && disabldPlugins.split(',').map(plugin => plugin.trim()))
}

function cleanEnv (name) {
  return platform.env(`DD_TRACE_${name.toUpperCase()}`.replace(/[^a-z0-9_]/ig, '_'))
}

function getConfig (name, config = {}) {
  if (!name) {
    return config
  }

  const enabled = cleanEnv(`${name}_ENABLED`)
  if (enabled !== undefined) {
    config.enabled = isTrue(enabled)
  }

  const analyticsEnabled = cleanEnv(`${name}_ANALYTICS_ENABLED`)
  const analyticsSampleRate = Math.min(Math.max(cleanEnv(`${name}_ANALYTICS_SAMPLE_RATE`), 0), 1)

  if (isFalse(analyticsEnabled)) {
    config.analytics = false
  } else if (!Number.isNaN(analyticsSampleRate)) {
    config.analytics = analyticsSampleRate
  } else if (isTrue(analyticsEnabled)) {
    config.analytics = true
  }

  return config
}

class Instrumenter {
  constructor (tracer) {
    this._tracer = tracer
    this._loader = new platform.Loader(this)
    this._enabled = false
    this._names = new Set()
    this._plugins = new Map()
    this._instrumented = new Map()
    this._disabledPlugins = collectDisabledPlugins()
  }

  use (name, config) {
    if (typeof config === 'boolean') {
      config = { enabled: config }
    }

    config = getConfig(name, config)

    try {
      this._set(plugins[name.toLowerCase()], { name, config })
    } catch (e) {
      log.debug(`Could not find a plugin named "${name}".`)
    }

    if (this._enabled) {
      this._loader.reload(this._plugins)
    }
  }

  enable (config) {
    config = config || {}

    this._enabled = true

    if (config.plugins !== false) {
      Object.keys(plugins)
        .filter(name => !this._plugins.has(plugins[name]))
        .forEach(name => {
          this._set(plugins[name], { name, config: getConfig(name) })
        })
    }

    this._loader.reload(this._plugins)
  }

  disable () {
    for (const instrumentation of this._instrumented.keys()) {
      this.unpatch(instrumentation)
    }

    this._plugins.clear()
    this._enabled = false
    this._loader.reload(this._plugins)
  }

  wrap (nodules, names, wrapper) {
    nodules = [].concat(nodules)
    names = [].concat(names)

    nodules.forEach(nodule => {
      names.forEach(name => {
        if (typeof nodule[name] !== 'function') {
          throw new Error(`Expected object ${nodule} to contain method ${name}.`)
        }

        Object.defineProperty(nodule[name], '_datadog_patched', {
          value: true,
          configurable: true
        })
      })
    })

    shimmer.massWrap.call(this, nodules, names, function (original, name) {
      const wrapped = wrapper(original, name)
      const props = Object.getOwnPropertyDescriptors(original)
      const keys = Reflect.ownKeys(props)

      // https://github.com/othiym23/shimmer/issues/19
      for (const key of keys) {
        if (typeof key !== 'symbol' || wrapped.hasOwnProperty(key)) continue

        Object.defineProperty(wrapped, key, props[key])
      }

      return wrapped
    })
  }

  unwrap (nodules, names, wrapper) {
    nodules = [].concat(nodules)
    names = [].concat(names)

    shimmer.massUnwrap.call(this, nodules, names, wrapper)

    nodules.forEach(nodule => {
      names.forEach(name => {
        nodule[name] && delete nodule[name]._datadog_patched
      })
    })
  }

  wrapExport (moduleExports, wrapper) {
    if (typeof moduleExports !== 'function') return moduleExports

    const props = Object.keys(moduleExports)
    const shim = function () {
      return moduleExports._datadog_wrapper.apply(this, arguments)
    }

    for (const prop of props) {
      shim[prop] = moduleExports[prop]
    }

    moduleExports._datadog_wrapper = wrapper

    return shim
  }

  unwrapExport (moduleExports) {
    if (moduleExports && moduleExports._datadog_wrapper) {
      moduleExports._datadog_wrapper = moduleExports
    }

    return moduleExports
  }

  load (plugin, meta) {
    if (!this._enabled) return

    const instrumentations = [].concat(plugin)
    const enabled = meta.config.enabled !== false

    platform.metrics().boolean(`datadog.tracer.node.plugin.enabled.by.name`, enabled, `name:${meta.name}`)

    try {
      instrumentations
        .forEach(instrumentation => {
          this._loader.load(instrumentation, meta.config)
        })
    } catch (e) {
      log.error(e)
      this.unload(plugin)
      log.debug(`Error while trying to patch ${meta.name}. The plugin has been disabled.`)

      platform.metrics().increment(`datadog.tracer.node.plugin.errors`, true)
    }
  }

  unload (plugin) {
    [].concat(plugin)
      .forEach(instrumentation => {
        this.unpatch(instrumentation)
        this._instrumented.delete(instrumentation)
      })

    const meta = this._plugins.get(plugin)

    if (meta) {
      this._plugins.delete(plugin)

      platform.metrics().boolean(`datadog.tracer.node.plugin.enabled.by.name`, false, `name:${meta.name}`)
    }
  }

  patch (instrumentation, moduleExports, config) {
    let instrumented = this._instrumented.get(instrumentation)

    if (!instrumented) {
      this._instrumented.set(instrumentation, instrumented = new Set())
    }

    if (!instrumented.has(moduleExports)) {
      instrumented.add(moduleExports)
      return instrumentation.patch.call(this, moduleExports, this._tracer._tracer, config)
    }
  }

  unpatch (instrumentation) {
    const instrumented = this._instrumented.get(instrumentation)

    if (instrumented) {
      instrumented.forEach(moduleExports => {
        try {
          instrumentation.unpatch.call(this, moduleExports, this._tracer)
        } catch (e) {
          log.error(e)
        }
      })
    }
  }

  _set (plugin, meta) {
    if (this._disabledPlugins.has(meta.name)) {
      log.debug(`Plugin "${meta.name}" was disabled via configuration option.`)
    } else {
      this._plugins.set(plugin, meta)
      this.load(plugin, meta)
    }
  }
}

module.exports = Instrumenter
