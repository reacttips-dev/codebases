import * as Sentry from '@sentry/node'
import { SeoPageProps } from '@types'

import { AuthToken } from 'tribe-api/interfaces'

import { getRuntimeConfigVariable } from 'utils/config'

import useAuthToken from './useAuthToken'
import useSnowplowTracker from './useSnowplowTracker'

type AnalyticsHookProps = {
  authToken?: AuthToken | null
  seo?: SeoPageProps
}
const useAnalytics = ({ authToken, seo }: AnalyticsHookProps) => {
  const { authToken: clientAuthToken } = useAuthToken()
  const _token = authToken?.member?.id ? authToken : clientAuthToken

  const dsn = getRuntimeConfigVariable('SHARED_SENTRY_DSN')

  if (dsn) {
    Sentry.init({
      dsn,
      integrations: [], // TODO: add an integration
      // We recommend adjusting this value in production, or using tracesSampler
      // for finer control
      tracesSampleRate: 1.0,
    })
    Sentry.setTag('user.networkId', _token?.networkPublicInfo?.id || '')
    Sentry.setTag('user.networkName', _token?.networkPublicInfo?.name || '')
    Sentry.setTag('user.networkDomain', _token?.networkPublicInfo?.domain || '')
    Sentry.setTag('user.roleType', _token?.member?.role?.type || '')
    Sentry.setTag('user.status', _token?.member?.status || '')
    Sentry.setUser({
      name: _token?.member?.name || '',
      id: _token?.member?.id || '',
      email: _token?.member?.email || '',
    })
  }

  useSnowplowTracker({
    authToken: _token as AuthToken,
    pageTitle: seo?.title || '',
  })
}

export default useAnalytics
