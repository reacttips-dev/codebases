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

import StrategyName from './StrategyName'
import StrategyExplainerTooltip from './StrategyExplainerTooltip'

import { Strategy } from '../../types'

type Props = {
  strategy: Strategy
}

const StrategyExplained: FunctionComponent<Props> = ({ strategy }) => (
  <StrategyExplainerTooltip strategy={strategy}>
    <StrategyName strategy={strategy} />
  </StrategyExplainerTooltip>
)

export default StrategyExplained

export { StrategyName, StrategyExplainerTooltip }
