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

import React, { FunctionComponent } from 'react'

import { TrafficFilterRulesetInfo, TrafficFilterRule } from '../../lib/api/v1/types'

type Props = {
  rulesetType: TrafficFilterRulesetInfo['type']
  rule: TrafficFilterRule
}

const TrafficFilterRulesetRuleSource: FunctionComponent<Props> = ({ rulesetType, rule }) => {
  if (rulesetType === 'azure_private_endpoint') {
    return (
      <div>
        {rule.azure_endpoint_name}.{rule.azure_endpoint_guid}
      </div>
    )
  }

  return <div>{rule.source}</div>
}

export default TrafficFilterRulesetRuleSource
