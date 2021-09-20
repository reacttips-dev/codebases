let gtmSingleton = undefined as unknown

import type GTMClass from '@intercom/gtm-js'

export async function getGtmClient(): Promise<GTMClass> {
  if (typeof window === 'undefined') {
    throw new Error(
      'Cannot instantiate a GTM.js client in a server-side context. Make sure `window` is defined.',
    )
  }

  const { default: GTM } = await import('@intercom/gtm-js')
  if (!gtmSingleton) {
    gtmSingleton = new GTM()
    // GhostInspector and others check for the prescence of this global
    window.IntercomGTM = gtmSingleton
  }
  return window.IntercomGTM
}

export function getCurrentLocaleCode(): string | null {
  const html = document.querySelector('html')
  const lang = html && html.lang
  return lang || null
}
