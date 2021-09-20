export const TEAMMATE_APP_URL = 'https://app.intercom.com'
export const TEAMMATE_APP_DEV_URL = 'http://app.intercom.test'

export function setTeammateAppUrl(url: string): string {
  return process.env.NODE_ENV === 'development' && url.startsWith(TEAMMATE_APP_URL)
    ? url.replace(TEAMMATE_APP_URL, TEAMMATE_APP_DEV_URL)
    : url
}
