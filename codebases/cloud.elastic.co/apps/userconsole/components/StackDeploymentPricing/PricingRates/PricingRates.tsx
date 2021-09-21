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

import React, { Fragment, Component } from 'react'
import { WrappedComponentProps, injectIntl, FormattedMessage, defineMessages } from 'react-intl'

import { filter, isEmpty } from 'lodash'

import {
  EuiCallOut,
  EuiDescriptionList,
  EuiDescriptionListDescription,
  EuiDescriptionListTitle,
  EuiLoadingContent,
  EuiText,
  EuiIconTip,
  EuiFlexGroup,
  EuiFlexItem,
} from '@elastic/eui'

import { CuiLink } from '../../../../../cui'

import { supportUrl } from '../../../../../lib/urlBuilder'
import { getArchitecturePricingItems } from '../../../../../lib/deployments/architecture'
import { getDeploymentNodeConfigurations } from '../../../../../lib/stackDeployments'
import {
  AsyncRequestState,
  BillingSubscriptionLevel,
  RegionId,
  ProfileState,
  BasePrice,
  AnyTopologyElement,
} from '../../../../../types'
import { DeploymentTemplateInfoV2, DeploymentCreateRequest } from '../../../../../lib/api/v1/types'

type Props = WrappedComponentProps & {
  showPrice: boolean
  regionId: RegionId
  profile: ProfileState
  fetchBasePricesRequest: AsyncRequestState
  fetchBasePrices: ({ regionId }) => Promise<any>
  basePrices?: BasePrice[]
  deployment: DeploymentCreateRequest
  deploymentTemplate?: DeploymentTemplateInfoV2
  selectedSubscription?: BillingSubscriptionLevel
  isAutoscalingEnabled?: boolean
}

const messages = defineMessages({
  autoscalingPriceInfo: {
    id: 'pricing-rates.autoscaling-popover',
    defaultMessage: 'Autoscaling can change size and price.',
  },
})

class PricingRates extends Component<Props> {
  componentDidMount() {
    const { regionId, fetchBasePrices } = this.props

    if (this.shouldRenderPricing()) {
      fetchBasePrices({
        regionId,
      })
    }
  }

  render() {
    const { profile, fetchBasePricesRequest, basePrices, isAutoscalingEnabled, intl } = this.props
    const { inProgress, error } = fetchBasePricesRequest
    const inTrial = profile && profile.inTrial
    const prices = this.getPrices()
    const totalPrices = filter(prices, { id: `total` })

    if (inTrial) {
      return null
    }

    if (isEmpty(basePrices) && inProgress && !error) {
      return <EuiLoadingContent lines={1} />
    }

    if (!isEmpty(basePrices) && isEmpty(totalPrices)) {
      return <EuiLoadingContent lines={1} />
    }

    if (isEmpty(totalPrices)) {
      return (
        <EuiCallOut
          color='warning'
          title={
            <FormattedMessage
              id='pricing.no-pricing'
              defaultMessage="Pricing for this combination isn't available right now. Please {contactSupport} and let us know."
              values={{
                contactSupport: (
                  <CuiLink to={supportUrl()}>
                    <FormattedMessage
                      id='pricing.no-pricing.contact-support'
                      defaultMessage='contact support'
                    />
                  </CuiLink>
                ),
              }}
            />
          }
        />
      )
    }

    const autoscalingPriceInfoTxt = intl.formatMessage(messages.autoscalingPriceInfo)

    return (
      <EuiDescriptionList
        data-test-id='userconsole-pricing-rates'
        type='column'
        compressed={true}
        className='userconsole-pricing-rates'
      >
        {totalPrices.map(({ title, description }, index) => (
          <Fragment key={index}>
            <EuiDescriptionListTitle style={{ width: 'auto' }}>
              <EuiText data-test-id='total-price' size='s'>
                <h4>{title}:</h4>
              </EuiText>
            </EuiDescriptionListTitle>
            <EuiDescriptionListDescription style={{ width: 'auto', paddingLeft: 0 }}>
              <EuiFlexGroup alignItems='flexEnd' gutterSize='xs'>
                <EuiFlexItem>
                  <EuiText data-test-id='total-price' size='s'>
                    <h4>{description}</h4>
                  </EuiText>
                </EuiFlexItem>
                {isAutoscalingEnabled && (
                  <EuiFlexItem>
                    <EuiIconTip
                      type='iInCircle'
                      position='top'
                      content={autoscalingPriceInfoTxt}
                      color='primary'
                    />
                  </EuiFlexItem>
                )}
              </EuiFlexGroup>
            </EuiDescriptionListDescription>
          </Fragment>
        ))}
      </EuiDescriptionList>
    )
  }

  getPrices() {
    const {
      deploymentTemplate,
      regionId,
      intl,
      basePrices,
      profile,
      selectedSubscription,
      isAutoscalingEnabled,
    } = this.props
    const instanceConfigurations =
      (deploymentTemplate && deploymentTemplate.instance_configurations) || []

    if (!profile || !this.shouldRenderPricing()) {
      return []
    }

    return getArchitecturePricingItems({
      intl,
      regionId,
      instanceConfigurations,
      nodeConfigurations: this.getNodeConfigurations(),
      basePrices,
      level: selectedSubscription || profile.level,
      isAutoscalingEnabled,
    })
  }

  shouldRenderPricing() {
    const { showPrice, profile } = this.props

    if (!showPrice) {
      return false
    }

    return profile && !profile.inTrial
  }

  getNodeConfigurations(): AnyTopologyElement[] {
    const { deployment } = this.props

    if (deployment == null) {
      return []
    }

    return getDeploymentNodeConfigurations({ deployment })
  }
}

export default injectIntl(PricingRates)
