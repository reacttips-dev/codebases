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

import React, { Component, Fragment, ReactNode } from 'react'
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl'
import { RouteComponentProps } from 'react-router'
import { parse } from 'query-string'

import {
  EuiButton,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiSpacer,
  EuiText,
} from '@elastic/eui'

import PricingSteps from '../PricingSteps'

import PricedArchitectureSummary from '../../Topology/PricedArchitectureSummary'

import Header from '../../../../../components/Header'
import ExternalLink from '../../../../../components/ExternalLink'

import {
  getDeploymentNameSetter,
  getDeploymentNodeConfigurations,
  getDeploymentVersionSetter,
} from '../../../../../lib/stackDeployments'

import { getSubscriptionQuery } from '../../../../../lib/billing'

import { contactUs, signUp } from '../../../urls'

import { CreateEditorComponentConsumerProps as ConsumerProps } from '../../../../../components/StackDeploymentEditor/types'

import { BillingSubscriptionLevel } from '../../../../../types'

import { StackVersionConfig } from '../../../../../lib/api/v1/types'

type FetchBasePricesSettings = {
  regionId: string
  level?: BillingSubscriptionLevel
  marketplace?: boolean
}

type StateProps = {
  stackVersions: StackVersionConfig[] | null
}

type DispatchProps = {
  fetchBasePrices: ({ regionId, level, marketplace }: FetchBasePricesSettings) => void
}

export type Props = StateProps &
  DispatchProps &
  ConsumerProps &
  WrappedComponentProps &
  RouteComponentProps

const pricingAnnouncementHref = `https://www.elastic.co/blog/elasticsearch-service-on-elastic-cloud-introduces-new-pricing-with-reduced-costs`

type State = {
  selectedSubscription: BillingSubscriptionLevel
  showMarketplacePrices: boolean
  getMarketplacePrices: boolean
}

class StackDeploymentPricingEditor extends Component<Props, State> {
  state: State = {
    selectedSubscription: this.getDefaultSubscription(),
    showMarketplacePrices: false,
    getMarketplacePrices: false,
  }

  render() {
    return (
      <EuiPage>
        <EuiPageBody>
          <EuiPageContent paddingSize='m'>
            <EuiPageContentBody className='pricingPage' data-app='appContentBody'>
              <Header
                name={
                  <FormattedMessage
                    id='pricing-calculator-page.title'
                    defaultMessage='Elasticsearch Service pricing calculator'
                  />
                }
              />
              <EuiText>
                <FormattedMessage
                  id='stack-pricing.lead-in-text'
                  defaultMessage='Estimate the cost of your deployment configuration before you start your free trial. {learnMore}'
                  values={{
                    learnMore: (
                      <ExternalLink href={pricingAnnouncementHref}>
                        <FormattedMessage
                          id='stack-pricing.lead-in-learn-more'
                          defaultMessage='Learn more …'
                        />
                      </ExternalLink>
                    ),
                  }}
                />
              </EuiText>

              <EuiSpacer />

              <EuiFlexGroup>
                <EuiFlexItem>{this.renderSteps()}</EuiFlexItem>
                <EuiFlexItem grow={false}>{this.renderPricedArchitectureSidebar()}</EuiFlexItem>
              </EuiFlexGroup>
            </EuiPageContentBody>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    )
  }

  renderSteps() {
    const {
      showRegion,
      availableVersions,
      region,
      setRegion,
      editorState,
      onChange,
      setDeploymentTemplate,
      globalDeploymentTemplates,
      setGlobalTemplate,
    } = this.props
    const { selectedSubscription, showMarketplacePrices } = this.state

    return (
      <PricingSteps
        showMarketplacePrices={showMarketplacePrices}
        toggleMarketplacePrices={(showMarketplacePrices) =>
          this.toggleMarketplacePrices(showMarketplacePrices)
        }
        editorState={editorState}
        setDeploymentName={getDeploymentNameSetter({ onChange })}
        setDeploymentTemplate={setDeploymentTemplate}
        globalDeploymentTemplates={globalDeploymentTemplates}
        setGlobalTemplate={setGlobalTemplate}
        availableVersions={availableVersions}
        setVersion={getDeploymentVersionSetter({ editorState, onChange })}
        showRegion={showRegion!}
        region={region}
        onChange={onChange}
        setRegion={setRegion}
        restoreFromSnapshot={false}
        selectedSubscription={selectedSubscription}
      />
    )
  }

