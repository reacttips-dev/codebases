export enum CookieKind {
  ESSENTIAL = 'ESSENTIAL',
  ANALYTICS_AND_FUNCTIONAL = 'ANALYTICS_AND_FUNCTIONAL',
  ADVERTISING_AND_TRACKING = 'ADVERTISING_AND_TRACKING',
}

export type OptionalCookieKind = Exclude<CookieKind, CookieKind.ESSENTIAL>

export type Cookie = {
  name: string
  company: string
  domains: string[]
}

export type CookieSettings = {
  hasUserConsent?: boolean
  [CookieKind.ESSENTIAL]?: {
    cookies: Cookie[]
    enabled: boolean
  }
  [CookieKind.ANALYTICS_AND_FUNCTIONAL]?: {
    cookies?: Cookie[]
    enabled?: boolean
  }
  [CookieKind.ADVERTISING_AND_TRACKING]?: {
    cookies?: Cookie[]
    enabled?: boolean
  }
}
