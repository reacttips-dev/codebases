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
import { withRouter } from 'react-router-dom'

import HerokuAppRoot from './HerokuAppRoot'

import { startHerokuAuthHandshake } from '../../../../../actions/heroku'

import { herokuAuthHandshakeRequest } from '../../../../../reducers'

import { getConfigForKey } from '../../../../../selectors'

import { parseHerokuAuthenticationParams } from '../../../../../lib/heroku'
import { SAD_hasUnexpiredSession } from '../../../../../lib/auth'

import { AsyncRequestState, HerokuAuthenticationParams } from '../../../../../types'

type StateProps = {
  isHeroku: boolean
  isHerokuAuthenticated: boolean
  herokuAuthenticationParams: HerokuAuthenticationParams | null
  herokuAuthHandshakeRequest: AsyncRequestState
}

type DispatchProps = {
  startHerokuAuthHandshake: (authParams: HerokuAuthenticationParams) => void
}

type ConsumerProps = RouteComponentProps

const mapStateToProps = (state, { location }) => {
  const query = parse(location.search.slice(1))
  const isHeroku = getConfigForKey(state, `APP_FAMILY`) === `heroku`
  const isHerokuAuthenticated = isHeroku && SAD_hasUnexpiredSession()
  const herokuAuthenticationParams = isHeroku ? parseHerokuAuthenticationParams(query) : null

  return {
    isHeroku,
    isHerokuAuthenticated,
    herokuAuthenticationParams,
    herokuAuthHandshakeRequest: herokuAuthHandshakeRequest(state),
  }
}

const mapDispatchToProps = (dispatch): DispatchProps => ({
  startHerokuAuthHandshake: (authParams: HerokuAuthenticationParams) =>
    dispatch(startHerokuAuthHandshake(authParams)),
})

export default withRouter(
  connect<StateProps, DispatchProps, ConsumerProps>(
    mapStateToProps,
    mapDispatchToProps,
  )(HerokuAppRoot),
)
