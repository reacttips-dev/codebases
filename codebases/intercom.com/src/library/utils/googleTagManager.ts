export function triggerGoogleTagManagerCustomEvent(event: string, metadata?: object): void {
  window.dataLayer = window.dataLayer || []
  // eslint-disable-next-line @typescript-eslint/camelcase
  window.dataLayer.push({ event, custom_event_metadata: metadata })
}

export const googleTagManagerCustomEvents: Record<string, string> = {
  capabilitiesCarouselClicked: 'capabilities-carousel-clicked',
  pricingClickedGetADemo: 'pricing-clicked-get_a_demo',
  whatsIncludedDrawerClicked: 'whats-included-drawer-clicked',
  marketoFormSubmitted: 'marketo-form-submitted',
}

export interface IWhatsIncludedDrawerClickedMetadata {
  'whats-included-drawer-index': number
  'whats-included-drawer-title': string
  'whats-included-component-headline': string
}
