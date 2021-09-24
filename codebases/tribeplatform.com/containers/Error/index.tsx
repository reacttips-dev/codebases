import React from 'react'

import ForbiddenError from './ForbiddenError'
import NotFoundError from './NotFoundError'
import ServerError from './ServerError'

const errorComponents = {
  102: ForbiddenError,
  403: ForbiddenError,
  404: NotFoundError,
  500: ServerError,
}

interface ErrorProps {
  /** @TODO Exact TypeScript structure will be set later */
  error?: any
}

export const Error = ({ error }: ErrorProps) => {
  if (error) {
    const code =
      error.code ||
      error.graphQLErrors?.[0]?.code ||
      Number(error.graphQLErrors?.[0]?.code) ||
      error.status ||
      error.response?.statusCode

    const ErrorComponent = errorComponents[code] || errorComponents['500']

    return <ErrorComponent error={error} />
  }
  // In the case Error is not instance of of Graphql or axios error
  const ErrorComponent = errorComponents['500']
  return <ErrorComponent />
}

export default Error
