import { getGtmClient } from 'marketing-site/lib/gtm'

function getMetricName(metricName: string) {
  return `GtmJS.${metricName}`
}

export function getTags(formId: number) {
  return { formId, v2: true }
}

export async function incrementMetric(metric: string, formId: number) {
  const gtmClient = await getGtmClient()
  const metricName = getMetricName(metric)
  const tags = getTags(formId)
  gtmClient.incrementMetric(metricName, tags)
}

export async function recordTimingMetric(metric: string, duration: number, formId: number) {
  const gtmClient = await getGtmClient()
  const metricName = getMetricName(metric)
  const tags = getTags(formId)
  gtmClient.recordTimingMetric(metricName, duration, tags)
}
