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
import { RouteComponentProps, withRouter } from 'react-router'

import Header from './Header'

import { ReduxState } from '../../../../types'

interface DispatchProps {}

interface ConsumerProps extends RouteComponentProps {}

interface StateProps {
  locationQueryString: string
}

const mapStateToProps = (_state: ReduxState, { location }: ConsumerProps): StateProps => {
  const { search } = location

  return {
    locationQueryString: search,
  }
}

export default withRouter(
  connect<StateProps, DispatchProps, ConsumerProps>(mapStateToProps)(Header),
)
