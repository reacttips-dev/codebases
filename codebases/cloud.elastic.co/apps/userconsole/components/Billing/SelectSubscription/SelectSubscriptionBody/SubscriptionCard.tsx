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
import { injectIntl, IntlShape, WrappedComponentProps, FormattedMessage } from 'react-intl'

import {
  EuiCard,
  EuiText,
  EuiHorizontalRule,
  EuiStat,
  EuiFlexItem,
  EuiFlexGroup,
  EuiSpacer,
} from '@elastic/eui'

import SeePricingPage from './SeePricingPage'

import messages from '../messages'

import Price from '../../../formatters/Price'

import { Subscription } from '../../types'

export type Props = WrappedComponentProps & {
  hasActivePrepaidBalanceLineItems: boolean
  intl: IntlShape
  subscription: Subscription
  selected: boolean
  onClick: (Subscription) => void
}

const SubscriptionCard: FunctionComponent<Props> = ({
  hasActivePrepaidBalanceLineItems,
  subscription,
  onClick,
  selected,
  intl,
}) => {
  const { formatMessage } = intl
  const { value, prettyName, features, recommended, hourlyRate } = subscription
  const showPrice = hourlyRate && hourlyRate > 0
  const isDisabled = hasActivePrepaidBalanceLineItems ? value === 'standard' : false

  return (
    <EuiCard
      data-test-id={`subscription-card-${subscription.value}`}
      title={prettyName}
      description={false}
      selectable={{
        onClick: () => onClick(value),
        isSelected: selected,
      }}
      betaBadgeLabel={!isDisabled && recommended ? formatMessage(messages.recommended) : undefined}
      isDisabled={isDisabled}
    >
      <div className='cardHeader'>
        {showPrice ? (
          <EuiStat
            title={<Price value={hourlyRate} dp={4} />}
            titleSize='s'
            textAlign='center'
            titleColor='secondary'
            description={formatMessage(messages.perHour)}
            reverse={true}
          />
        ) : (
          <SeePricingPage level={subscription.value} />
        )}
      </div>
      <EuiHorizontalRule className='subscriptionCardRule' margin='xs' />
      <EuiFlexGroup className='subscriptionFeatures' direction='column'>
        <EuiFlexItem>
          {features.map((feature, i) => (
            <EuiFlexItem key={i}>
              <EuiFlexGroup gutterSize='xs'>
                <EuiFlexItem className='featureBullet' grow={false}>
                  <EuiText color='subdued' textAlign='left' size='s'>
                    &mdash;
                  </EuiText>
                </EuiFlexItem>
                <EuiFlexItem className='featureText'>
                  <EuiText color='subdued' textAlign='left' size='s'>
                    <FormattedMessage {...feature.text} />
                  </EuiText>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlexItem>
          ))}
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiSpacer size='xl' />
    </EuiCard>
  )
}

export default injectIntl(SubscriptionCard)
