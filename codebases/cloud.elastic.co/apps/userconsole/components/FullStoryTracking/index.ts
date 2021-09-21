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

import FullStoryTracking from './FullStoryTracking'

import { isFeatureActivated, getConfigForKey } from '../../../../selectors'

import { bless } from '../../../../lib/router'

import Feature from '../../../../lib/feature'

type StateProps = {
  isFullStoryEnabled: boolean
  fullStoryId: string
}

interface DispatchProps {}

interface ConsumerProps {}

const mapStateToProps = (state): StateProps => ({
  isFullStoryEnabled: isFeatureActivated(state, Feature.userconsoleRunFullStory),
  fullStoryId: getConfigForKey(state, `CLOUD_USERCONSOLE_FULLSTORY_ID`),
})

const mapDispatchToProps = () => ({})

export default bless(
  connect<StateProps, DispatchProps, ConsumerProps>(
    mapStateToProps,
    mapDispatchToProps,
  )(FullStoryTracking),
)
