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

import { isEmpty } from 'lodash'

import React, { Component, Fragment, ReactNode } from 'react'
import { defineMessages, IntlShape, injectIntl, FormattedMessage } from 'react-intl'

import {
  EuiButton,
  EuiFlexGroup,
  EuiFlexItem,
  EuiLoadingContent,
  EuiStep,
  EuiSteps,
  EuiSpacer,
  EuiText,
  PropsOf,
  EuiSwitch,
} from '@elastic/eui'

import { withErrorBoundary } from '../../../../../cui'

import SelectCloudPlatform from '../../../../../components/StackDeploymentEditor/CreateStackDeploymentEditor/SelectTemplate/SelectCloudPlatform'
import SelectHardwareProfile from '../../../../../components/StackDeploymentEditor/CreateStackDeploymentEditor/SelectTemplate/SelectHardwareProfile'
import SelectRegion from '../../../../../components/StackDeploymentEditor/CreateStackDeploymentEditor/SelectTemplate/SelectRegion'
import PricedArchitectureSummary from '../../Topology/PricedArchitectureSummary'
import PricingRates from '../../StackDeploymentPricing/PricingRates'
import ConfigureDeployment from '../../../../../components/StackDeploymentEditor/CreateStackDeploymentEditor/ConfigureDeployment'
import ExternalLink from '../../../../../components/ExternalLink'

import { contactUs, signUp } from '../../../urls'
import {
  getDeploymentNodeConfigurations,
  getUpsertVersion,
} from '../../../../../lib/stackDeployments'
import { groupByParent } from '../../../../../lib/globalDeploymentTemplates'
import { getPlatform, PlatformId } from '../../../../../lib/platform'
import { getTemplateMetadataItem } from '../../../../../lib/deploymentTemplates/metadata'
import { getNumberOfAvailableZones } from '../../../../../lib/deployments/availabilityZones'
import { getVisibleTemplates } from '../../../../../lib/stackDeployments/selectors'
import { DeepPartial } from '../../../../../lib/ts-essentials'
import {
  DeploymentTemplateInfoV2,
  GlobalDeploymentTemplateInfo,
} from '../../../../../lib/api/v1/types'
import {
  BillingSubscriptionLevel,
  Region,
  RegionId,
  StackDeploymentCreateRequest,
  VersionNumber,
} from '../../../../../types'

import { RegionState } from '../../../../../reducers/providers'

import '../../../../../components/Topology/DeploymentTemplates/DeploymentTemplateWizard/deploymentTemplateWizard.scss'
import '../../../../../components/Topology/DeploymentTemplates/components/ConfigureInstance/configureInstanceTemplate.scss'

const messages = defineMessages({
  selectCloudPlatform: {
    id: `create-deployment-from-template.select-cloud-platform`,
    defaultMessage: `Where do you need it deployed?`,
  },
  selectRegionSoon: {
    id: `create-deployment-from-template.select-region-soon`,
    defaultMessage: `Select a region …`,
  },
  setupDeployment: {
    id: `create-deployment-from-template.setup-deployment`,
    defaultMessage: `Set up your deployment`,
  },
  selectSolution: {
    id: `create-deployment-from-template.select-solution`,
    defaultMessage: `What do you want to do with the Elastic Stack`,
  },
  configureDeploymentSoon: {
    id: `stack-pricing.configure-deployment-soon`,
    defaultMessage: `Size your deployment …`,
  },
  configureDeployment: {
    id: `stack-pricing.configure-deployment`,
    defaultMessage: `Size your deployment`,
  },
  yourQuoteSoon: {
    id: `stack-pricing.your-quote-soon`,
    defaultMessage: `Your quote …`,
  },
  yourQuote: {
    id: `stack-pricing.your-quote`,
    defaultMessage: `Your quote`,
  },
})

