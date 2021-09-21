/*
 * ELASTICSEARCH CONFIDENTIAL
 * __________________
 *
 *  Copyright Elasticsearch B.V. All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Elasticsearch B.V. and its suppliers, if any.
 * The intellectual and technical concepts contained herein
 * are proprietary to Elasticsearch B.V. and its suppliers and
 * may be covered by U.S. and Foreign Patents, patents in
 * process, and are protected by trade secret or copyright
 * law.  Dissemination of this information or reproduction of
 * this material is strictly forbidden unless prior written
 * permission is obtained from Elasticsearch B.V.
 */
import { ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'

import ApiKeys from './ApiKeys'

import {
  fetchApiKeys,
  generateApiKey,
  resetRevokeKeyRequest,
  revokeApiKey,
} from '../../actions/apiKeys'

import {
  fetchApiKeysRequest,
  generateApiKeyRequest,
  getApiKeys,
  revokeApiKeyRequest,
  getAuthenticationInfo,
} from '../../reducers'

import { getConfigForKey } from '../../selectors'

import { showApiKeys } from '../UserSettings/helpers'

import { AsyncRequestState, ThunkDispatch } from '../../types'
import { AuthenticationInfo } from '../../lib/api/v1/types'

interface StateProps {
  apiKeys: any[]
  authenticationInfo: AuthenticationInfo | null
  fetchKeysRequest: AsyncRequestState
  revokeApiKeyRequest: AsyncRequestState
  generateKeyRequest: AsyncRequestState
  showApiKeys: boolean
}

interface DispatchProps {
  fetchApiKeys: () => Promise<any>
  revokeApiKey: (keyId: string) => Promise<any>
  resetRevokeKeyRequest: () => void
  generateApiKey: (key: { description: string }) => Promise<any>
}

type ConsumerProps = {
  eceTitle?: string | ReactElement<typeof FormattedMessage>
  eceDisplay?: boolean
}

const mapStateToProps = (state): StateProps => {
  const apiKeys = getApiKeys(state)
  const authenticationInfo = getAuthenticationInfo(state)

  // ESS AC, ESSP AC, GovCloud AC, etc.
  const isAnySaasAdminconsole =
    getConfigForKey(state, `APP_PLATFORM`) === `saas` &&
    getConfigForKey(state, `APP_NAME`) === `adminconsole`

  return {
    apiKeys,
    authenticationInfo,
    fetchKeysRequest: fetchApiKeysRequest(state),
    revokeApiKeyRequest: revokeApiKeyRequest(state),
    generateKeyRequest: generateApiKeyRequest(state),
    showApiKeys: showApiKeys(state) || isAnySaasAdminconsole,
  }
}

const mapDispatchToProps: (dispatch: ThunkDispatch, ownProps: ConsumerProps) => DispatchProps = (
  dispatch,
) => ({
  fetchApiKeys: () => dispatch(fetchApiKeys()),
  revokeApiKey: (keyId) => dispatch(revokeApiKey(keyId)),
  resetRevokeKeyRequest: () => dispatch(resetRevokeKeyRequest()),
  generateApiKey: (apiKey) => dispatch(generateApiKey(apiKey)),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(ApiKeys)
