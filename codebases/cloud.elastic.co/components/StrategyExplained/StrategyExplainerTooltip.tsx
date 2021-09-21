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

import React, { FunctionComponent, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiIcon, EuiText, EuiSpacer, EuiToolTip } from '@elastic/eui'

import {
  allowsInlineResize,
  isGrowAndShrink,
  isRollingAll,
  isRollingByName,
  isRollingByNameInline,
  isRollingByZone,
  isRollingGrowAndShrink,
} from '../../lib/clusterStrategies'

import { Strategy } from '../../types'

type Props = {
  strategy: Strategy
}

const StrategyExplainerTooltip: FunctionComponent<Props> = ({ strategy, children }) => {
  const tooltipContent = getTooltipContent(strategy)

  if (tooltipContent === null) {
    return <Fragment>{children}</Fragment>
  }

  return (
    <EuiToolTip content={tooltipContent}>
      <Fragment>
        <span>{children}</span>
        <span>&nbsp;</span>
        <EuiIcon type='questionInCircle' />
      </Fragment>
    </EuiToolTip>
  )
}

function getTooltipContent(strategy: Strategy) {
  const rollingStrategyDescription = getRollingStrategyDescription(strategy)

  if (rollingStrategyDescription) {
    return (
      <Fragment>
        {rollingStrategyDescription}

        {isRollingByNameInline(strategy) && (
          <Fragment>
            <EuiSpacer size='xs' />

            <EuiText size='xs'>
              <FormattedMessage
                id='strategy-explainer-tooltip.rolling-by-name-inline-strategy-recommendation'
                defaultMessage='Recommended for most configuration changes.'
              />
            </EuiText>
          </Fragment>
        )}
      </Fragment>
    )
  }

  if (isRollingGrowAndShrink(strategy)) {
    return (
      <Fragment>
        <FormattedMessage
          id='strategy-explainer-tooltip.rolling-grow-and-shrink-strategy-description'
          defaultMessage='One node at a time. Creates nodes with the new configuration, then migrates data from the old nodes.'
        />

        <EuiSpacer size='xs' />

        <EuiText size='xs'>
          <FormattedMessage
            id='strategy-explainer-tooltip.rolling-grow-and-shrink-strategy-note'
            defaultMessage='This strategy can take a lot longer than grow and shrink.'
          />
        </EuiText>
      </Fragment>
    )
  }

  if (isGrowAndShrink(strategy)) {
    return (
      <Fragment>
        <FormattedMessage
          id='strategy-explainer-tooltip.grow-and-shrink-strategy-description'
          defaultMessage='Creates nodes with the new configuration, then migrates data from the old nodes.'
        />

        <EuiSpacer size='xs' />

        <FormattedMessage
          id='strategy-explainer-tooltip.rolling-grow-and-shrink-strategy-description-2'
          defaultMessage='Safer than a rolling strategy and ensures single node availability during a configuration change, but can be a lot slower on larger clusters.'
        />

        <EuiSpacer size='xs' />

        <EuiText size='xs'>
          <FormattedMessage
            id='strategy-explainer-tooltip.grow-and-shrink-strategy-required-for-dedicated-masters'
            defaultMessage='This strategy is required when adding or removing dedicated master-eligible nodes.'
          />
        </EuiText>
      </Fragment>
    )
  }

  return null
}

function getRollingStrategyDescription(strategy: Strategy) {
  const rollingStrategyDescription = (
    <FormattedMessage
      id='strategy-explainer-tooltip.rolling-strategy-description'
      defaultMessage='This strategy performs inline, rolling configuration changes that mutate existing containers.'
    />
  )

  const rollingStrategy = allowsInlineResize(strategy) ? (
    <FormattedMessage
      id='strategy-explainer-tooltip.rolling-strategy-with-inline-resize-connector'
      defaultMessage='{rollingStrategyDescription} {withInlineResize}'
      values={{
        rollingStrategyDescription,
        withInlineResize: (
          <FormattedMessage
            id='strategy-explainer-tooltip.rolling-strategy-with-inline-resize-description'
            defaultMessage='Falls back to grow and shrink for nodes that would become too large for their existing allocators.'
          />
        ),
      }}
    />
  ) : (
    rollingStrategyDescription
  )

  if (isRollingByName(strategy)) {
    return (
      <FormattedMessage
        id='strategy-explainer-tooltip.rolling-by-name-strategy-description'
        defaultMessage='One node at a time. {rollingStrategy}'
        values={{ rollingStrategy }}
      />
    )
  }

  if (isRollingByZone(strategy)) {
    return (
      <FormattedMessage
        id='strategy-explainer-tooltip.rolling-by-zone-strategy-description'
        defaultMessage='One zone at a time. {rollingStrategy}'
        values={{ rollingStrategy }}
      />
    )
  }

  if (isRollingAll(strategy)) {
    return (
      <FormattedMessage
        id='strategy-explainer-tooltip.rolling-all-strategy-description'
        defaultMessage='Full deployment restart. {rollingStrategy}'
        values={{ rollingStrategy }}
      />
    )
  }

  return null
}

export default StrategyExplainerTooltip
