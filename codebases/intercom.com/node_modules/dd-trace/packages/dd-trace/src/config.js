'use strict'

const URL = require('url-parse')
const platform = require('./platform')
const coalesce = require('koalas')
const scopes = require('../../../ext/scopes')
const tagger = require('./tagger')
const id = require('./id')
const { isTrue, isFalse } = require('./util')

const runtimeId = `${id().toString()}${id().toString()}`

class Config {
  constructor (options) {
    options = options || {}

    this.tags = {}

    tagger.add(this.tags, platform.env('DD_TAGS'))
    tagger.add(this.tags, platform.env('DD_TRACE_TAGS'))
    tagger.add(this.tags, platform.env('DD_TRACE_GLOBAL_TAGS'))
    tagger.add(this.tags, options.tags)

    const DD_TRACE_ANALYTICS_ENABLED = coalesce(
      options.analytics,
      platform.env('DD_TRACE_ANALYTICS_ENABLED'),
      platform.env('DD_TRACE_ANALYTICS'),
      false
    )
    // Temporary disabled
    const DD_PROFILING_ENABLED = coalesce(
      // options.profiling,
      // platform.env('DD_PROFILING_ENABLED'),
      platform.env('DD_EXPERIMENTAL_PROFILING_ENABLED'),
      false
    )
    const DD_PROFILING_EXPORTERS = coalesce(
      platform.env('DD_PROFILING_EXPORTERS'),
      'agent'
    )
    const DD_PROFILING_SOURCE_MAP = platform.env('DD_PROFILING_SOURCE_MAP')
    const DD_LOGS_INJECTION = coalesce(
      options.logInjection,
      platform.env('DD_LOGS_INJECTION'),
      false
    )
    const DD_RUNTIME_METRICS_ENABLED = coalesce(
      options.runtimeMetrics,
      platform.env('DD_RUNTIME_METRICS_ENABLED'),
      false
    )
    const DD_AGENT_HOST = coalesce(
      options.hostname,
      platform.env('DD_AGENT_HOST'),
      platform.env('DD_TRACE_AGENT_HOSTNAME'),
      '127.0.0.1'
    )
    const DD_TRACE_AGENT_PORT = coalesce(
      options.port,
      platform.env('DD_TRACE_AGENT_PORT'),
      '8126'
    )
    const DD_TRACE_AGENT_URL = coalesce(
      options.url,
      platform.env('DD_TRACE_AGENT_URL'),
      platform.env('DD_TRACE_URL'),
      null
    )
    const DD_SERVICE = options.service ||
      platform.env('DD_SERVICE') ||
      platform.env('DD_SERVICE_NAME') ||
      this.tags.service ||
      platform.service() ||
      'node'
    const DD_ENV = coalesce(
      options.env,
      platform.env('DD_ENV'),
      this.tags.env
    )
    const DD_VERSION = coalesce(
      options.version,
      platform.env('DD_VERSION'),
      this.tags.version,
      platform.appVersion()
    )
    const DD_TRACE_STARTUP_LOGS = coalesce(
      options.startupLogs,
      platform.env('DD_TRACE_STARTUP_LOGS'),
      true
    )
    const DD_TRACE_ENABLED = coalesce(
      options.enabled,
      platform.env('DD_TRACE_ENABLED'),
      true
    )
    const DD_TRACE_DEBUG = coalesce(
      options.debug,
      platform.env('DD_TRACE_DEBUG'),
      false
    )
    const DD_TRACE_AGENT_PROTOCOL_VERSION = coalesce(
      options.protocolVersion,
      platform.env('DD_TRACE_AGENT_PROTOCOL_VERSION'),
      '0.4'
    )

    const sampler = (options.experimental && options.experimental.sampler) || {}
    const ingestion = options.ingestion || {}
    const dogstatsd = coalesce(options.dogstatsd, {})

    Object.assign(sampler, {
      sampleRate: coalesce(ingestion.sampleRate, sampler.sampleRate, platform.env('DD_TRACE_SAMPLE_RATE')),
      rateLimit: coalesce(ingestion.rateLimit, sampler.rateLimit, platform.env('DD_TRACE_RATE_LIMIT'))
    })

    this.enabled = isTrue(DD_TRACE_ENABLED)
    this.debug = isTrue(DD_TRACE_DEBUG)
    this.logInjection = isTrue(DD_LOGS_INJECTION)
    this.env = DD_ENV
    this.url = DD_TRACE_AGENT_URL && new URL(DD_TRACE_AGENT_URL)
    this.site = coalesce(options.site, platform.env('DD_SITE'), 'datadoghq.com')
    this.hostname = DD_AGENT_HOST || (this.url && this.url.hostname)
    this.port = String(DD_TRACE_AGENT_PORT || (this.url && this.url.port))
    this.flushInterval = coalesce(parseInt(options.flushInterval, 10), 2000)
    this.sampleRate = coalesce(Math.min(Math.max(options.sampleRate, 0), 1), 1)
    this.logger = options.logger
    this.plugins = !!coalesce(options.plugins, true)
    this.service = DD_SERVICE
    this.version = DD_VERSION
    this.analytics = isTrue(DD_TRACE_ANALYTICS_ENABLED)
    this.dogstatsd = {
      hostname: coalesce(dogstatsd.hostname, platform.env(`DD_DOGSTATSD_HOSTNAME`), this.hostname),
      port: String(coalesce(dogstatsd.port, platform.env('DD_DOGSTATSD_PORT'), 8125))
    }
    this.runtimeMetrics = isTrue(DD_RUNTIME_METRICS_ENABLED)
    this.trackAsyncScope = options.trackAsyncScope !== false
    this.experimental = {
      b3: !(!options.experimental || !options.experimental.b3),
      runtimeId: !(!options.experimental || !options.experimental.runtimeId),
      exporter: options.experimental && options.experimental.exporter,
      peers: (options.experimental && options.experimental.distributedTracingOriginAllowlist) ||
        (options.experimental && options.experimental.distributedTracingOriginWhitelist) || [],
      enableGetRumData: (options.experimental && !!options.experimental.enableGetRumData),
      sampler,
      internalErrors: options.experimental && options.experimental.internalErrors
    }
    this.reportHostname = isTrue(coalesce(options.reportHostname, platform.env('DD_TRACE_REPORT_HOSTNAME'), false))
    this.scope = isFalse(platform.env('DD_CONTEXT_PROPAGATION'))
      ? scopes.NOOP
      : coalesce(options.scope, platform.env('DD_TRACE_SCOPE'))
    this.clientToken = coalesce(options.clientToken, platform.env('DD_CLIENT_TOKEN'))
    this.logLevel = coalesce(
      options.logLevel,
      platform.env('DD_TRACE_LOG_LEVEL'),
      'debug'
    )
    this.profiling = {
      enabled: isTrue(DD_PROFILING_ENABLED),
      sourceMap: !isFalse(DD_PROFILING_SOURCE_MAP),
      exporters: DD_PROFILING_EXPORTERS
    }
    this.lookup = options.lookup
    this.startupLogs = isTrue(DD_TRACE_STARTUP_LOGS)
    this.protocolVersion = DD_TRACE_AGENT_PROTOCOL_VERSION

    tagger.add(this.tags, { service: this.service, env: this.env, version: this.version })

    if (this.experimental.runtimeId) {
      tagger.add(this.tags, {
        'runtime-id': runtimeId
      })
    }
  }
}

module.exports = Config
