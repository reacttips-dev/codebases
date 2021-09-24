import React, { useContext, useEffect } from 'react'

import { SeoPageProps } from '@types'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { HTML5toTouch } from 'rdndmb-html5-to-touch'
import { DndProvider } from 'react-dnd-multi-backend'

import { logger, suppressAppLevelWarnings } from '@tribefrontend/logger'
import { AuthToken, ThemeTokens } from 'tribe-api/interfaces'
import { TribeUIProvider } from 'tribe-components'

import RouteProgressBar from 'components/Layout/RouteProgressBar'

import { ThemeTokens as GlobalThemeTokens } from 'containers/AdminSettings/hooks/useThemeSettings'
import CookieConsent from 'containers/Apps/components/CookieConsent'
import { CookieContext } from 'containers/Apps/components/CookieContext'
import Navbar from 'containers/Network/components/Navbar'
import { useVerifyNotification } from 'containers/Network/hooks/useVerifyNotification'
import useGetNetwork from 'containers/Network/useGetNetwork'

import useAnalytics from 'hooks/useAnalytics'
import useFullStory from 'hooks/useFullStory'
import useNetworkCustomCodes from 'hooks/useNetworkCustomCodes'

import { initializeTribeWindow, setGlobalTribeSettings } from 'lib/dom/window'
import useBootIntercom from 'lib/intercom/useBootIntercom'

import { getRuntimeConfigVariable } from 'utils/config'

const isClient = typeof window !== 'undefined'
const getCustomCodeElements = (codes: string[]) => {
  return (
    isClient &&
    codes?.length > 0 &&
    codes
      .map(script => {
        try {
          const scriptElements = Array.from(
            new DOMParser().parseFromString(script, 'text/html')?.head
              ?.children,
          )?.flat()
          return scriptElements
        } catch (err) {
          logger.error(err)
        }
        return []
      })
      ?.flat()
  )
}
const injectCodes = (codes: string[]) => {
  const elements = getCustomCodeElements(codes)
  if (!elements) return []
  return elements.map(element => {
    const ScriptElement = element?.tagName?.toLowerCase()
    return ScriptElement ? (
      <ScriptElement
        key={element.innerHTML}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: element.innerHTML,
        }}
      ></ScriptElement>
    ) : null
  })
}

/** Contains hooks that require theming */
const NotificationHooks = () => {
  useVerifyNotification()

  return null
}

type TribeAppProps = {
  userAgent?: string | null
  userHash?: string | null
  navbar?: boolean | undefined
  sidebarVisible?: boolean
  seo: SeoPageProps | undefined
  authToken: AuthToken | null | undefined
}

const TribeApp: React.FC<TribeAppProps> = ({
  children,
  userAgent,
  userHash,
  seo,
  authToken,
  navbar = true,
  sidebarVisible = true,
}) => {
  const router = useRouter()
  useAnalytics({ seo, authToken })
  // To turn off getNetwork query for the health page call
  const shouldSkipThisPage = router.asPath === '/_health'
  const { network } = useGetNetwork(undefined, { skip: shouldSkipThisPage })
  const { shouldAnonymizeTracking, shouldShowCookiePopup } = useContext(
    CookieContext,
  )
  useBootIntercom({ userHash })
  initializeTribeWindow()
  suppressAppLevelWarnings()
  useFullStory()
  const { headCustomCodes, bodyCustomCodes } = useNetworkCustomCodes(
    shouldAnonymizeTracking,
  )
  const themeSettings = network?.themes?.active?.tokens
  setGlobalTribeSettings('themeSettings', themeSettings as GlobalThemeTokens)

  const createGoogleAnalyticsScript = (shouldAnonymizeTracking?: boolean) => {
    const trackingId = getRuntimeConfigVariable(
      'SHARED_GOOGLE_ANALYTICS_TRACKING_ID',
    )
    if (!trackingId) return null

    return (
      <React.Fragment key="shared-ga-tracking-script">
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}
        ></script>
        <script
          key="shared-ga-tracking-script"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${trackingId}', { 'anonymize_ip': ${String(
              shouldAnonymizeTracking,
            )} });
            `,
          }}
        ></script>
      </React.Fragment>
    )
  }

  useEffect(() => {
    if (bodyCustomCodes?.length) {
      const elements = getCustomCodeElements(bodyCustomCodes)
      if (!elements) return
      elements.forEach(e => {
        if (
          Array.from(document.body.children).some(
            el => el.innerHTML === e.innerHTML,
          )
        )
          return
        const element = document.createElement(e.tagName)
        element.innerHTML = e.innerHTML
        // Needs a direct append child call to actually 'execute' the scripts
        // https://www.w3.org/TR/2008/WD-html5-20080610/dom.html#innerhtml0
        document.body.appendChild(element)
      })
    }
  }, [])

  if (shouldSkipThisPage) return <>{children}</>

  return (
    <TribeUIProvider
      themeSettings={themeSettings as ThemeTokens}
      userAgent={userAgent}
    >
      <Head>
        {injectCodes(headCustomCodes)}
        {createGoogleAnalyticsScript(shouldAnonymizeTracking)}
      </Head>
      <NotificationHooks />
      {navbar && network && <Navbar />}
      <RouteProgressBar />
      <DndProvider options={HTML5toTouch}>{children}</DndProvider>
      {shouldShowCookiePopup && (
        <CookieConsent sidebarVisible={sidebarVisible} />
      )}
    </TribeUIProvider>
  )
}

export default TribeApp
