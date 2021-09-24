import { AppPageProps, AuthServerSideProps, NextPageContextApp } from '@types'
import absoluteUrl from 'next-absolute-url'

import { AuthToken, GetTokensQuery, GetTokensQueryVariables } from 'tribe-api'
import { GET_TOKENS } from 'tribe-api/graphql'

import { initOnContext, initContextClientSide } from 'lib/context'

import { PreRenderComponent } from './preRenderComponent'

/**
 * This function will populate the context with a rich data on server side only eg. apolloClient
 * @param context NextJs Context
 * @param options Option to compile the page component
 * @returns pageProps
 */
export const getAppInitialProps = async (
  context: NextPageContextApp,
  options: AuthServerSideProps | undefined = {},
  router,
) => {
  const isClient = typeof window !== 'undefined'
  try {
    let optimizelyDatafile
    let intercomUserHash

    if (!isClient) {
      initOnContext(context)
      const { getAppSSRInitialProps } = await import('./getAppSSRInitialProps')
      const response = await getAppSSRInitialProps(context, options)
      optimizelyDatafile = response.optimizelyDatafile || null
      intercomUserHash = response.intercomUserHash || null
    } else {
      initContextClientSide(context)
      // Read authToken from the cache and set it on the context route change
      if (context?.apolloClient) {
        const response = await context.apolloClient.readQuery<
          GetTokensQuery,
          GetTokensQueryVariables
        >({
          query: GET_TOKENS,
        })
        if (response?.getTokens) {
          context.authToken = response?.getTokens as AuthToken
        }
      }
    }

    const props: AppPageProps = {
      optimizelyDatafile,
      authToken: context?.authToken,
      intercomUserHash,
      origin: isClient
        ? window.location.origin
        : absoluteUrl(context?.req)?.origin,
      userAgent: isClient
        ? window.navigator.userAgent
        : context?.req?.headers['user-agent'],
    }

    // When redirecting, the response is finished.
    // No point in continuing to render
    if (context.res && context.res.finished) {
      return { props }
    }

    // PreRender the component to run all the quries once on the SSR
    if (!isClient && options?.ssr?.Component) {
      await PreRenderComponent(context, options?.ssr?.Component, props, router)
    }

    return props
  } catch (error) {
    const graphQLError =
      error?.graphQLErrors?.[0]?.errors?.[0] || error?.graphQLErrors?.[0]

    return {
      origin: isClient
        ? window.location.origin
        : absoluteUrl(context?.req)?.origin,
      userAgent: isClient
        ? window.navigator.userAgent
        : context?.req?.headers['user-agent'],
      optimizelyDatafile: null,
      authToken: context?.authToken,
      error: {
        ...error,
        code:
          error?.code ||
          error?.status ||
          error?.response?.statusCode ||
          graphQLError?.code ||
          500,
        message:
          error?.message ||
          error?.response?.message ||
          graphQLError?.message ||
          'Something went wrong',
      },
    }
  }
}
