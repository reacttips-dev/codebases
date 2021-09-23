import { NextPageContextApp } from '@types'
import Cookies from 'cookies'

import { AuthToken } from 'tribe-api/interfaces/interface.generated'

import { isExpired, parseToken } from 'lib/accessToken'

import { initializeApollo } from './apollo'
import { logger } from './logger'

/**
 * Installs the Apollo Client on NextPageContext
 * or NextAppContext. Useful if you want to use apolloClient
 * inside getStaticProps, getStaticPaths or getServerSideProps
 */
export const initContextClientSide = (ctx: NextPageContextApp) => {
  const apolloClient =
    ctx.apolloClient || initializeApollo(ctx.apolloState || {}, ctx)

  ctx.apolloClient = apolloClient
}

export const initOnContext = (ctx: NextPageContextApp): NextPageContextApp => {
  const { req, res } = ctx
  const { headers, method, url } = req || {}

  const message = `${method} ${url}`
  logger.debug(message, {
    headers,
  })

  const inAppContext = Boolean(ctx.ctx)

  // We consider installing `withApollo({ ssr: true })` on global App level
  // as antipattern since it disables project wide Automatic Static Optimization.
  if (process.env.NODE_ENV === 'development') {
    if (inAppContext) {
      logger.warn(
        'Warning: You have opted-out of Automatic Static Optimization due to `withApollo` in `pages/_app`.\n' +
          'Read more: https://err.sh/next.js/opt-out-auto-static-optimization\n',
      )
    }
  }

  const accessToken =
    ctx?.authToken?.accessToken || new Cookies(req, res).get('accessToken')

  const jwtToken = parseToken(accessToken)
  if (jwtToken && !isExpired(jwtToken)) {
    ctx.authToken = { ...ctx.authToken, accessToken } as AuthToken
  } else {
    ctx.authToken = null
  }

  // Initialize ApolloClient if not already done
  // TODO: Add proper types here:
  // https://github.com/zeit/next.js/issues/9542
  const apolloClient =
    ctx.apolloClient ||
    initializeApollo(ctx.apolloState || {}, inAppContext ? ctx.ctx : ctx)

  // We send the Apollo Client as a prop to the component to avoid calling initApollo() twice in the server.
  // Otherwise, the component would have to call initApollo() again but this
  // time without the context. Once that happens, the following code will make sure we send
  // the prop as `null` to the browser.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  apolloClient.toJSON = () => null

  // Add apolloClient to NextPageContext & NextAppContext.
  // This allows us to consume the apolloClient inside our
  // custom `getInitialProps({ apolloClient })`.
  ctx.apolloClient = apolloClient
  if (inAppContext) {
    ctx.ctx.apolloClient = apolloClient
  }

  return ctx
}
