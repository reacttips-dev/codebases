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

import { isEmpty } from 'lodash'
import { parse, stringify, ParsedQuery } from 'query-string'

import { RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'

import SsoErrors from './SsoErrors'

import { SAD_hasUnexpiredSession } from '../../../lib/auth'

import { portalUrl } from '../../../lib/urlBuilder'
import history from '../../../lib/history'

import Feature from '../../../lib/feature'
import { isFeatureActivated } from '../../../selectors'

type StateProps = {
  loggedIn: boolean
  isPortalFeatureEnabled: boolean
  errorCode: string | null
}

type DispatchProps = {
  redirectToPortal: () => void
}

type ConsumerProps = RouteComponentProps

const mapStateToProps = (state, { location }: ConsumerProps): StateProps => {
  const query = parse(location.search.slice(1))
  const errorCode = parseErrorCodeQueryStringParameter(query)
  const isPortalFeatureEnabled = isFeatureActivated(state, Feature.cloudPortalEnabled)

  return {
    loggedIn: SAD_hasUnexpiredSession(),
    errorCode,
    isPortalFeatureEnabled,
  }
}

const mapDispatchToProps = (dispatch, { location }: ConsumerProps): DispatchProps => {
  const query = parse(location.search.slice(1))
  const errorCode = parseErrorCodeQueryStringParameter(query)

  const queryString = stringify({
    error_code: errorCode,
  })

  const portalUrlWithQueryString = `${portalUrl()}?${queryString}`

  return {
    redirectToPortal: () => dispatch(() => history.replace(portalUrlWithQueryString)),
  }
}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(SsoErrors)

function parseErrorCodeQueryStringParameter(query: ParsedQuery): string | null {
  if (isEmpty(query.error_code)) {
    return null
  }

  if (Array.isArray(query.error_code)) {
    return null
  }

  return query.error_code!
}
