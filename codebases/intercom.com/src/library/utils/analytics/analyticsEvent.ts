import { getGtmClient } from 'marketing-site/lib/gtm'
import { ITrackedEvent, trackEvent } from './trackEvent'

export class AnalyticsEvent {
  data: IEventData

  constructor(eventData?: IEventData) {
    this.data = {
      context: 'unknown',
      metadata: {},
    }
    if (eventData) {
      this.addData(eventData)
    }
  }

  addData(eventData: IEventData) {
    if (eventData.metadata) {
      this.addMetadata(eventData.metadata)
      delete eventData.metadata
    }
    this.data = Object.assign(this.data, eventData)
  }

  setPlaceFromPath(path: string) {
    this.data.place = path.split('/')[1] + '_page'
  }

  addMetadata(metadata: Record<string, any>) {
    this.data.metadata = Object.assign(this.data.metadata, metadata)
  }

  async send() {
    if (!this.data.action || !this.data.object || !this.data.place) {
      throw new Error('missing action, object or place data')
    }
    const gtmClient = await getGtmClient()
    this.addMetadata({
      screen_size: gtmClient.device, // eslint-disable-line @typescript-eslint/camelcase
    })
    return await trackEvent(this.data as ITrackedEvent)
  }
}

export interface IEventData {
  action?: string
  object?: string
  place?: string
  context?: string
  metadata?: Record<string, any>
}
