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

import { withTransaction } from '@elastic/apm-rum-react'

import OverviewEnabled from './OverviewEnabled'

import { isFeatureActivated } from '../../../selectors'
import Feature from '../../../lib/feature'

type StateProps = {
  showNativeMemoryPressure: boolean
}

const mapStateToProps = (state: any): StateProps => ({
  showNativeMemoryPressure: isFeatureActivated(state, Feature.showNativeMemoryPressure),
})

export default connect(mapStateToProps)(
  withTransaction(`Slider overview`, `component`)(OverviewEnabled),
)