type Props = {
  intl: IntlShape
  setDeploymentName: (name: string) => void
  availableVersions: VersionNumber[]
  setVersion: (version: VersionNumber) => void
  showRegion: boolean
  region?: Region
  editorState: StackDeploymentCreateRequest
  fetchBasePrices: ({
    regionId,
    level,
    marketplace,
  }: {
    regionId: string
    level?: BillingSubscriptionLevel
    marketplace?: boolean
  }) => void
  onChange: (
    changes: DeepPartial<StackDeploymentCreateRequest>,
    settings?: { shallow?: boolean },
  ) => void
  setDeploymentTemplate: (template: DeploymentTemplateInfoV2) => void
  setRegion: (args: { regionId: RegionId; stackVersion: VersionNumber }) => void
  restoreFromSnapshot: boolean
  bottomNavigationButtons?: ReactNode
  getRegionsByProvider: (provider: string) => RegionState[] | null
  getRegionIdsByProvider: (provider: PlatformId) => string[]
  getProviderIdByRegion: (regionId: string | null) => PlatformId
  providers: PlatformId[]
  globalDeploymentTemplates?: GlobalDeploymentTemplateInfo[] | null
  setGlobalTemplate: (globalTemplate: GlobalDeploymentTemplateInfo) => void
  selectedSubscription: BillingSubscriptionLevel
  toggleMarketplacePrices: (getMarketplacePrices: boolean) => void
  showMarketplacePrices: boolean
}

// EUI isn't correctly exporting this type. Derive it instead.
// Eventually we'll be able to remove this.
type EuiContainedStepProps = PropsOf<typeof EuiStep>

type State = {
  stackParentSelected: boolean
}

class PricingSteps extends Component<Props, State> {
  state = {
    stackParentSelected: this.getDefaultState(),
  }

  render() {
    return <EuiSteps steps={this.getSteps()} headingElement='h2' />
  }

  renderConfigureDeploymentStep() {
    const { region, editorState, onChange } = this.props

    const deploymentIsLoading = this.isDeploymentLoading()

    if (deploymentIsLoading) {
      return <Fragment /> // EuiStep requires non-null children
    }

    return (
      <ConfigureDeployment
        editorState={editorState}
        onChange={onChange}
        region={region!}
        availableNumberOfZones={getNumberOfAvailableZones(region!)}
        snapshotDetails={null}
        showPrice={false}
        onlyShowPricingFactors={true}
      />
    )
  }

  renderPricingStep() {
    const { editorState, showMarketplacePrices } = this.props

    const { regionId } = editorState

    if (!regionId) {
      return <Fragment /> // EuiStep requires non-null children
    }

    const deploymentIsLoading = this.isDeploymentLoading()

    const baseSummaryProps = this.getPricedSummaryProps()

    const props = {
      ...baseSummaryProps,
      showMarketplacePrices,
      sticky: true,
    }

    const { actionButton } = baseSummaryProps

    return (
      <Fragment>
        {deploymentIsLoading || (
          <Fragment>
            <PricedArchitectureSummary {...props} />

            <EuiSpacer />
          </Fragment>
        )}

        <EuiFlexGroup justifyContent='flexEnd'>
          <EuiFlexItem grow={false}>
            <EuiButton
              rel='noopener'
              href='https://www.elastic.co/cloud/elasticsearch-service'
              data-test-id='pricing-page-learn-more-btn'
            >
              <FormattedMessage id='stack-pricing.learn-more' defaultMessage='Learn more …' />
            </EuiButton>
          </EuiFlexItem>

          <EuiFlexItem grow={false}>{actionButton}</EuiFlexItem>
        </EuiFlexGroup>
      </Fragment>
    )
  }

