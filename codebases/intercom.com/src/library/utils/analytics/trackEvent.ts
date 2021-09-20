import { getGtmClient } from 'marketing-site/lib/gtm'
import { captureException } from 'marketing-site/lib/sentry'

export interface ITrackedEvent {
  action: string
  object: string
  place: string
  context: string
  metadata: Record<string, any>
}

async function trackGtmEvent(event: any, retries = 10): Promise<any> {
  const gtmClient = await getGtmClient()
  const identifier = `${event.context}-${event.action}-${event.object}`

  if (gtmClient.pageviewId) {
    return gtmClient.recordEvent(identifier, gtmClient.pageviewId, event)
  }
  if (retries && retries !== 0) {
    return new Promise((resolve) => {
      setTimeout(async () => {
        resolve(await trackGtmEvent(event, retries - 1))
      }, 1000)
    })
  }
  return Promise.resolve()
}

function trackIntercomEvent(event: any): void {
  if (window.Intercom) {
    window.Intercom('trackEvent', 'analytics-event', event)
  }
}

export function trackEvent(event: ITrackedEvent): void {
  try {
    const combinedEvent = Object.assign({}, event)
    delete combinedEvent.metadata
    Object.assign(combinedEvent, event.metadata)
    trackIntercomEvent(combinedEvent)
    trackGtmEvent(combinedEvent)
  } catch (err) {
    captureException(err)
  }
}
