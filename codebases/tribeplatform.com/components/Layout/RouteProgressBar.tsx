import React from 'react'

import { useToken } from '@chakra-ui/react'
import NextNprogress from 'nextjs-progressbar'

const RouteProgressBar = () => {
  const [accentBase] = useToken('colors', ['accent.base'])
  return (
    <NextNprogress
      color={accentBase}
      stopDelayMs={200}
      options={{ showSpinner: false }}
    />
  )
}

export default RouteProgressBar
