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

import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'

import { parse } from 'query-string'

import { withTransaction } from '@elastic/apm-rum-react'

import Logout from './Logout'

import { logout } from '../../actions/auth'

import { ReduxState } from '../../types'

interface StateProps {}

type DispatchProps = {
  logout: ({ redirectTo }: { redirectTo?: string }) => void
}

interface ConsumerProps extends RouteComponentProps {}

const mapStateToProps = (_state: ReduxState, { location }: ConsumerProps): StateProps => {
  const { search } = location
  const { redirectTo, reason } = parse(search.slice(1))

  return {
    isUnauthorised: reason === 'unauthorised',
    redirectTo: typeof redirectTo === `string` ? redirectTo : undefined,
  }
}

const mapDispatchToProps: DispatchProps = {
  logout,
}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(withTransaction('Logout', `component`)(Logout))
