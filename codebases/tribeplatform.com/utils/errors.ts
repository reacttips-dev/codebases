import { ErrorResponse } from '@apollo/client/link/error'

import { ApiErrorCodes, ApiErrorResponse } from 'tribe-api/interfaces'

/**
 * Gathers GraphQL error if exists and compares
 * it's code with backend's error codes.
 * Otherwise just returns the error itself
 *
 * @param {Error} err - Error object from catch statement
 */
export const getActualError = err => {
  const graphQLError = err?.graphQLErrors?.[0]
  const errorObject = graphQLError?.errors?.[0] || graphQLError || err
  const errorCode = errorObject?.subcode || errorObject?.code

  // If the domain wasn't found
  if (errorCode === ApiErrorCodes.RESOURCE_NOT_FOUND) {
    return {
      ...errorObject,
      code: 404,
    }
  }

  return errorObject
}

export const extractApiError = (
  error: ErrorResponse,
): ApiErrorResponse | undefined => {
  return (error?.graphQLErrors?.[0] as unknown) as ApiErrorResponse
}
