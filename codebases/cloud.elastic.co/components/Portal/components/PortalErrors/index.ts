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
import { parse, ParsedQuery } from 'query-string'

import { withRouter, RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'

import PortalErrors from './PortalErrors'

type StateProps = {
  ssoErrorCode: string | null
}

interface DispatchProps {}

type ConsumerProps = RouteComponentProps

const mapStateToProps = (_state, { location }: ConsumerProps): StateProps => {
  const query = parse(location.search.slice(1))
  const ssoErrorCode = parseErrorCodeQueryStringParameter(query)

  return {
    ssoErrorCode,
  }
}

const mapDispatchToProps: DispatchProps = {}

export default withRouter(
  connect<StateProps, DispatchProps, ConsumerProps>(
    mapStateToProps,
    mapDispatchToProps,
  )(PortalErrors),
)

function parseErrorCodeQueryStringParameter(query: ParsedQuery): string | null {
  if (isEmpty(query.error_code)) {
    return null
  }

  if (Array.isArray(query.error_code)) {
    return null
  }

  return query.error_code!
}
