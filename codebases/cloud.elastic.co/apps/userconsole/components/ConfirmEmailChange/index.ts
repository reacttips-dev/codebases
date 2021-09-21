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

import ConfirmEmailChange from './ConfirmEmailChange'

import { confirmEmailChange } from '../../actions/account'

import { confirmEmailChangeRequest } from '../../reducers'

const mapStateToProps = (state, { location }) => {
  const query = parse(location.search.slice(1))

  return {
    email: String(query.email),
    newEmail: String(query.new),
    expires: Number.parseInt(String(query.e), 10),
    hash: String(query.h),
    confirmEmailChangeRequest: confirmEmailChangeRequest(state),
  }
}

const mapDispatchToProps = {
  confirmEmailChange,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTransaction(`Confirm email change`, `component`)(ConfirmEmailChange))
