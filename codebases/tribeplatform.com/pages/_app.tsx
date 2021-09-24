import 'utils/wdyr'

import React, { useCallback, useEffect } from 'react'

import { ApolloProvider } from '@apollo/client'
import { AppPageProps, NextPageContextApp, PageWithLayout } from '@types'
import { AppProps, NextWebVitalsMetric } from 'next/app'
import Head from 'next/head'

import { ConnectionStateProvider } from 'tribe-components'
import { TribeOptimizelyProvider } from 'tribe-feature-flag'

import ScrollRestorer from 'components/common/ScrollRestorer'
import { GlobalModalsProvider } from 'components/GlobalModalsProvider'
import AdminBrandingSidebarLayout from 'components/Layout/AdminBrandingSidebarLayout'
import AdminThemeSidebarLayout from 'components/Layout/AdminThemeSidebarLayout'
import BasicSidebarLayout from 'components/Layout/BasicSidebarLayout'
import MobileHeader from 'components/Layout/MobileHeader'

import { NetworkTopNavigationSettings } from 'containers/AdminSettings/containers/network/theme/top-navigation'
import { CookieContextProvider } from 'containers/Apps/components/CookieContext'
import { GenericMeta } from 'containers/common/GenericMeta'
import ErrorContainer from 'containers/Error'
import { SpaceSidebarContextProvider } from 'containers/Space/hooks/useSpaceSidebar'

import { initializeApollo } from 'lib/apollo'
import { appWithTranslation } from 'lib/i18n'
import { logger } from 'lib/logger'
import { getAppInitialProps } from 'lib/ssr/getAppInitialProps'
import TribeEmitter, { TribeEmitterEvent } from 'lib/TribeEmitter'

import { getRuntimeConfigVariable } from 'utils/config'
import { networkSeo } from 'utils/seo.utils'

import TribeApp from '../components/TribeApp'
import { NetworkWhiteLabelSettings } from '../containers/AdminSettings/containers/network/theme/whiteLabel'
import TribeIntercom from '../lib/intercom/provider'

import 'emoji-mart/css/emoji-mart.css'
import '../public/carousel.scss'
import '../public/quill.scss'
import '../public/react-colorful.scss'
import '../public/code-editor.scss'

interface NextAppProps extends AppProps {
  Component: PageWithLayout
  pageProps: AppPageProps
}

const NextApp = ({ Component, pageProps, router }: NextAppProps) => {
  const {
    apolloClient,
    apolloState = {},
    authToken,
    error,
    intercomUserHash,
    optimizelyDatafile,
    origin,
    seo,
    sidebarKind,
    userAgent,
    navbar,
    ...restPageProps
  }: AppPageProps = pageProps || {}
  useEffect(() => {
    const onRouteChangeStart = () => {
      window.prevPage = window.location.pathname
    }
    const onRouteChangeComplete = (url: string) => {
      TribeEmitter.emit(TribeEmitterEvent.PAGE_VIEW, {
        title: seo?.title || url,
        previousPage: window.prevPage,
        page: url,
      })
    }

    TribeEmitter.emit(TribeEmitterEvent.PAGE_VIEW, {
      title: seo?.title || router.asPath,
      previousPage: '',
      page: router.asPath,
    })
    router.events.on('routeChangeStart', onRouteChangeStart)
    router.events.on('routeChangeComplete', onRouteChangeComplete)
    return () => {
      TribeEmitter.clearListeners()
      router.events.off('routeChangeStart', onRouteChangeStart)
      router.events.on('routeChangeComplete', onRouteChangeComplete)
    }
  }, [])

  const client =
    apolloClient ||
    initializeApollo(apolloState, {
      authToken,
    } as NextPageContextApp)

  const renderLayout = useCallback(
    children => {
      switch (sidebarKind) {
        case 'admin':
        case 'member':
        case 'networkApps':
        case 'spaceApps':
        case 'spaces':
          return (
            <BasicSidebarLayout sidebarKind={sidebarKind}>
              {children}
            </BasicSidebarLayout>
          )

        case 'adminBranding':
          return <AdminBrandingSidebarLayout />

        case 'adminTheme':
          return <AdminThemeSidebarLayout />

        case 'networkTopNavigationSettings':
          return <NetworkTopNavigationSettings />

        case 'networkWhiteLabelSettings':
          return <NetworkWhiteLabelSettings />

        default:
          return children
      }
    },
    [sidebarKind],
  )

  if (error) {
    logger.error(`_app error - ${error.message}`, { error })
  }

  return (
    <>
      <Head>
        {getRuntimeConfigVariable('SHARED_HEAP_ANALYTICS') && (
          <script
            type="text/javascript"
            src="/heap.js"
            data-code={getRuntimeConfigVariable('SHARED_HEAP_ANALYTICS')}
          ></script>
        )}
      </Head>
      <ApolloProvider client={client}>
        <TribeOptimizelyProvider
          datafile={optimizelyDatafile}
          user={{
            id: authToken?.member?.id || '',
            attributes: {
              email: String(authToken?.member?.email),
              username: String(authToken?.member?.username),
              name: String(authToken?.member?.name),
              roleType: String(authToken?.member?.role?.type),
              // Passing null/undefined values to these keys will cause the feature flag break
              clusterName:
                getRuntimeConfigVariable('SHARED_CLUSTER_NAME') || '',
              serviceName:
                getRuntimeConfigVariable('SHARED_SERVICE_NAME') || '',
            },
          }}
        >
          <SpaceSidebarContextProvider>
            <ConnectionStateProvider>
              <GlobalModalsProvider>
                <TribeIntercom authToken={authToken}>
                  <CookieContextProvider>
                    <TribeApp
                      authToken={authToken}
                      navbar={navbar}
                      userAgent={userAgent}
                      userHash={intercomUserHash}
                      sidebarVisible={Boolean(sidebarKind)}
                      seo={seo}
                    >
                      {error ? (
                        <ErrorContainer error={error} />
                      ) : (
                        <>
                          <GenericMeta
                            seo={seo}
                            path={router.pathname}
                            origin={origin}
                          />
                          <MobileHeader />
                          {renderLayout(<Component {...restPageProps} />)}
                          <ScrollRestorer />
                        </>
                      )}
                    </TribeApp>
                  </CookieContextProvider>
                </TribeIntercom>
              </GlobalModalsProvider>
            </ConnectionStateProvider>
          </SpaceSidebarContextProvider>
        </TribeOptimizelyProvider>
      </ApolloProvider>
    </>
  )
}

export const reportWebVitals = (metric: NextWebVitalsMetric) => {
  logger.debug(metric)
}

NextApp.getInitialProps = async ({ Component, ctx, router }) => {
  try {
    let pageProps: any = {}
    const isServer = typeof window === 'undefined'
    let appProps
    // if the page is standAlone then it does not need appsProps
    if (Component.standAlone !== true) {
      appProps = await getAppInitialProps(ctx, Component.options, router)
    }
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx, { isServer })
      pageProps.seo =
        typeof pageProps.seo === 'undefined'
          ? networkSeo(ctx?.authToken?.network) || null
          : pageProps.seo
    }
    const apolloState = ctx?.apolloClient?.cache.extract()
    const error = appProps?.error || pageProps?.error
    if (error && isServer) {
      ctx.res.statusCode = error?.code || 500
    }
    return { pageProps: { ...pageProps, ...appProps, apolloState } }
  } catch (error) {
    return { pageProps: { error } }
  }
}

export default appWithTranslation(NextApp)
