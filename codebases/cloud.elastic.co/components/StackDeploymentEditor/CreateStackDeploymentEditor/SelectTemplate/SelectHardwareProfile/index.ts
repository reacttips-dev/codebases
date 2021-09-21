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

import SelectHardwareProfile from './SelectHardwareProfile'

import { getProfile } from '../../../../../apps/userconsole/reducers'
import { getConfigForKey } from '../../../../../selectors'
import { inTrial } from '../../../../../lib/trial'

type StateProps = {
  inTrial: boolean
  isUserconsole: boolean
}

interface DispatchProps {}

interface ConsumerProps {}

const mapStateToProps = (state): StateProps => {
  const profile = getProfile(state)
  const isUserconsole = getConfigForKey(state, `APP_NAME`) === `userconsole`

  return {
    inTrial: inTrial({ profile }),
    isUserconsole,
  }
}

const mapDispatchToProps: DispatchProps = {}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(SelectHardwareProfile)