  renderRegionStep() {
    const {
      editorState,
      getRegionsByProvider,
      providers,
      region,
      restoreFromSnapshot,
      showMarketplacePrices,
      setGlobalTemplate,
      globalDeploymentTemplates,
    } = this.props
    const deploymentIsLoading = this.isDeploymentLoading()

    if (deploymentIsLoading) {
      return <Fragment /> // EuiStep requires non-null children
    }

    const { deploymentTemplate, regionId: userSelectedRegionId } = editorState

    const version = getUpsertVersion(editorState)

    const platform = getPlatform(userSelectedRegionId)
    const availableRegions = getRegionsByProvider(platform)
    const hasRegion = Boolean(region && region.id)
    const sortedByParents = globalDeploymentTemplates
      ? groupByParent({ globalDeploymentTemplates })
      : null

    return (
      <EuiFlexGroup style={{ maxWidth: `680px` }} direction='column' gutterSize='m'>
        <EuiFlexItem>
          <SelectCloudPlatform
            restoreFromSnapshot={restoreFromSnapshot}
            platform={platform}
            availablePlatforms={providers}
            onChange={this.onChangePlatform}
          />
        </EuiFlexItem>
        <EuiFlexItem>
          <SelectRegion
            regionId={userSelectedRegionId!}
            restoreFromSnapshot={restoreFromSnapshot}
            availableRegions={availableRegions}
            onChange={(regionId: string) =>
              this.onChangeRegion({
                regionId,
                stackVersion: version!,
                marketplace: showMarketplacePrices,
              })
            }
            loading={!hasRegion}
          />
        </EuiFlexItem>
        <EuiFlexItem>
          <SelectHardwareProfile
            onChange={setGlobalTemplate}
            version={version!}
            currentTemplate={deploymentTemplate}
            stackTemplates={sortedByParents!.stack}
          />
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiSpacer size='s' />
          <EuiSwitch
            data-test-id='show-marketplace-pricing-toggle'
            label={
              <FormattedMessage
                defaultMessage='Show marketplace pricing'
                id='setup-deployment.platform.choose-cloud.marketplace-switch'
              />
            }
            checked={showMarketplacePrices}
            onChange={() => this.onGetMarketplacePrices(platform)}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
    )
  }

  getSteps() {
    const {
      intl: { formatMessage },
      providers,
      showRegion,
    } = this.props

    const deploymentIsLoading = this.isDeploymentLoading()

    const regionStepView = this.renderRegionStep()
    const configureDeploymentStepView = this.renderConfigureDeploymentStep()
    const pricingStepView = this.renderPricingStep()

    const steps: EuiContainedStepProps[] = []

    // Cloud provider & Region
    if (showRegion) {
      const loadingRegions = isEmpty(providers)

      steps.push(
        deploymentIsLoading
          ? {
              title: formatMessage(messages.selectRegionSoon),
              status: `incomplete`,
              children: regionStepView,
            }
          : {
              title: formatMessage(messages.selectCloudPlatform),
              children: loadingRegions ? <EuiLoadingContent /> : regionStepView,
            },
      )
    }

    // Configure Deployment
    steps.push(
      deploymentIsLoading
        ? {
            title: formatMessage(messages.configureDeploymentSoon),
            status: `incomplete`,
            children: configureDeploymentStepView,
          }
        : {
            title: formatMessage(messages.configureDeployment),
            children: configureDeploymentStepView,
          },
    )

    // Quote
    steps.push(
      deploymentIsLoading
        ? {
            title: formatMessage(messages.yourQuoteSoon),
            status: `incomplete`,
            children: pricingStepView,
          }
        : {
            title: formatMessage(messages.yourQuote),
            children: pricingStepView,
          },
    )

    return steps
  }

