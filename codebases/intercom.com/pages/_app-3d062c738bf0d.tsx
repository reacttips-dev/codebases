import { Locale } from 'contentful'
import buildPath from 'marketing-site/lib/buildPath'
import { initializeRumClient } from 'marketing-site/lib/datadog'
import { captureException, initSentry } from 'marketing-site/lib/sentry'
import { NONCE_TEMPLATE } from 'marketing-site/server/cspMiddleware'
import AssignedVariationsContext from 'marketing-site/src/components/context/AssignedVariationsContext'
import CurrentLocaleContext from 'marketing-site/src/components/context/CurrentLocaleContext'
import CurrentPathContext from 'marketing-site/src/components/context/CurrentPathContext'
import LocalesContext from 'marketing-site/src/components/context/LocalesContext'
import MarketoFormsContext, {
  IMarketoFormWithFields,
} from 'marketing-site/src/components/context/MarketoFormsContext'
import ServerPropsContext from 'marketing-site/src/components/context/ServerPropsContext'
import { ToggleProvider } from 'marketing-site/src/library/providers/toggleProvider'
import vendorCss from 'marketing-site/src/library/styles/vendor/vendor.scss'
import globalCss from 'marketing-site/src/styles/global.scss'
import App, { AppContext } from 'next/app'
import React from 'react'

let cachedMarketoForms: IMarketoFormWithFields[] = []

export default class MarketingSite extends App<{
  locales: Locale[]
  currentLocale: Locale
  nonce: string
  pageProps: unknown
  cookie: { [key: string]: string | number }
  marketoForms: IMarketoFormWithFields[]
}> {
  static async getInitialProps({ Component, ctx, router }: AppContext) {
    let pageProps: unknown = {}

    // https://github.com/intercom/intercom/issues/165031
    if (process.browser) window.location.reload()

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    const { default: getLocales, getLocaleFromCode } = await import('marketing-site/lib/getLocales')

    const localesResponse = await getLocales()
    const locales: Locale[] = localesResponse.items
    const currentLocale = await getLocaleFromCode(router.query.path && router.query.path[0])
    const { default: getAllMarketoForms } = await import(
      'marketing-site/lib/marketo/getAllMarketoForms'
    )

    let marketoForms: IMarketoFormWithFields[]
    if (!cachedMarketoForms.length) {
      marketoForms = await getAllMarketoForms()

      const { dev } = await import('marketing-site/lib/env')
      // only cache forms in dev
      if (dev) cachedMarketoForms = marketoForms
    } else {
      marketoForms = cachedMarketoForms
    }

    const { parseCookies } = await import('nookies')

    return {
      pageProps,
      locales,
      currentLocale,
      // @ts-ignore
      nonce: ctx?.req?.nonce || NONCE_TEMPLATE,
      cookie: parseCookies(ctx),
      marketoForms,
    }
  }

  async componentDidMount(): Promise<void> {
    initSentry()
    initializeRumClient()
  }

  componentDidCatch(error: any, errorInfo: any) {
    captureException(error, { extra: errorInfo })
  }

  render() {
    const {
      Component,
      pageProps,
      router: { pathname, query },
      locales,
      nonce,
      currentLocale,
      cookie,
      marketoForms,
    } = this.props

    return (
      <MarketoFormsContext.Provider value={marketoForms || []}>
        <ServerPropsContext.Provider value={{ nonce, query, cookie }}>
          <AssignedVariationsContext.Provider value={pageProps?.assignedVariations || {}}>
            <CurrentPathContext.Provider
              value={buildPath({ localeCode: currentLocale.code, pathname, preserveQuery: true })}
            >
              <LocalesContext.Provider value={locales}>
                <CurrentLocaleContext.Provider value={currentLocale}>
                  <ToggleProvider>
                    <style jsx>{globalCss}</style>
                    <style jsx>{vendorCss}</style>
                    <Component {...pageProps} nonce={nonce} query={query} />
                  </ToggleProvider>
                </CurrentLocaleContext.Provider>
              </LocalesContext.Provider>
            </CurrentPathContext.Provider>
          </AssignedVariationsContext.Provider>
        </ServerPropsContext.Provider>
      </MarketoFormsContext.Provider>
    )
  }
}
