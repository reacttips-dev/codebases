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

import NotFound from './NotFound'

import { getTheme } from '../../../reducers'
import { getConfigForKey } from '../../../selectors'

import { SAD_hasUnexpiredSession } from '../../../lib/auth'

import { bless } from '../../../lib/router'

import { Theme, ReduxState } from '../../../types'

type StateProps = {
  theme: Theme
  showLoginButton: boolean
}

interface DispatchProps {}

interface ConsumerProps {}

const mapStateToProps = (state: ReduxState): StateProps => ({
  theme: getTheme(state),
  showLoginButton: showLoginButton(state),
})

const mapDispatchToProps: DispatchProps = {}

export default bless(
  connect<StateProps, DispatchProps, ConsumerProps>(mapStateToProps, mapDispatchToProps)(NotFound),
)

function showLoginButton(state: ReduxState): boolean {
  if (getConfigForKey(state, `CLOUD_UI_APP`) === `saas-sku-picker`) {
    return false
  }

  return !SAD_hasUnexpiredSession()
}
