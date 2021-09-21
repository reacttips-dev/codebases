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
import { withTransaction } from '@elastic/apm-rum-react'

import VerifyMonitoringEmail from './VerifyMonitoringEmail'

import { whitelistMonitoringEmail } from '../../actions/account'

import { whitelistMonitoringEmailRequest } from '../../reducers'

const mapStateToProps = (state, { location }) => {
  const query = parse(location.search.slice(1))

  return {
    email: String(query.email),
    expires: Number.parseInt(String(query.e), 10),
    hash: String(query.h),
    whitelistMonitoringEmailRequest: whitelistMonitoringEmailRequest(state),
  }
}

export default connect(mapStateToProps, { whitelistMonitoringEmail })(
  withTransaction(`Verify monitoring email`, `component`)(VerifyMonitoringEmail),
)
