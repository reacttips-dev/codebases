import React, { ReactElement } from 'react'

import { IntercomProvider } from 'react-use-intercom'

import { logger } from '@tribefrontend/logger'
import { AuthToken, RoleType } from 'tribe-api'

import useAuthToken from 'hooks/useAuthToken'

import { getRuntimeConfigVariable } from 'utils/config'

const Intercom: React.FC<{
  children: ReactElement
  authToken: AuthToken | null | undefined
}> = ({ children, authToken }): ReactElement | null => {
  const { authToken: clientAuthToken } = useAuthToken()
  const authUser = authToken?.member || clientAuthToken?.member
  if (!authUser || authUser?.role?.type !== RoleType.ADMIN) {
    return children
  }

  const appId = getRuntimeConfigVariable('SHARED_INTERCOM_APP_ID')

  if (!appId) {
    logger.warn('intercom app id is not defined')
    return children
  }

  return <IntercomProvider appId={appId}>{children}</IntercomProvider>
}

export default Intercom
