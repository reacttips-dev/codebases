const ALWAYS_EXCLUDE_MEASUREMENTS = ['benchmarkIndex', 'benchmark-index']

const filteredMetrics = (metrics, exclude = []) => {
  const excludeMetrics = [].concat(ALWAYS_EXCLUDE_MEASUREMENTS, exclude)
  return metrics.filter(
    measurement => excludeMetrics.indexOf(measurement.name) < 0
  )
}

export default filteredMetrics
