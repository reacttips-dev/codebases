import React, { Suspense } from 'react'

import Loader from '../Loader'
import { Box } from '../Grid'
import { Main } from '../Layout'
import { LoadingPage, LoadingLayout } from '../Loading'

//eslint-disable-next-line react/display-name
const LazyComponent = Component => props => (
  <Suspense fallback={<LoadingRoute />}>
    <Component {...props} />
  </Suspense>
)

//eslint-disable-next-line react/display-name
export const LazyLoadingMainComponent = Component => props => (
  <Main>
    <Suspense fallback={<Loader />}>
      <Component {...props} />
    </Suspense>
  </Main>
)

//eslint-disable-next-line react/display-name
export const LazyPageComponent = Component => props => (
  <Box m={3}>
    <Suspense fallback={<LoadingPage />}>
      <Component {...props} />
    </Suspense>
  </Box>
)

//eslint-disable-next-line react/display-name
export const LazyLayoutComponent = Component => props => (
  <Suspense fallback={<LoadingLayout />}>
    <Component {...props} />
  </Suspense>
)

export const LoadingRoute = () => (
  <div style={{ height: 'calc(100vh - 60px - 48px - 15px)' }} />
)

export { default as LazyLoadingRoute } from './Route'
export default LazyComponent
