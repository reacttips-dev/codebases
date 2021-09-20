import { datadogRum } from '@datadog/browser-rum'
import datadogTracer from 'dd-trace'

function validateClientSide(): void {
  if (typeof window === 'undefined') {
    throw new Error(
      'Cannot instantiate a datadog rum client in a server-side context. Make sure `window` is defined.',
    )
  }
}

function clientTokenExists(): boolean {
  return process.env.DD_RUM_CLIENT_TOKEN !== undefined
}

export function initializeRumClient(): void {
  validateClientSide()
  if (!clientTokenExists()) return

  datadogRum.init({
    clientToken: process.env.DD_RUM_CLIENT_TOKEN || '',
    applicationId: process.env.DD_RUM_APPLICATION_ID || '',
    sampleRate: 1, // running on 1% of traffic
  })

  datadogTracer.init({
    service: 'marketing-site-static-production',
    clientToken: process.env.DD_RUM_CLIENT_TOKEN || '',
    env: 'production',
  })
}

export function addGlobalContext(key: string, value: any): void {
  validateClientSide()
  if (!clientTokenExists()) return

  datadogRum.addRumGlobalContext(key, value)
}
