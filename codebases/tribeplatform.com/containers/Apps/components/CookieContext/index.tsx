import React, { createContext, useMemo } from 'react'

import { hasActionPermission } from 'tribe-api/permissions'
import { Features, useTribeFeature } from 'tribe-feature-flag'

import { useAppBySlug } from 'containers/Apps/hooks/useAppBySlug'
import useGetNetwork from 'containers/Network/useGetNetwork'

import { getCookieSettings } from 'lib/cookies'

import { DefaultApps } from '../TabContent/SettingsContent/DefaultApps'

type CookieContextProps = {
  isCookieInstalled: boolean
  shouldShowCookiePopup: boolean
  shouldAnonymizeTracking: boolean
}

export const CookieContext = createContext<CookieContextProps>({
  isCookieInstalled: false,
  shouldShowCookiePopup: false,
  shouldAnonymizeTracking: false,
})

export const CookieContextProvider = ({ children }) => {
  const { network } = useGetNetwork()
  const { authorized: hasFetchAppAccess } = hasActionPermission(
    network?.authMemberProps?.permissions as any,
    'app',
  )
  const { app: cookieConsentApp, loading } = useAppBySlug(
    {
      slug: DefaultApps.CookieConsentManager,
    },
    {
      skip: typeof window === 'undefined' || !hasFetchAppAccess,
    },
  )
  const cookieSettings = getCookieSettings()
  const isCookieInstalled = useMemo(
    () => Boolean(!loading && cookieConsentApp?.installed),
    [cookieConsentApp, loading],
  )
  const { isEnabled: cookieFeatureEnabled } = useTribeFeature(
    Features.CookieConsentManager,
  )
  const shouldShowCookiePopup = useMemo(
    () =>
      Boolean(
        cookieFeatureEnabled &&
          isCookieInstalled &&
          cookieSettings &&
          !cookieSettings.hasUserConsent,
      ),
    [cookieFeatureEnabled, cookieSettings, isCookieInstalled],
  )

  const shouldAnonymizeTracking = useMemo(
    () =>
      Boolean(
        cookieFeatureEnabled &&
          isCookieInstalled &&
          !cookieSettings?.ANALYTICS_AND_FUNCTIONAL?.enabled,
      ),
    [cookieFeatureEnabled, cookieSettings, isCookieInstalled],
  )
  return useMemo(
    () => (
      <CookieContext.Provider
        value={{
          isCookieInstalled,
          shouldShowCookiePopup,
          shouldAnonymizeTracking,
        }}
      >
        {children}
      </CookieContext.Provider>
    ),
    [
      children,
      isCookieInstalled,
      shouldAnonymizeTracking,
      shouldShowCookiePopup,
    ],
  )
}
