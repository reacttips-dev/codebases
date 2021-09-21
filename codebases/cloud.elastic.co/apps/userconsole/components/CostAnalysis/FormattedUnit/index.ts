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
import FormattedUnit from './FormattedUnit'

import { getProfile } from '../../../reducers'
import { isPrepaidConsumptionCustomer } from '../../../../../lib/billing'
import { UserProfile } from '../../../../../types'

interface DispatchProps {}

interface StateProps {
  isPrepaidConsumptionUser: boolean
}

const mapStateToProps = (state): StateProps => {
  const profile = getProfile(state) as UserProfile
  return {
    isPrepaidConsumptionUser: isPrepaidConsumptionCustomer(profile),
  }
}

const mapDispatchToProps: DispatchProps = {}

export default connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps,
)(FormattedUnit)
