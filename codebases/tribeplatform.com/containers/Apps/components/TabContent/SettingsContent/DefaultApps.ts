export enum DefaultApps {
  Amplitude = 'amplitude',
  CookieConsentManager = 'cookie-consent-manager',
  CustomCodeSnippet = 'custom-code-snippet',
  Discussion = 'discussion',
  GoogleAnalytics = 'google-analytics',
  QA = 'q-and-a',
  Zapier = 'zapier',
}

export const FILTERED_APPS_SET = new Set<string>([
  DefaultApps.Discussion,
  DefaultApps.QA,
])

export const APPS_WITH_SETTINGS = new Set<string>([
  DefaultApps.Amplitude,
  DefaultApps.CustomCodeSnippet,
  DefaultApps.Discussion,
  DefaultApps.GoogleAnalytics,
  DefaultApps.QA,
  DefaultApps.Zapier,
])
