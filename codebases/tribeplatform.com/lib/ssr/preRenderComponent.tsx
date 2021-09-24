import Head from 'next/head'

import { logger } from '@tribefrontend/logger'

import NextApp from '../../pages/_app'

export const PreRenderComponent = async (context, Component, props, router) => {
  if (!Component) {
    return
  }

  // Run all GraphQL queries in the component tree and extract the resulting data
  try {
    // Import `@apollo/react-ssr` dynamically.
    // We don't want to have this in our client bundle.
    const { getDataFromTree } = await import('@apollo/react-ssr')
    // solution from https://github.com/vercel/next.js/discussions/11957
    const { RouterContext } = await import(
      'next/dist/next-server/lib/router-context'
    )

    const PrerenderComponent = () => (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      <NextApp
        Component={Component}
        pageProps={{
          ...props,
          apolloClient: context.apolloClient,
        }}
        router={router}
      />
    )

    await getDataFromTree(
      <RouterContext.Provider value={router}>
        <PrerenderComponent />
      </RouterContext.Provider>,
    )
  } catch (error) {
    // Prevent Apollo Client GraphQL errors from crashing SSR.
    // Handle them in components via the data.error prop:
    // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
    logger.error('Error while running `getDataFromTree`', error)
  }

  // getDataFromTree does not call componentWillUnmount
  // head side effect therefore need to be cleared manually
  Head.rewind()
}
