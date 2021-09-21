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

import React, { PureComponent, ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'
import { EuiFlexGroup, EuiFlexItem, EuiPanel, EuiSpacer, EuiText, EuiTitle } from '@elastic/eui'

import { CuiThemedIcon, CuiRouterLinkButton } from '../../../../cui'
import DeploymentFeaturesHeader from './DeploymentFeaturesHeader'
import DeploymentFeatureItem from './DeploymentFeatureItem'
import DocLink from '../../../../components/DocLink'

import { isFeatureActivated } from '../../../../store'
import Feature from '../../../../lib/feature'

import { trafficFiltersUrl, trustManagementUrl, apiKeysUrl } from '../../urls'
import { deploymentExtensionsUrl } from '../../../../lib/urlBuilder'

import lock from '../../../../files/cloud-lock-white.svg'
import lockDark from '../../../../files/cloud-lock-dark.svg'

import './deploymentFeatures.scss'

class DeploymentFeatures extends PureComponent {
  render(): ReactElement {
    return (
      <div className='deployment-features'>
        <DeploymentFeaturesHeader />

        <EuiSpacer size='m' />

        <EuiPanel color='subdued' paddingSize='l' className='panel-with-border'>
          <EuiFlexGroup alignItems='center' gutterSize='none'>
            <EuiFlexItem>
              <EuiTitle>
                <h2>
                  <FormattedMessage
                    id='deployment-features.traffic-filtering.title'
                    defaultMessage='Traffic filters'
                  />
                </h2>
              </EuiTitle>

              <EuiSpacer size='m' />

              <EuiText color='subdued'>
                <FormattedMessage
                  id='deployment-features.traffic-filtering.intro'
                  defaultMessage='Control access to your deployments.'
                />

                <EuiSpacer size='m' />

                <FormattedMessage
                  id='deployment-features.traffic-filtering-p1'
                  defaultMessage='You can protect deployments from unwanted traffic by only allowing connections from specific IP addresses, IP ranges, or by setting up a VPC.'
                />
              </EuiText>

              <EuiSpacer size='l' />

              <EuiFlexGroup alignItems='center'>
                <EuiFlexItem grow={false}>
                  <CuiRouterLinkButton to={trafficFiltersUrl()} fill={true}>
                    <FormattedMessage
                      id='traffic-filtering.link'
                      defaultMessage='Add traffic filters'
                    />
                  </CuiRouterLinkButton>
                </EuiFlexItem>

                <EuiFlexItem grow={false}>
                  {this.renderLearnMoreLink({ href: 'configureDeploymenTrafficFilters' })}
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlexItem>

            <EuiFlexItem>
              <CuiThemedIcon
                size='original'
                lightType={lock}
                darkType={lockDark}
                className='deployment-features-icon'
              />
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiPanel>

        <EuiSpacer size='xl' />

        <EuiFlexGroup>
          <EuiFlexItem>
            <DeploymentFeatureItem
              title={
                <FormattedMessage
                  id='deployment-features.api-keys.title'
                  defaultMessage='API Keys'
                />
              }
              description={
                <FormattedMessage
                  id='deployment-features.api-keys.description'
                  defaultMessage='Create keys for the RESTful API to provide access to deployment CRUD actions. {learnMore}'
                  values={{
                    learnMore: this.renderLearnMoreLink({ href: 'apiKeysDocLink' }),
                  }}
                />
              }
              linkButton={{
                href: apiKeysUrl(),
                text: (
                  <FormattedMessage
                    id='deployment-features.api-keys.add-keys-btn'
                    defaultMessage='Add API Keys'
                  />
                ),
              }}
            />
          </EuiFlexItem>

          <EuiFlexItem>
            <DeploymentFeatureItem
              title={
                <FormattedMessage
                  id='deployment-features.extensions.title'
                  defaultMessage='Extensions'
                />
              }
              description={
                <FormattedMessage
                  id='deployment-features.extensions.description'
                  defaultMessage='Upload a custom bundle or script to extend the functionality of the deployment. {learnMore}'
                  values={{
                    learnMore: this.renderLearnMoreLink({ href: 'officialPluginsDocLink' }),
                  }}
                />
              }
              linkButton={{
                href: deploymentExtensionsUrl(),
                text: (
                  <FormattedMessage
                    id='deployment-features.api-keys.add-extensions-btn'
                    defaultMessage='Add extensions'
                  />
                ),
              }}
            />
          </EuiFlexItem>

          {isFeatureActivated(Feature.crossEnvCCSCCR) && (
            <EuiFlexItem>
              <DeploymentFeatureItem
                title={
                  <FormattedMessage id='deployment-features.trust.title' defaultMessage='Trust' />
                }
                description={
                  <FormattedMessage
                    id='deployment-features.trust.description'
                    defaultMessage='Set up trust relationships between deployments and environments for cross-cluster search and replication.'
                  />
                }
                linkButton={{
                  href: trustManagementUrl(),
                  text: (
                    <FormattedMessage
                      id='deployment-features.api-keys.setup-trust-btn'
                      defaultMessage='Set up trust'
                    />
                  ),
                }}
                isNew={true}
              />
            </EuiFlexItem>
          )}
        </EuiFlexGroup>
      </div>
    )
  }

  renderLearnMoreLink({ href }: { href: string }): ReactElement {
    return (
      <span style={{ textAlign: 'center' }}>
        <DocLink link={href}>
          <FormattedMessage id='deployment-features.learn-more.link' defaultMessage='Learn more' />
        </DocLink>
      </span>
    )
  }
}

export default DeploymentFeatures
