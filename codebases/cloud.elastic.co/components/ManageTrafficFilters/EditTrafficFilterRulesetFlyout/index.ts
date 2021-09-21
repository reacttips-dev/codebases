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

import EditTrafficFilterRulesetFlyout from './EditTrafficFilterRulesetFlyout'

import { fetchRegionListIfNeeded } from '../../../actions/regionEqualizer'

import {
  createTrafficFilterRuleset,
  updateTrafficFilterRuleset,
} from '../../../actions/trafficFilters'

import {
  createTrafficFilterRulesetRequest,
  fetchRegionListRequest,
  getRegionIds,
  getRegionName,
  updateTrafficFilterRulesetRequest,
} from '../../../reducers'

import { getConfigForKey } from '../../../selectors'

import { TrafficFilterRulesetInfo, TrafficFilterRulesetRequest } from '../../../lib/api/v1/types'
import { AsyncRequestState } from '../../../types'

type StateProps = {
  fetchRegionListRequest: AsyncRequestState
  saveRulesetRequest: (ruleset: TrafficFilterRulesetRequest) => AsyncRequestState
  regionIds?: string[] | null
  defaultRegionId?: string
  getRegionName: (regionId: string) => string
}

type DispatchProps = {
  fetchRegionList: () => Promise<void>
  saveRuleset: (ruleset: TrafficFilterRulesetRequest) => Promise<void>
}

type ConsumerProps = {
  rulesetUnderEdit: TrafficFilterRulesetInfo | null
  onClose: () => void
}

const mapStateToProps = (state, { rulesetUnderEdit }: ConsumerProps): StateProps => ({
  regionIds: getRegionIds(state),
  getRegionName: (regionId) => getRegionName(state, regionId),
  fetchRegionListRequest: fetchRegionListRequest(state),
  saveRulesetRequest: (ruleset: TrafficFilterRulesetRequest) =>
    rulesetUnderEdit === null
      ? createTrafficFilterRulesetRequest(state, ruleset.region)
      : updateTrafficFilterRulesetRequest(state, ruleset.region, rulesetUnderEdit.id!),
  defaultRegionId: getConfigForKey(state, `DEFAULT_REGION`),
})

const mapDispatchToProps = (
  dispatch,
  { rulesetUnderEdit, onClose }: ConsumerProps,
): DispatchProps => ({
  fetchRegionList: () => dispatch(fetchRegionListIfNeeded()),
  saveRuleset: (ruleset: TrafficFilterRulesetRequest) =>
    (rulesetUnderEdit === null
      ? dispatch(
          createTrafficFilterRuleset({
            regionId: ruleset.region,
            ruleset,
          }),
        )
      : dispatch(
          updateTrafficFilterRuleset({
            regionId: rulesetUnderEdit.region,
            rulesetId: rulesetUnderEdit.id!,
            ruleset,
          }),
        )
    ).then(onClose),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(EditTrafficFilterRulesetFlyout)
