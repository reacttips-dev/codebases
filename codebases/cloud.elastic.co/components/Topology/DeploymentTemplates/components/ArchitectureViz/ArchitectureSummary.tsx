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

import React, { Fragment, ReactNode, ReactElement, FunctionComponent } from 'react'
import { FormattedDate, FormattedMessage, injectIntl, IntlShape } from 'react-intl'
import MediaQuery from 'react-responsive'
import Sticky from 'react-sticky-el'

import cx from 'classnames'
import { findIndex } from 'lodash'

import {
  EuiDescriptionList,
  EuiDescriptionListDescription,
  EuiDescriptionListTitle,
  EuiPanel,
  EuiSpacer,
  EuiTitle,
  EuiButtonGroup,
  EuiFormHelpText,
} from '@elastic/eui'

import ArchitectureVizFromTopology from './ArchitectureVizFromTopology'
import ConvertingTrialMessage from './ConvertingTrialMessage'
import PrivacySensitiveContainer from '../../../../PrivacySensitiveContainer'

import ExternalLink from '../../../../ExternalLink'

import { externalPricing } from '../../../../../apps/userconsole/urls'

import TiebreakerPopover from '../../../../../lib/deployments/TiebreakerPopover'
import {
  getArchitectureSummaryItems,
  SummaryItems,
} from '../../../../../lib/deployments/architecture'

import { isEnabledConfiguration } from '../../../../../lib/deployments/conversion'

import { getPlatform } from '../../../../../lib/platform'

import { SnapshotDetails, AnyTopologyElement, BillingSubscriptionLevel } from '../../../../../types'
import { InstanceConfiguration } from '../../../../../lib/api/v1/types'

import { messages } from './messages'

import './ArchitectureSummary.scss'

const classPrefix = `create-deployment-from-template--summary`

type Props = {
  emptyDeploymentMessage?: ReactNode
  actionButton?: ReactNode
  appendSummaryItems?: SummaryItems
  deploymentName?: string
  deploymentVersion?: string
  hideArchitectureViz?: boolean
  instanceConfigurations: InstanceConfiguration[]
  intl: IntlShape
  nodeConfigurations: AnyTopologyElement[]
  regionId: string
  render: (id: string, reactNode) => ReactElement
  snapshotDetails?: SnapshotDetails
  disclaimer?: ReactNode
  showSubscriptionOptions?: boolean
  onChangeSubscription?: ({
    subscription,
    getMarketplacePrices,
  }: {
    subscription: BillingSubscriptionLevel
    getMarketplacePrices?: boolean
  }) => void
  selectedSubscription?: BillingSubscriptionLevel
  isTrialConverting?: boolean
  exceededTrialInstances?: any
  resetNodeToTrial?: ({ nodeConfiguration, topologyElementProp }) => void
  showMarketplacePricesToggle?: boolean
  sticky?: boolean
}

