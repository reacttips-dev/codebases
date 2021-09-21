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

import ResourceExternalLinks from './ResourceExternalLinks'

import { isFeatureActivated, getConfigForKey } from '../../../selectors'

import Feature from '../../../lib/feature'

import { AnyResourceInfo, SliderInstanceType, ReduxState } from '../../../types'

type StateProps = {
  saasClusterMetrics: boolean
  hideExternalLinks: boolean
}

interface DispatchProps {}

type ConsumerProps = {
  resource?: AnyResourceInfo
  sliderInstanceType: SliderInstanceType
  wrapWithFlexItem?: boolean
}

const mapStateToProps = (state: ReduxState): StateProps => {
  const isAnyUserconsole = getConfigForKey(state, 'APP_NAME') === 'userconsole'

  return {
    saasClusterMetrics: isFeatureActivated(state, Feature.saasClusterMetrics),
    hideExternalLinks: isAnyUserconsole,
  }
}

const mapDispatchToProps: DispatchProps = {}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(ResourceExternalLinks)
