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

import React from 'react'

import { FormattedMessage } from 'react-intl'

import { EuiRadio, EuiSpacer } from '@elastic/eui'

import Field, { CompositeField, Description, Label } from '../Field'

import StrategyExplained from '../StrategyExplained'

import {
  isAutodetect,
  isGrowAndShrink,
  isRollingByName,
  isRollingGrowAndShrink,
  strategies,
  Strategy,
} from '../../lib/clusterStrategies'

import './strategies.scss'

type Props = {
  strategy: Strategy
  onUpdate: (strategy: Strategy) => void
}

function Strategies({ strategy, onUpdate }: Props) {
  return (
    <Field className='strategies-container'>
      <Label>
        <FormattedMessage
          id='deployment-configure-strategies.strategy-label'
          defaultMessage='Configuration Strategy'
        />
      </Label>
      <Description>
        <FormattedMessage
          id='deployment-configure-strategies.strategy-description'
          defaultMessage='Control how configuration changes are applied to your deployment:'
        />
      </Description>
      <CompositeField>
        <EuiSpacer size='s' />

        <EuiRadio
          id='strategy-autodetect'
          name='strategy'
          checked={isAutodetect(strategy)}
          onChange={() => onUpdate(strategies.autodetect)}
          label={<StrategyExplained strategy={strategies.autodetect} />}
        />

        <EuiSpacer size='s' />

        <EuiRadio
          id='strategy-rolling'
          name='strategy'
          checked={isRollingByName(strategy)}
          onChange={() => onUpdate(strategies.rollingByName)}
          label={<StrategyExplained strategy={strategies.rollingByName} />}
        />

        <EuiSpacer size='s' />

        <EuiRadio
          id='strategy-create-new'
          name='strategy'
          checked={isGrowAndShrink(strategy)}
          onChange={() => onUpdate(strategies.growAndShrink)}
          label={<StrategyExplained strategy={strategies.growAndShrink} />}
        />

        <EuiSpacer size='s' />

        <EuiRadio
          id='strategy-rolling-create-new'
          name='strategy'
          checked={isRollingGrowAndShrink(strategy)}
          onChange={() => onUpdate(strategies.rollingGrowAndShrink)}
          label={<StrategyExplained strategy={strategies.rollingGrowAndShrink} />}
        />
      </CompositeField>
    </Field>
  )
}

export default Strategies