const ArchitectureSummary: FunctionComponent<Props> = ({
  actionButton,
  appendSummaryItems,
  deploymentName,
  deploymentVersion,
  disclaimer,
  emptyDeploymentMessage,
  hideArchitectureViz,
  instanceConfigurations,
  intl,
  nodeConfigurations,
  render,
  snapshotDetails,
  showSubscriptionOptions,
  onChangeSubscription,
  selectedSubscription,
  exceededTrialInstances,
  isTrialConverting,
  resetNodeToTrial,
  showMarketplacePricesToggle,
  sticky,
}) => {
  const summary = getArchitectureSummaryItems({
    intl,
    instanceConfigurations,
    nodeConfigurations,
    deploymentName,
    deploymentVersion,
  })

  if (!render) {
    return <Fragment />
  }

  if (Array.isArray(appendSummaryItems) && appendSummaryItems.length > 0) {
    for (const item of summary) {
      if (item.summaryItems) {
        const relatedItems = appendSummaryItems.filter(
          ({ id }) => id === item.type || (item.type === `elasticsearch` && id?.startsWith(`data`)),
        )
        item.summaryItems.push(...relatedItems)
      }
    }
  }

  const emptyDeployment = !nodeConfigurations.some(isEnabledConfiguration)
  const snapshotSummary = getSnapshotSummary(snapshotDetails)
  const { formatMessage } = intl
  const subscriptionOptions = [
    {
      id: `standard`,
      label: formatMessage(messages.standard),
      'data-test-id': `subscription-button-standard`,
    },
    {
      id: `gold`,
      label: formatMessage(messages.gold),
      'data-test-id': `subscription-button-gold`,
    },
    {
      id: `platinum`,
      label: formatMessage(messages.platinum),
      'data-test-id': `subscription-button-platinum`,
    },
    {
      id: `enterprise`,
      label: formatMessage(messages.enterprise),
      'data-test-id': `subscription-button-enterprise`,
    },
  ]

  const content = (
    <EuiPanel>
      <div className={classPrefix}>
        {isTrialConverting && resetNodeToTrial && (
          <ConvertingTrialMessage
            exceededTrialNodes={exceededTrialInstances}
            resetNodeToTrial={resetNodeToTrial}
          />
        )}
        <EuiTitle size='s'>
          <h4>
            <FormattedMessage
              id='create-deployment-configure.instance-summary'
              defaultMessage='Summary'
            />
          </h4>
        </EuiTitle>

        <EuiSpacer size='s' />

        {showSubscriptionOptions && onChangeSubscription && (
          <Fragment>
            <EuiButtonGroup
              data-test-id='change-subscription-buttons'
              buttonSize='s'
              type='single'
              legend='Subscription options'
              options={subscriptionOptions}
              idSelected={selectedSubscription!}
              onChange={(subscription: BillingSubscriptionLevel) =>
                onChangeSubscription({
                  subscription,
                  getMarketplacePrices: showMarketplacePricesToggle,
                })
              }
            />

            <EuiFormHelpText>
              <ExternalLink href={externalPricing}>
                <FormattedMessage
                  id='subscription-learn-more.link'
                  defaultMessage='Compare subscriptions'
                />
              </ExternalLink>
            </EuiFormHelpText>
          </Fragment>
        )}

        <EuiSpacer size='s' />

        {emptyDeployment && emptyDeploymentMessage ? (
          emptyDeploymentMessage
        ) : (
          <Fragment>
            <PrivacySensitiveContainer
              id='deployment-summary-items'
              data-test-id='deployment-summary-items'
            >
              {getSummaryContent(summary, isTrialConverting)}
            </PrivacySensitiveContainer>

            {snapshotSummary && (
              <Fragment>
                <EuiSpacer size='m' />
                <EuiTitle size='s'>
                  <h4>
                    <FormattedMessage
                      id='create-deployment-configure.snapshot-summary'
                      defaultMessage='Snapshot'
                    />
                  </h4>
                </EuiTitle>

                <EuiSpacer size='m' />
                <EuiDescriptionList type='column' textStyle='reverse' compressed={true}>
                  {getListContent({ items: snapshotSummary })}
                </EuiDescriptionList>
              </Fragment>
            )}

            {disclaimer && (
              <Fragment>
                <EuiSpacer size='s' />
                {disclaimer}
              </Fragment>
            )}

            {hideArchitectureViz || (
              <Fragment>
                <EuiSpacer />

                <EuiTitle size='s'>
                  <h5>
                    <FormattedMessage
                      id='create-deployment-configure.architecture-viz-title'
                      defaultMessage='Architecture'
                    />
                  </h5>
                </EuiTitle>

                <ArchitectureVizFromTopology
                  instanceConfigurations={instanceConfigurations}
                  nodeConfigurations={nodeConfigurations}
                  version={deploymentVersion}
                />
              </Fragment>
            )}
          </Fragment>
        )}

        {actionButton && (
          <Fragment>
            <EuiSpacer />
            {actionButton}
          </Fragment>
        )}
      </div>
    </EuiPanel>
  )

  const body = (
    <MediaQuery minDeviceWidth={768}>
      {(matches) =>
        sticky ? (
          <Sticky
            stickyStyle={{ marginTop: `20px` }}
            disabled={!matches}
            boundaryElement='[data-app="appContentBody"]'
            hideOnBoundaryHit={false}
          >
            {content}
          </Sticky>
        ) : (
          content
        )
      }
    </MediaQuery>
  )
  const className = sticky ? `architectureViz stickyViz` : `architectureViz`

  return render(className, body)
}

