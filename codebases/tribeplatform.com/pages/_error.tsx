import React from 'react'

import { GetServerSideFuncResult } from '@types'

import { logger } from 'lib/logger'

import { Error as ErrorComponent } from '../containers/Error'

export declare type ErrorPageProps = {
  err: Error | string
}

export const ErrorPage = ({ err }: ErrorPageProps): JSX.Element => {
  const message = typeof err === 'string' ? err : err?.message
  logger.error(`ErrorPage - ${message}`, { err })
  return <ErrorComponent error={err} />
}

export const getServerSideProps = ({ res, err }): GetServerSideFuncResult => {
  let statusCode = 404
  if (res?.statusCode) {
    statusCode = res.statusCode
  } else if (err?.statusCode) {
    statusCode = err.statusCode
  }

  return {
    props: {
      statusCode,
      namespacesRequired: ['errorpage'],
      seo: null,
    },
  }
}

export default ErrorPage