  renderPricedArchitectureSidebar() {
    const { editorState } = this.props
    const { regionId } = editorState

    if (!regionId) {
      return null
    }

    const baseSummaryProps = this.getPricedSummaryProps()

    const props = {
      ...baseSummaryProps,
      sticky: true,
      showSubscriptionOptions: true,
      showMarketplacePricesToggle: this.state.showMarketplacePrices,
      onChangeSubscription: ({
        subscription,
        getMarketplacePrices,
      }: {
        subscription: BillingSubscriptionLevel
        getMarketplacePrices?: boolean
      }) => this.onChangeSubscription({ subscription, getMarketplacePrices }),
    }

    return <PricedArchitectureSummary {...props} />
  }

  getPricedSummaryProps() {
    const startTrialButton = (
      <EuiFlexGroup className='pricing-summary-trialButtons' justifyContent='spaceBetween'>
        <EuiFlexItem grow={false}>
          <EuiButton
            rel='noopener'
            fill={false}
            href={contactUs}
            data-test-id='pricing-page-contact-sales-btn'
          >
            <FormattedMessage id='stack-pricing.contact-sales' defaultMessage='Contact Sales' />
          </EuiButton>
        </EuiFlexItem>

        <EuiFlexItem grow={false}>
          <EuiButton
            rel='noopener'
            fill={true}
            data-test-id='pricing-page-start-trial-btn'
            href={signUp({ baymax: `cloud`, storm: `cta1`, elektra: `pricing-page` })}
          >
            <FormattedMessage id='stack-pricing.start-trial' defaultMessage='Start trial' />
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
    )

    const disclaimer = (
      <div className='pricing-disclaimer'>
        <EuiSpacer size='s' />

        <EuiText size='xs'>
          <FormattedMessage
            id='create-deployment-configure.small-price-disclaimer'
            defaultMessage='* {dataTransfer} fees may apply.'
            values={{
              dataTransfer: (
                <ExternalLink href='https://www.elastic.co/blog/elasticsearch-service-data-transfer-and-snapshot-storage-pricing'>
                  <FormattedMessage
                    id='stack-pricing.data-transfer'
                    defaultMessage='Data transfer and snapshot storage'
                  />
                </ExternalLink>
              ),
            }}
          />
        </EuiText>
      </div>
    )

    const { editorState } = this.props
    const { selectedSubscription } = this.state
    const { deployment, deploymentTemplate, regionId } = editorState

    const instanceConfigurations =
      (deploymentTemplate && deploymentTemplate.instance_configurations) || []

    const nodeConfigurations = getDeploymentNodeConfigurations({ deployment })

    return {
      regionId: regionId!,
      selectedSubscription,
      instanceConfigurations,
      nodeConfigurations,
      disclaimer,
      actionButton: startTrialButton,
      emptyDeploymentMessage: (
        <Fragment>
          <EuiSpacer />
          <EuiText>
            <FormattedMessage
              id='stack-deployment-pricing-editor.empty-deployment'
              defaultMessage='Please select a solution to see pricing.'
            />
          </EuiText>
        </Fragment>
      ),
      render: (className: string, content: ReactNode) => (
        <EuiFlexItem grow={false} className={className}>
          {content}
        </EuiFlexItem>
      ),
    }
  }

  onChangeSubscription({
    subscription,
    getMarketplacePrices,
  }: {
    subscription: BillingSubscriptionLevel
    getMarketplacePrices?: boolean
  }) {
    const { fetchBasePrices, editorState } = this.props
    const { regionId } = editorState

    if (regionId) {
      this.setState({ selectedSubscription: subscription })
      fetchBasePrices({ regionId, level: subscription, marketplace: getMarketplacePrices })
    }
  }

  getDefaultSubscription() {
    const {
      location: { search },
    } = this.props
    const subscriptionQuery = parse(search.slice(1))
    return subscriptionQuery.level ? getSubscriptionQuery(subscriptionQuery.level) : `standard`
  }

  toggleMarketplacePrices(showMarketplacePrices) {
    this.setState({
      showMarketplacePrices,
      getMarketplacePrices: showMarketplacePrices,
    })
  }
}

export default injectIntl(StackDeploymentPricingEditor)
