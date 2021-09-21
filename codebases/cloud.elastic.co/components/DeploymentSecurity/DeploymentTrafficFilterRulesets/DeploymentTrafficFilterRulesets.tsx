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

import React, { Component, Fragment } from 'react'
import { FormattedMessage, IntlShape, injectIntl, defineMessages } from 'react-intl'

import { EuiButton, EuiButtonIcon, EuiCode, EuiDescribedFormGroup, EuiSpacer } from '@elastic/eui'

import { CuiAlert, CuiTable, CuiTableColumn, withErrorBoundary, addToast } from '../../../cui'

import ApplyDeploymentTrafficFilterFlyout from './ApplyDeploymentTrafficFilterFlyout'

import DangerButton from '../../DangerButton'
import DocLink from '../../DocLink'

import TrafficFilterType from '../../ManageTrafficFilters/TrafficFilterType'
import TrafficFilterRulesetLink from '../../ManageTrafficFilters/TrafficFilterRulesetLink'
import TrafficFiltersCreationLink from '../../ManageTrafficFilters/TrafficFiltersCreationLink'

import { StackDeployment, AsyncRequestState } from '../../../types'
import { TrafficFilterRulesetInfo, FilterAssociation } from '../../../lib/api/v1/types'

export type Props = {
  intl: IntlShape
  regionId: string
  deployment: StackDeployment | null
  trafficFilterRulesets: TrafficFilterRulesetInfo[] | null
  fetchTrafficFilterRulesets: () => void
  fetchTrafficFilterRulesetsRequest: AsyncRequestState
  deleteRulesetAssociation: (rulesetId: string) => Promise<void>
  deleteRulesetAssociationRequest: (rulesetId: string) => AsyncRequestState
}

type State = {
  editingTrafficFilter: boolean
}

const messages = defineMessages({
  removeFilter: {
    id: `deployment-traffic-filter-rulesets.remove-filter`,
    defaultMessage: `Remove filter`,
  },
  removeLastFilter: {
    id: `deployment-traffic-filter-rulesets.remove-last-filter`,
    defaultMessage: `Remove filter and allow all traffic`,
  },
  removeFilterConfirmTitle: {
    id: `deployment-traffic-filter-rulesets.remove-filter-confirm-title`,
    defaultMessage: `Remove filter?`,
  },
  removeFilterConfirmBody: {
    id: `deployment-traffic-filter-rulesets.remove-filter-confirm-body`,
    defaultMessage: `Removing this filter will prevent traffic from {sourceCount, plural, one {{sources}} other {the following sources: {sources}}}.`,
  },
  andConnector: {
    id: `deployment-traffic-filter-rulesets.and-connector`,
    defaultMessage: `, and`,
  },
  commaConnector: {
    id: `deployment-traffic-filter-rulesets.comma-connector`,
    defaultMessage: `,`,
  },
  removeFilterConfirmButtonText: {
    id: `deployment-traffic-filter-rulesets.remove-filter-confirm-button-text`,
    defaultMessage: `Remove filter`,
  },
  removeLastFilterConfirmTitle: {
    id: `deployment-traffic-filter-rulesets.remove-last-filter-confirm-title`,
    defaultMessage: `Remove filter and allow all traffic?`,
  },
  removeLastFilterConfirmBody: {
    id: `deployment-traffic-filter-rulesets.remove-last-filter-confirm-body`,
    defaultMessage: `Removing this filter will allow all traffic. To avoid unwanted traffic, consider applying a different traffic filter first.`,
  },
  removeLastFilterConfirmButtonText: {
    id: `deployment-traffic-filter-rulesets.remove-last-filter-confirm-button-text`,
    defaultMessage: `Remove filter and allow all traffic`,
  },
  removedTrafficFilterTitle: {
    id: `deployment-traffic-filter-rulesets.traffic-filter-removed-title`,
    defaultMessage: `Traffic filter removed`,
  },
  removedTrafficFilterText: {
    id: `deployment-traffic-filter-rulesets.traffic-filter-removed-text`,
    defaultMessage: `Traffic to this deployment is now more restricted.`,
  },
  removedLastTrafficFilterText: {
    id: `deployment-traffic-filter-rulesets.last-traffic-filter-removed-text`,
    defaultMessage: `All traffic is now allowed.`,
  },
})

