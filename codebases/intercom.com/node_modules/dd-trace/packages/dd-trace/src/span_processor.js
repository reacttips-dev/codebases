const log = require('./log')
const format = require('./format')

class SpanProcessor {
  constructor (exporter, prioritySampler) {
    this._exporter = exporter
    this._prioritySampler = prioritySampler
  }

  process (span) {
    const spanContext = span.context()
    const trace = spanContext._trace

    if (trace.started.length === trace.finished.length) {
      this._prioritySampler.sample(spanContext)

      if (spanContext._traceFlags.sampled === false) {
        log.debug(() => `Dropping trace due to user configured filtering: ${trace.started}`)
        this._erase(trace)
        return
      }

      const formattedSpans = trace.finished.map(format)
      this._exporter.export(formattedSpans)
      this._erase(trace)
    }
  }

  _erase (trace) {
    trace.finished.forEach(span => {
      span.context()._tags = {}
    })

    trace.started = []
    trace.finished = []
  }
}

module.exports = SpanProcessor
