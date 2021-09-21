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

import { parse } from 'query-string'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'

import { withTransaction } from '@elastic/apm-rum-react'

import PartnerSignup from './PartnerSignup'

import { signUpGcpUser, signUpAwsUser, signUpAzureUser, PartnerUser } from '../../actions/partner'

import { signUpAwsUserRequest, signUpGcpUserRequest, signUpAzureUserRequest } from '../../reducers'

import { getTheme } from '../../../../reducers'

import { AsyncRequestState, ReduxState, Theme } from '../../../../types'

type SignupRequestMetaData = { meta: { email: string } }

type StateProps = {
  signUpPartnerUserRequest: AsyncRequestState & SignupRequestMetaData
  token: string
  partner: string
  theme: Theme
}

type DispatchProps = {
  signUpGcpUser: (token: any, args: PartnerUser) => void
  signUpAwsUser: (token: any, args: PartnerUser) => void
  signUpAzureUser: (token: any, args: PartnerUser) => void
}

const mapStateToProps = (state, { location }: RouteComponentProps): StateProps => {
  const query = parse(location.search.slice(1))
  const token = String(query.token)
  const partner = String(query.partner)

  const signUpPartnerUserRequest = getSignUpPartnerUserRequest(partner)
  return {
    signUpPartnerUserRequest: signUpPartnerUserRequest(state),
    token,
    partner,
    theme: getTheme(state),
  }
}

function getSignUpPartnerUserRequest(
  partner: string,
): (state: ReduxState, ...crumbs: Array<string | null>) => AsyncRequestState {
  if (partner === `gcp`) {
    return signUpGcpUserRequest
  }

  if (partner === `azure`) {
    return signUpAzureUserRequest
  }

  return signUpAwsUserRequest
}

export default connect<StateProps, DispatchProps, RouteComponentProps>(mapStateToProps, {
  signUpGcpUser,
  signUpAwsUser,
  signUpAzureUser,
})(withTransaction(`Partner signup`, `component`)(PartnerSignup))