class DeploymentTrafficFilterRulesets extends Component<Props, State> {
  state: State = {
    editingTrafficFilter: false,
  }

  componentDidMount() {
    const { fetchTrafficFilterRulesets } = this.props
    fetchTrafficFilterRulesets()
  }

  render() {
    const { deployment, regionId } = this.props
    const { editingTrafficFilter } = this.state

    return (
      <Fragment>
        <EuiDescribedFormGroup
          fullWidth={true}
          title={
            <h3>
              <FormattedMessage
                id='deployment-traffic-filter-rulesets.title'
                defaultMessage='Traffic filters'
              />
            </h3>
          }
          description={
            <div>
              <FormattedMessage
                id='deployment-traffic-filter-rulesets.description-line-1'
                defaultMessage='Specify the traffic allowed to connect to the deployment.'
              />

              <EuiSpacer size='m' />

              <FormattedMessage
                id='deployment-traffic-filter-rulesets.description-line-2'
                defaultMessage='Traffic matching any filter is allowed, all other traffic is denied. {learnMore}'
                values={{
                  learnMore: (
                    <DocLink link='configureDeploymenTrafficFilters'>
                      <FormattedMessage
                        id='deployment-traffic-filter-rulesets.learn-more'
                        defaultMessage='Learn more'
                      />
                    </DocLink>
                  ),
                }}
              />

              <EuiSpacer size='m' />

              <TrafficFiltersCreationLink regionId={regionId} />
            </div>
          }
        >
          <div>
            <EuiButton
              size='s'
              onClick={this.startApplyingFilter}
              data-test-id='traffic-filters-apply-filter-btn'
            >
              <FormattedMessage
                id='deployment-traffic-filter-rulesets.apply-filter'
                defaultMessage='Apply filter'
              />
            </EuiButton>

            <EuiSpacer size='l' />

            {this.renderAssociationsTable()}
          </div>
        </EuiDescribedFormGroup>

        {editingTrafficFilter && (
          <ApplyDeploymentTrafficFilterFlyout
            regionId={regionId}
            deploymentId={deployment!.id}
            onClose={this.stopEditingTrafficFilter}
          />
        )}
      </Fragment>
    )
  }

