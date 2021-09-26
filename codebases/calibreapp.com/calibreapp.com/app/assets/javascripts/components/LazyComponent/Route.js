import React, { Suspense } from 'react'

//eslint-disable-next-line react/display-name
const Route = Component => props => (
  <Suspense
    fallback={<div style={{ height: 'calc(100vh - 60px - 48px - 15px)' }} />}
  >
    <Component {...props} />
  </Suspense>
)

export default Route