  getPricedSummaryProps() {
    const startTrialButton = (
      <EuiFlexGroup className='pricing-summary-trialButtons' justifyContent='spaceBetween'>
        <EuiFlexItem grow={false}>
          <EuiButton rel='noopener' fill={false} href={contactUs}>
            <FormattedMessage id='stack-pricing.contact-sales' defaultMessage='Contact Sales' />
          </EuiButton>
        </EuiFlexItem>

        <EuiFlexItem grow={false}>
          <EuiButton
            rel='noopener'
            fill={true}
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

    const { editorState, selectedSubscription, showMarketplacePrices } = this.props
    const { deployment, deploymentTemplate, regionId } = editorState

    const instanceConfigurations =
      (deploymentTemplate && deploymentTemplate.instance_configurations) || []

    const nodeConfigurations = getDeploymentNodeConfigurations({ deployment })

    return {
      showMarketplacePrices,
      regionId: regionId!,
      selectedSubscription,
      instanceConfigurations,
      nodeConfigurations,
      disclaimer,
      actionButton: startTrialButton,
      emptyDeploymentMessage: <EuiLoadingContent />,
      render: (className: string, content: ReactNode) => (
        <EuiFlexItem grow={false} className={className}>
          {content}
        </EuiFlexItem>
      ),
      renderMap: () => (
        <EuiFlexItem grow={false}>
          <PricingRates
            selectedSubscription={selectedSubscription}
            regionId={regionId!}
            deployment={deployment}
            deploymentTemplate={deploymentTemplate}
          />
        </EuiFlexItem>
      ),
    }
  }

  onChangePlatform = (platform) => {
    const { getRegionIdsByProvider, editorState, toggleMarketplacePrices } = this.props
    const version = getUpsertVersion(editorState)

    const availableRegions = getRegionIdsByProvider(platform)
    const getMarketplacePrices = false

    toggleMarketplacePrices(getMarketplacePrices)

    return this.onChangeRegion({
      regionId: availableRegions[0],
      stackVersion: version!,
      marketplace: getMarketplacePrices,
    })
  }

  onGetMarketplacePrices = (platform) => {
    const { getRegionIdsByProvider, editorState, showMarketplacePrices, toggleMarketplacePrices } =
      this.props
    const version = getUpsertVersion(editorState)

    const availableRegions = getRegionIdsByProvider(platform)
    const getMarketplacePrices = !showMarketplacePrices
    const { regionId } = editorState

    toggleMarketplacePrices(getMarketplacePrices)

    return this.onChangeRegion({
      regionId: regionId || availableRegions[0],
      stackVersion: version!,
      marketplace: getMarketplacePrices,
    })
  }

  onChangeRegion = ({
    regionId,
    stackVersion,
    marketplace,
  }: {
    regionId: string
    stackVersion: string
    marketplace?: boolean
  }) => {
    const { fetchBasePrices, setRegion, selectedSubscription } = this.props

    fetchBasePrices({ regionId, level: selectedSubscription, marketplace })
    setRegion({ regionId, stackVersion })
  }

  onClickStackParent = () => {
    const { setGlobalTemplate, globalDeploymentTemplates } = this.props
    const { stackParentSelected } = this.state
    const visibleTemplates = getVisibleTemplates(globalDeploymentTemplates)
    const groupedByParent = groupByParent({ globalDeploymentTemplates: visibleTemplates })

    // Select the first child template only if the Stack tile is not currently selected
    if (!stackParentSelected) {
      setGlobalTemplate(groupedByParent.stack[0])
    }

    this.setState({ stackParentSelected: true })
  }

  onClickTemplate() {
    this.setState({ stackParentSelected: false })
  }

  isDeploymentLoading(): boolean {
    const { region, editorState, globalDeploymentTemplates } = this.props
    const { deploymentTemplate } = editorState

    const deploymentIsLoading =
      region == null || deploymentTemplate === undefined || globalDeploymentTemplates == null

    return deploymentIsLoading
  }

  getDefaultState() {
    const { editorState } = this.props
    const { deploymentTemplate } = editorState

    if (!deploymentTemplate) {
      return false
    }

    const parent = getTemplateMetadataItem(deploymentTemplate, 'parent_solution')

    if (parent === 'stack') {
      return true
    }

    return false
  }
}

export default injectIntl(withErrorBoundary(PricingSteps))
