import React from 'react'

import { Center } from '@chakra-ui/react'
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'

import { logger } from '@tribefrontend/logger'

import { ErrorDisclosure } from 'containers/Error/ErrorDisclosure'

const defaultErrorHandler = (
  error: Error,
  info: { componentStack: string },
) => {
  logger.error(error.message, error, info)
}

const FallbackComponent = () => (
  <Center my={10} height="100%">
    <ErrorDisclosure />
  </Center>
)

export const ErrorBoundary = ({ children }) => {
  return (
    <ReactErrorBoundary
      FallbackComponent={FallbackComponent}
      onError={defaultErrorHandler}
    >
      {children}
    </ReactErrorBoundary>
  )
}