function getSnapshotSummary(snapshotDetails) {
  if (snapshotDetails == null || snapshotDetails.deploymentId == null) {
    return null
  }

  const summary: ListItem[] = [
    {
      title: (
        <FormattedMessage
          id='create-deployment-configure.snapshot-summary.deployment'
          defaultMessage='Deployment'
        />
      ),
      description: snapshotDetails.deploymentName,
      descriptionClass: `${classPrefix}--snapshots-deployment`,
    },
    {
      title: (
        <FormattedMessage
          id='create-deployment-configure.snapshot-summary.snapshot-date'
          defaultMessage='Latest snapshot'
        />
      ),
      description: (
        <FormattedDate
          value={snapshotDetails.snapshotDate}
          year='numeric'
          month='short'
          day='numeric'
          hour='2-digit'
          minute='2-digit'
        />
      ),
    },
  ]

  if (snapshotDetails.regionId != null) {
    summary.push(
      {
        title: (
          <FormattedMessage
            id='create-deployment-configure.snapshot-summary.platform'
            defaultMessage='Provider'
          />
        ),
        description: getPlatform(snapshotDetails.regionId).toUpperCase(),
      },
      {
        title: (
          <FormattedMessage
            id='create-deployment-configure.snapshot-summary.region'
            defaultMessage='Region'
          />
        ),
        description: snapshotDetails.regionId,
      },
    )
  }

  return summary
}

type ListItem = {
  instanceType?: string
  title: ReactNode
  titleClass?: string
  description: ReactNode
  descriptionClass?: string
  tiebreakerPrice?: string
  id?: string
}

function getListContent({
  items,
  isTrialConverting,
}: {
  items: ListItem[] | null
  isTrialConverting?: boolean
}) {
  if (items == null) {
    return []
  }

  const masterPrice = items.find(({ tiebreakerPrice }) => !!tiebreakerPrice)
  const tiebreakerIndex = findIndex(items, ({ id }) => id === `master`)

  if (masterPrice && tiebreakerIndex !== -1) {
    items[tiebreakerIndex].tiebreakerPrice = masterPrice.tiebreakerPrice
  }

  return items.map((each, index) => {
    const { title, titleClass, description, descriptionClass, tiebreakerPrice, id } = each
    const classes = cx(`${classPrefix}-item`, descriptionClass, `overflow-ellipsis`, {
      'inTrialConverting-prices': isTrialConverting && descriptionClass === `hourly-price`,
    })
    return (
      <Fragment key={index}>
        <EuiDescriptionListTitle className={cx(`${classPrefix}-item`, titleClass)}>
          {title}
          {tiebreakerPrice && id === `master` && <TiebreakerPopover price={tiebreakerPrice} />}
        </EuiDescriptionListTitle>
        <EuiDescriptionListDescription data-test-id={`${id}-line-item`} className={classes}>
          {description}
        </EuiDescriptionListDescription>
      </Fragment>
    )
  })
}

function getSummaryContent(summary, isTrialConverting) {
  return summary.map(({ title, summaryItems, description, titleClass }, index) => {
    if (summaryItems) {
      return (
        <Fragment key={index}>
          <EuiTitle
            textTransform='uppercase'
            size='xxxs'
            className={cx(`${classPrefix}-title`, titleClass)}
          >
            <h4>{title}</h4>
          </EuiTitle>
          <EuiDescriptionList
            textStyle='reverse'
            type='column'
            compressed={true}
            className={cx({ [`${titleClass}-list`]: titleClass !== undefined })}
          >
            {getListContent({ items: summaryItems, isTrialConverting })}
          </EuiDescriptionList>
        </Fragment>
      )
    }

    if (description) {
      return (
        <Fragment key={index}>
          <EuiDescriptionList textStyle='reverse' type='column' compressed={true}>
            <EuiDescriptionListTitle className={cx(`${classPrefix}-item`)}>
              {title}
            </EuiDescriptionListTitle>

            <EuiDescriptionListDescription
              className={cx(`${classPrefix}-item`, `overflow-ellipsis`)}
            >
              {description}
            </EuiDescriptionListDescription>
          </EuiDescriptionList>
        </Fragment>
      )
    }
  })
}

export default injectIntl(ArchitectureSummary)