  renderAssociationsTable() {
    const {
      intl: { formatMessage },
      regionId,
      fetchTrafficFilterRulesetsRequest,
      deleteRulesetAssociation,
      deleteRulesetAssociationRequest,
    } = this.props

    if (fetchTrafficFilterRulesetsRequest.error) {
      return <CuiAlert type='error'>{fetchTrafficFilterRulesetsRequest.error}</CuiAlert>
    }

    const rulesets = this.getAssociatedRulesets()

    if (rulesets.length === 0) {
      return null // skip rendering of placeholder "no items" table
    }

    const hasAtLeastTwoAssociatedRulesets = rulesets.length >= 2

    const columns: Array<CuiTableColumn<TrafficFilterRulesetInfo>> = [
      {
        label: (
          <FormattedMessage id='deployment-traffic-filter-rulesets.name' defaultMessage='Name' />
        ),
        render: (ruleset) => <TrafficFilterRulesetLink regionId={regionId} ruleset={ruleset} />,
      },

      {
        label: (
          <FormattedMessage
            id='deployment-traffic-filter-rulesets.filter-type'
            defaultMessage='Filter type'
          />
        ),
        render: (ruleset) => <TrafficFilterType ruleset={ruleset} />,
      },

      {
        label: (
          <FormattedMessage
            id='deployment-traffic-filter-rulesets.actions'
            defaultMessage='Actions'
          />
        ),
        render: (ruleset) => (
          <DangerButton
            buttonType={EuiButtonIcon}
            buttonProps={{ color: `danger` }}
            isEmpty={true}
            iconType='cross'
            aria-label={
              hasAtLeastTwoAssociatedRulesets
                ? formatMessage(messages.removeFilter)
                : formatMessage(messages.removeLastFilter)
            }
            modal={{
              title: hasAtLeastTwoAssociatedRulesets
                ? formatMessage(messages.removeFilterConfirmTitle)
                : formatMessage(messages.removeLastFilterConfirmTitle),

              confirmButtonText: hasAtLeastTwoAssociatedRulesets
                ? formatMessage(messages.removeFilterConfirmButtonText)
                : formatMessage(messages.removeLastFilterConfirmButtonText),

              body: (
                <Fragment>
                  {hasAtLeastTwoAssociatedRulesets
                    ? formatMessage(messages.removeFilterConfirmBody, {
                        sources: (
                          <Fragment>
                            {ruleset.rules.map((rule, index, rules) => (
                              <Fragment key={rule.id}>
                                {index === 0 || (
                                  <Fragment>
                                    {rules.length - 1 === index
                                      ? formatMessage(messages.andConnector)
                                      : formatMessage(messages.commaConnector)}

                                    {` `}
                                  </Fragment>
                                )}

                                <EuiCode key={rule.id}>{rule.source}</EuiCode>
                              </Fragment>
                            ))}
                          </Fragment>
                        ),
                        sourceCount: ruleset.rules.length,
                      })
                    : formatMessage(messages.removeLastFilterConfirmBody)}

                  {deleteRulesetAssociationRequest(ruleset.id).error && (
                    <Fragment>
                      <EuiSpacer size='m' />

                      <CuiAlert type='error'>
                        {deleteRulesetAssociationRequest(ruleset.id).error}
                      </CuiAlert>
                    </Fragment>
                  )}
                </Fragment>
              ),
            }}
            onConfirm={() =>
              deleteRulesetAssociation(ruleset.id).then(() => {
                this.addDeleteSuccessToast({ hasAtLeastTwoAssociatedRulesets })
              })
            }
            onConfirmPromise={true}
          />
        ),
        actions: true,
      },
    ]

    return <CuiTable columns={columns} rows={rulesets} getRowId={(ruleset) => ruleset.id} />
  }

  startApplyingFilter = () => {
    this.setState({ editingTrafficFilter: true })
  }

  stopEditingTrafficFilter = () => {
    this.setState({ editingTrafficFilter: false })
  }

  getAssociatedRulesets = (): TrafficFilterRulesetInfo[] => {
    const { trafficFilterRulesets } = this.props

    if (!trafficFilterRulesets) {
      return []
    }

    return trafficFilterRulesets.filter(this.isRulesetAssociatedToDeployment)
  }

  isRulesetAssociatedToDeployment = (ruleset: TrafficFilterRulesetInfo): boolean => {
    const { deployment } = this.props
    const { id } = deployment!

    if (!Array.isArray(ruleset.associations)) {
      return false
    }

    return ruleset.associations.some(matchesThisDeployment)

    function matchesThisDeployment(association: FilterAssociation): boolean {
      return association.entity_type === `deployment` && association.id === id
    }
  }

  addDeleteSuccessToast = ({
    hasAtLeastTwoAssociatedRulesets,
  }: {
    hasAtLeastTwoAssociatedRulesets: boolean
  }) => {
    const {
      intl: { formatMessage },
    } = this.props

    addToast({
      family: `deployment-traffic-filter-rulesets`,
      id: `deployment-traffic-filter-rulesets.remove-association-success`,
      color: `success`,
      title: <strong>{formatMessage(messages.removedTrafficFilterTitle)}</strong>,
      text: hasAtLeastTwoAssociatedRulesets
        ? formatMessage(messages.removedTrafficFilterText)
        : formatMessage(messages.removedLastTrafficFilterText),
    })
  }
}

export default withErrorBoundary(injectIntl(DeploymentTrafficFilterRulesets))
