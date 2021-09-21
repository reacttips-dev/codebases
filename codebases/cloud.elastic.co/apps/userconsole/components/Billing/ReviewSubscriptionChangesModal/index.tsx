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

import React, { Component, Fragment, ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'

import { capitalize } from 'lodash'

import {
  EuiOverlayMask,
  EuiModal,
  EuiModalHeader,
  EuiFlexItem,
  EuiFlexGroup,
  EuiText,
  EuiModalBody,
  EuiSpacer,
  EuiModalFooter,
  EuiLink,
  EuiAccordion,
} from '@elastic/eui'

import DeploymentFeaturesAboveSubscriptionLevel from './DeploymentFeaturesAboveSubscriptionLevel'
import DeploymentUsage from './DeploymentUsage'

import DocLink from '../../../../../components/DocLink'

import { getOutOfComplianceDeployments } from '../../../../../lib/usage'

import lightTheme from '../../../../../lib/theme/light'

import { FeaturesUsage } from '../../../../../lib/api/v1/types'

import messages from './messages'

export type Props = {
  closeModal: () => void
  usageDetails: FeaturesUsage
  onUpgrade: (upgradeLevel?: string) => void
}

const { euiBreakpoints } = lightTheme

class ReviewSubscriptionChangesModal extends Component<Props> {
  render(): ReactElement {
    const { closeModal, usageDetails, onUpgrade } = this.props
    const { subscription_level: subscriptionLevel, usage_level: usageLevel } = usageDetails

    return (
      <EuiOverlayMask>
        <EuiModal maxWidth={euiBreakpoints.s} onClose={closeModal}>
          <EuiModalHeader>
            <EuiFlexGroup gutterSize='s' direction='column'>
              <EuiFlexItem>
                <EuiText>
                  <h3>
                    <FormattedMessage {...messages.modalTitle} />
                  </h3>
                </EuiText>
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiText color='subdued'>
                  <p>
                    <FormattedMessage
                      {...messages.modalDescription}
                      values={{
                        subscription: capitalize(subscriptionLevel),
                        upgradeToLevel: (
                          <EuiLink onClick={() => onUpgrade(usageLevel)}>
                            <FormattedMessage
                              {...messages.upgrade}
                              values={{
                                upgradeLevel: capitalize(usageLevel),
                              }}
                            />
                          </EuiLink>
                        ),
                      }}
                    />
                  </p>
                </EuiText>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiModalHeader>
          <EuiModalBody>{this.renderDeploymentUsage()}</EuiModalBody>
          <EuiModalFooter style={{ justifyContent: 'flex-start' }}>
            <EuiText>
              <FormattedMessage
                {...messages.modalFooter}
                values={{
                  readTheDocs: (
                    <DocLink link='subscriptionLevels'>
                      <FormattedMessage {...messages.readTheDocs} />
                    </DocLink>
                  ),
                  askForHelp: (
                    <EuiLink href='/support' target='_blank'>
                      <FormattedMessage {...messages.askForHelp} />
                    </EuiLink>
                  ),
                }}
              />
            </EuiText>
          </EuiModalFooter>
        </EuiModal>
      </EuiOverlayMask>
    )
  }

  renderDeploymentUsage(): ReactElement | null {
    const { usageDetails } = this.props
    const { deployments, subscription_level: subscriptionLevel } = usageDetails
    const outOfComplianceDeployments = getOutOfComplianceDeployments({
      deployments,
      subscriptionLevel,
    })

    if (outOfComplianceDeployments.length < 1) {
      return null
    }

    return outOfComplianceDeployments.map((deployment, i) => (
      <Fragment key={i}>
        {outOfComplianceDeployments.length === 1
          ? this.renderSingleDeployment({ deployment })
          : this.renderCollapsedDeployment({ deployment })}

        <EuiSpacer size='m' />
      </Fragment>
    ))
  }

  renderSingleDeployment({ deployment }): ReactElement {
    const { outOfComplianceFeatures } = deployment
    return (
      <Fragment>
        <DeploymentUsage
          outOfComplianceFeatures={outOfComplianceFeatures}
          deployment={deployment}
        />
        <DeploymentFeaturesAboveSubscriptionLevel
          outOfComplianceFeatures={outOfComplianceFeatures}
        />
      </Fragment>
    )
  }

  renderCollapsedDeployment({ deployment }): ReactElement {
    const { outOfComplianceFeatures } = deployment
    return (
      <EuiAccordion
        id='features-by-deployment'
        buttonContent={
          <DeploymentUsage
            outOfComplianceFeatures={outOfComplianceFeatures}
            deployment={deployment}
          />
        }
      >
        <DeploymentFeaturesAboveSubscriptionLevel
          outOfComplianceFeatures={outOfComplianceFeatures}
        />
      </EuiAccordion>
    )
  }
}

export default ReviewSubscriptionChangesModal
