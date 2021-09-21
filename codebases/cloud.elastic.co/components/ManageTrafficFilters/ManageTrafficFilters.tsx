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

import { isEmpty, flatMap, uniq } from 'lodash'

import React, { Fragment, Component } from 'react'
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl'

import {
  EuiButton,
  EuiButtonIcon,
  EuiCode,
  EuiEmptyPrompt,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormHelpText,
  EuiFormLabel,
  EuiLink,
  EuiLoadingContent,
  EuiPanel,
  EuiPopover,
  EuiSpacer,
  EuiText,
  EuiTextColor,
  EuiTitle,
  EuiToolTip,
} from '@elastic/eui'

import {
  CuiAlert,
  CuiTable,
  CuiTableColumn,
  CuiBasicFilterContext,
  CuiBasicFilterContextProps,
  addToast,
} from '../../cui'

import TrafficFilterRulesetRuleSource from './TrafficFilterRulesetRuleSource'
import TrafficFilterType from './TrafficFilterType'
import EditTrafficFilterRulesetFlyout from './EditTrafficFilterRulesetFlyout'

import Header from '../Header'
import DocLink from '../DocLink'

import { trafficFiltersCrumbs } from '../../lib/crumbBuilder'
import { getShortPlatformNameByRegionId } from '../../lib/platform'

import { getFilters } from './filters'
import messages from './messages'

import {
  TrafficFilterRulesetInfo,
  FilterAssociation,
  DeploymentsSearchResponse,
} from '../../lib/api/v1/types'

import { AsyncRequestState } from '../../types'

export type Props = {
  intl: IntlShape
  deleteTrafficFilterRuleset: (ruleset: TrafficFilterRulesetInfo) => Promise<void>
  deleteTrafficFilterRulesetRequest: (ruleset: TrafficFilterRulesetInfo) => AsyncRequestState
  fetchRegionList: () => Promise<any>
  fetchTrafficFilterRulesets: () => void
  fetchTrafficFilterRulesetsRequest: AsyncRequestState
  getRegionName: (regionId: string) => string
  regionId?: string
  renderOwnHeader?: boolean
  rulesets: TrafficFilterRulesetInfo[] | null
  searchDeployments: () => void
  searchResults: DeploymentsSearchResponse | null
  searchResultsRequest: AsyncRequestState
}

type State = {
  vpcPopoverOpen: boolean
  vnetPopoverOpen: boolean
  ipAddressesPopoverOpen: boolean
  howToVpcPopoverOpen: boolean
  editingRuleset: boolean
  rulesetUnderEdit: TrafficFilterRulesetInfo | null
}

class ManageTrafficFilters extends Component<Props, State> {
  state: State = {
    vpcPopoverOpen: false,
    vnetPopoverOpen: false,
    ipAddressesPopoverOpen: false,
    howToVpcPopoverOpen: false,
    editingRuleset: false,
    rulesetUnderEdit: null,
  }

  componentDidMount() {
    const { fetchTrafficFilterRulesets, searchDeployments } = this.props
    fetchTrafficFilterRulesets()
    searchDeployments()
  }

  render() {
    const { renderOwnHeader } = this.props

    return (
      <Fragment>
        {renderOwnHeader !== false && (
          <Header
            breadcrumbs={trafficFiltersCrumbs()}
            name={
              <FormattedMessage
                id='manage-traffic-filters.header'
                defaultMessage='Traffic filters'
              />
            }
          />
        )}

        {this.renderContent()}
      </Fragment>
    )
  }

  renderContent() {
    const { fetchTrafficFilterRulesetsRequest } = this.props

    const { editingRuleset, rulesetUnderEdit } = this.state

    if (fetchTrafficFilterRulesetsRequest.error) {
      return <CuiAlert type='error'>{fetchTrafficFilterRulesetsRequest.error}</CuiAlert>
    }

    return (
      <Fragment>
        <EuiSpacer size='m' />

        {this.renderOverviewTiles()}

        <EuiSpacer size='xl' />

        {this.renderTrafficFilters()}

        {editingRuleset && (
          <EditTrafficFilterRulesetFlyout
            rulesetUnderEdit={rulesetUnderEdit}
            onClose={this.stopEditingTrafficFilter}
          />
        )}
      </Fragment>
    )
  }

  renderDescription() {
    const { ipAddressesPopoverOpen, vnetPopoverOpen, vpcPopoverOpen } = this.state

    const ipAddressesPopoverLink = (
      <EuiPopover
        ownFocus={true}
        button={
          <EuiLink onClick={() => this.setState({ ipAddressesPopoverOpen: true })}>
            <FormattedMessage
              id='manage-traffic-filters.ip-addresses'
              defaultMessage='IP addresses'
            />
          </EuiLink>
        }
        closePopover={() => this.setState({ ipAddressesPopoverOpen: false })}
        isOpen={ipAddressesPopoverOpen}
        panelPaddingSize='m'
        anchorPosition='downCenter'
      >
        <EuiText size='s' style={{ maxWidth: `400px` }}>
          <FormattedMessage
            id='manage-traffic-filters.ip-addresses-popover'
            defaultMessage='Allow traffic from specific IP addresses to your deployments, blocking all other traffic. Until you apply a rule set, all traffic is allowed. {learnMore}'
            values={{
              learnMore: (
                <DocLink link='manageTrafficFiltersIp'>
                  <FormattedMessage
                    id='manage-traffic-filters.ip-addresses-learn-more'
                    defaultMessage='Learn more'
                  />
                </DocLink>
              ),
            }}
          />
        </EuiText>
      </EuiPopover>
    )

    const vpcPopoverLink = (
      <EuiPopover
        ownFocus={true}
        button={
          <EuiLink onClick={() => this.setState({ vpcPopoverOpen: true })}>
            <FormattedMessage
              id='manage-traffic-filters.vpc'
              defaultMessage='virtual private cloud (VPC)'
            />
          </EuiLink>
        }
        closePopover={() => this.setState({ vpcPopoverOpen: false })}
        isOpen={vpcPopoverOpen}
        panelPaddingSize='m'
        anchorPosition='downCenter'
      >
        <EuiText size='s' style={{ maxWidth: `400px` }}>
          <FormattedMessage
            id='manage-traffic-filters.vpc-popover'
            defaultMessage='Connect deployments to a virtual private cloud and third-party services running in Amazon Web Services (AWS). The private link traffic stays within AWS and is not exposed to the public internet. {learnMore}'
            values={{
              learnMore: (
                <DocLink link='manageTrafficFiltersVpc'>
                  <FormattedMessage
                    id='manage-traffic-filters.vpc-learn-more'
                    defaultMessage='Learn more'
                  />
                </DocLink>
              ),
            }}
          />
        </EuiText>
      </EuiPopover>
    )

    const vnetPopoverLink = (
      <EuiPopover
        ownFocus={true}
        button={
          <EuiLink onClick={() => this.setState({ vnetPopoverOpen: true })}>
            <FormattedMessage
              id='manage-traffic-filters.vnet'
              defaultMessage='virtual network (VNet)'
            />
          </EuiLink>
        }
        closePopover={() => this.setState({ vnetPopoverOpen: false })}
        isOpen={vnetPopoverOpen}
        panelPaddingSize='m'
        anchorPosition='downCenter'
      >
        <EuiText size='s' style={{ maxWidth: `400px` }}>
          <FormattedMessage
            id='manage-traffic-filters.vnet-popover'
            defaultMessage='Connect deployments to a virtual network and third-party services running in Azure. The private link traffic stays within Azure and is not exposed to the public internet. {learnMore}'
            values={{
              learnMore: (
                <DocLink link='manageTrafficFiltersVnet'>
                  <FormattedMessage
                    id='manage-traffic-filters.vpc-learn-more'
                    defaultMessage='Learn more'
                  />
                </DocLink>
              ),
            }}
          />
        </EuiText>
      </EuiPopover>
    )

    return (
      <Fragment>
        <EuiText>
          <FormattedMessage
            id='manage-traffic-filters.description'
            defaultMessage="Limit access to deployments from a {vpc}, a {vnet}, or specific {ipAddresses}. Filter traffic using private links, CIDR blocks, or individual IP addresses. If a deployment doesn't have a filter, it can be accessed over the public internet."
            values={{
              vpc: vpcPopoverLink,
              vnet: vnetPopoverLink,
              ipAddresses: ipAddressesPopoverLink,
              learnMore: (
                <DocLink link='configureDeploymenTrafficFilters'>
                  <FormattedMessage
                    id='manage-traffic-filters.vpc-learn-more'
                    defaultMessage='Learn more'
                  />
                </DocLink>
              ),
            }}
          />
        </EuiText>
        <EuiSpacer size='xl' />
      </Fragment>
    )
  }

  renderOverviewTiles() {
    const { rulesets, searchResults } = this.props

    if (rulesets && rulesets.length === 0) {
      return null
    }

    const associatedRulesets =
      rulesets && rulesets.filter((ruleset) => Boolean(ruleset.associations))

    return (
      <EuiFlexGroup gutterSize='l' justifyContent='spaceBetween'>
        <EuiFlexItem>
          <EuiPanel color='subdued' className='panel-with-border'>
            <EuiFormLabel>
              <FormattedMessage
                id='manage-traffic-filters.status-panel-title'
                defaultMessage='Traffic filter status'
              />
            </EuiFormLabel>
            <EuiSpacer size='s' />

            {associatedRulesets ? (
              <Fragment>
                <EuiTitle>
                  <h2>
                    {associatedRulesets.length === 0 ? (
                      <FormattedMessage
                        id='manage-traffic-filters.status-inactive'
                        defaultMessage='Inactive'
                      />
                    ) : (
                      <EuiTextColor color='secondary'>
                        <FormattedMessage
                          id='manage-traffic-filters.status-active'
                          defaultMessage='{activeCount} active'
                          values={{ activeCount: associatedRulesets.length }}
                        />
                      </EuiTextColor>
                    )}
                  </h2>
                </EuiTitle>

                <EuiFormHelpText>
                  {associatedRulesets.length === 0 ? (
                    <FormattedMessage
                      id='manage-traffic-filters.status-inactive-help'
                      defaultMessage='No filters in use'
                    />
                  ) : (
                    <FormattedMessage
                      id='manage-traffic-filters.status-active-help'
                      defaultMessage='{activeCount} of {totalCount} {totalCount, plural, one {filter} other {filters}} in use'
                      values={{
                        activeCount: associatedRulesets.length,
                        totalCount: rulesets!.length,
                      }}
                    />
                  )}
                </EuiFormHelpText>
              </Fragment>
            ) : (
              <Fragment>
                <EuiSpacer size='s' />
                <EuiLoadingContent lines={2} />
              </Fragment>
            )}
          </EuiPanel>
        </EuiFlexItem>

        <EuiFlexItem>
          <EuiPanel color='subdued' className='panel-with-border'>
            <EuiFormLabel>
              <FormattedMessage
                id='manage-traffic-filters.deployments-panel-title'
                defaultMessage='Deployments protected'
              />
            </EuiFormLabel>
            <EuiSpacer size='s' />

            {rulesets ? (
              <Fragment>
                <EuiTitle>
                  <h2>{this.countProtectedDeployments()}</h2>
                </EuiTitle>

                {searchResults &&
                  searchResults.match_count !== undefined &&
                  searchResults.match_count > 0 && (
                    <EuiFormHelpText>
                      <FormattedMessage
                        id='manage-traffic-filters.deployments-fill'
                        defaultMessage='{percentage} of deployments'
                        values={{
                          percentage: `${this.getProtectedDeploymentPercentage()}%`,
                        }}
                      />
                    </EuiFormHelpText>
                  )}
              </Fragment>
            ) : (
              <Fragment>
                <EuiSpacer size='s' />
                <EuiLoadingContent lines={2} />
              </Fragment>
            )}
          </EuiPanel>
        </EuiFlexItem>

        {this.renderServiceNameTile()}
      </EuiFlexGroup>
    )
  }

  renderServiceNameTile() {
    const { howToVpcPopoverOpen } = this.state

    // see https://github.com/elastic/cloud/issues/51210
    const enabled = false

    if (!enabled) {
      return null
    }

    return (
      <EuiFlexItem>
        <EuiPanel>
          <EuiFormLabel>
            <FormattedMessage
              id='manage-traffic-filters.region-service-name'
              defaultMessage='Service name for {regionName}'
              values={{
                regionName: `AWS — US East`,
              }}
            />
          </EuiFormLabel>

          <EuiSpacer size='m' />

          <EuiCode>com.elastic-cloud.us-east1.vpce</EuiCode>

          <EuiSpacer size='m' />

          <EuiFormHelpText>
            <EuiPopover
              ownFocus={true}
              button={
                <EuiLink onClick={() => this.setState({ howToVpcPopoverOpen: true })}>
                  <FormattedMessage
                    id='manage-traffic-filters.how-to-vpc'
                    defaultMessage='How do I use this?'
                  />
                </EuiLink>
              }
              closePopover={() => this.setState({ howToVpcPopoverOpen: false })}
              isOpen={howToVpcPopoverOpen}
              panelPaddingSize='m'
              anchorPosition='downCenter'
            >
              <EuiText size='s' style={{ maxWidth: `400px` }}>
                <FormattedMessage
                  id='manage-traffic-filters.how-to-vpc-popover'
                  defaultMessage='When you create a VPC endpoint in the AWS Console, add the Elastic Cloud endpoint by searching for the service name provided above. {learnMore}'
                  values={{
                    learnMore: (
                      <DocLink link='manageTrafficFiltersVpcHowToUse'>
                        <FormattedMessage
                          id='manage-traffic-filters.how-to-vpc-learn-more'
                          defaultMessage='Learn more'
                        />
                      </DocLink>
                    ),
                  }}
                />
              </EuiText>
            </EuiPopover>
          </EuiFormHelpText>
        </EuiPanel>
      </EuiFlexItem>
    )
  }

  renderTrafficFilters() {
    const { intl, fetchRegionList, fetchTrafficFilterRulesetsRequest, regionId, rulesets } =
      this.props

    if (rulesets && rulesets.length === 0) {
      return (
        <EuiEmptyPrompt
          data-test-id='manage-traffic-filters-empty-list-view'
          style={{ maxWidth: `50em` }}
          iconType='logstashFilter'
          title={
            <h2>
              <FormattedMessage
                id='empty-traffic-filters-table.title-empty'
                defaultMessage='You have no traffic filters'
              />
            </h2>
          }
          body={
            <Fragment>
              {this.renderDescription()}
              <EuiSpacer size='s' />

              <EuiButton fill={true} onClick={this.startCreatingTrafficFilter}>
                <FormattedMessage
                  id='empty-traffic-filters-table.create'
                  defaultMessage='Create filter'
                />
              </EuiButton>
            </Fragment>
          }
        />
      )
    }

    const filters = getFilters({
      intl,
      fetchRegionList,
    })

    const schemaFields: CuiBasicFilterContextProps<TrafficFilterRulesetInfo>['schemaFields'] = [
      `id`,
      `type`,
      `name`,
      `description`,
    ]

    if (!regionId) {
      schemaFields.push(`region`)
    }

    return (
      <Fragment>
        {this.renderDescription()}
        <CuiBasicFilterContext<TrafficFilterRulesetInfo>
          rows={rulesets || undefined}
          isLoading={fetchTrafficFilterRulesetsRequest.inProgress}
          schemaFields={schemaFields}
          schemaDefaultFields={[`id`, `type`, `name`, `description`, `region`]}
          filters={filters}
          actions={
            <EuiButton fill={true} onClick={this.startCreatingTrafficFilter}>
              <FormattedMessage id='manage-traffic-filters.create' defaultMessage='Create filter' />
            </EuiButton>
          }
        >
          {this.renderTrafficFiltersTable}
        </CuiBasicFilterContext>
      </Fragment>
    )
  }

  renderTrafficFiltersTable = (rulesets?: TrafficFilterRulesetInfo[]) => {
    const {
      intl: { formatMessage },
      deleteTrafficFilterRulesetRequest,
      regionId,
      rulesets: rawRulesets,
      getRegionName,
    } = this.props

    const columns: Array<CuiTableColumn<TrafficFilterRulesetInfo>> = [
      {
        label: <FormattedMessage id='manage-traffic-filters.ruleset-name' defaultMessage='Name' />,
        render: (ruleset) => (
          <Fragment>
            <div>
              <EuiLink onClick={() => this.startEditingTrafficFilter(ruleset)}>
                {ruleset.name}
              </EuiLink>
            </div>

            <div>
              <EuiTextColor color='subdued'>{ruleset.description}</EuiTextColor>
            </div>
          </Fragment>
        ),
        sortKey: `name`,
      },

      {
        label: (
          <FormattedMessage id='manage-traffic-filters.ruleset-type' defaultMessage='Filter type' />
        ),
        render: (ruleset) => <TrafficFilterType ruleset={ruleset} />,
        width: `200px`,
      },

      {
        label: (
          <FormattedMessage id='manage-traffic-filters.default-ruleset' defaultMessage='Default' />
        ),
        render: (ruleset) =>
          ruleset.include_by_default ? (
            <EuiToolTip content={formatMessage(messages.includedByDefaultDescription)}>
              <FormattedMessage id='manage-traffic-filters.default-yes' defaultMessage='Yes' />
            </EuiToolTip>
          ) : (
            <FormattedMessage id='manage-traffic-filters.default-no' defaultMessage='No' />
          ),
        width: `90px`,
      },

      {
        label: (
          <FormattedMessage
            id='manage-traffic-filters.ruleset-usage'
            defaultMessage='Usage status'
          />
        ),
        render: (ruleset) =>
          !ruleset.associations ? (
            <FormattedMessage id='manage-traffic-filters.ruleset-unused' defaultMessage='Unused' />
          ) : (
            <FormattedMessage
              id='manage-traffic-filters.ruleset-association-count'
              defaultMessage='{associationCount} {associationCount, plural, one {deployment} other {deployments}}'
              values={{ associationCount: ruleset.associations.length }}
            />
          ),
        width: `200px`,
      },

      ...(regionId
        ? []
        : [
            {
              label: (
                <FormattedMessage
                  id='manage-traffic-filters.ruleset-platform'
                  defaultMessage='Provider'
                />
              ),
              render: (ruleset) => getShortPlatformNameByRegionId(ruleset.region),
              width: `80px`,
            },
            {
              label: (
                <FormattedMessage
                  id='manage-traffic-filters.ruleset-region'
                  defaultMessage='Region'
                />
              ),
              render: (ruleset) => getRegionName(ruleset.region),
              width: `200px`,
            },
          ]),

      {
        label: (
          <FormattedMessage id='manage-traffic-filters.ruleset-actions' defaultMessage='Actions' />
        ),
        render: (ruleset) => {
          const { name } = ruleset
          const used = Boolean(ruleset.associations && ruleset.associations.length)

          const deleteButton = (
            <EuiButtonIcon
              iconType='trash'
              aria-label={formatMessage(messages.deleteRuleset)}
              disabled={used || deleteTrafficFilterRulesetRequest(ruleset).inProgress}
              onClick={() => this.deleteTrafficFilter(ruleset)}
            />
          )

          const deleteButtonWithTooltip = used ? (
            <EuiToolTip
              position='bottom'
              content={formatMessage(messages.rulesetInUse, {
                name: <strong>{name}</strong>,
                ruleType: this.getRuleTypeText(ruleset),
              })}
            >
              {deleteButton}
            </EuiToolTip>
          ) : (
            deleteButton
          )

          return (
            <EuiFlexGroup gutterSize='m' alignItems='center' responsive={false}>
              <EuiFlexItem grow={false}>
                <EuiButtonIcon
                  iconType='pencil'
                  aria-label={formatMessage(messages.editRuleset)}
                  onClick={() => this.startEditingTrafficFilter(ruleset)}
                />
              </EuiFlexItem>

              <EuiFlexItem grow={false}>{deleteButtonWithTooltip}</EuiFlexItem>
            </EuiFlexGroup>
          )
        },
        actions: true,
        width: `120px`,
      },
    ]

    return (
      <CuiTable<TrafficFilterRulesetInfo>
        rows={rulesets}
        getRowId={(ruleset) => ruleset.id!}
        columns={columns}
        pageSize={10}
        totalCount={rulesets ? rulesets.length : undefined}
        renderDetailRow={this.renderTrafficFilterDetailRow}
        hasDetailRow={true}
        initialLoading={!rawRulesets}
        data-test-id='manage-traffic-filters-table'
      />
    )
  }

  renderTrafficFilterDetailRow = (ruleset: TrafficFilterRulesetInfo) => (
    <div>
      <EuiFormLabel>
        <FormattedMessage id='manage-traffic-filters.rules-title' defaultMessage='Rules' />
      </EuiFormLabel>

      <EuiSpacer size='xs' />

      {isEmpty(ruleset.rules) && (
        <EuiTextColor color='subdued'>
          <FormattedMessage
            id='manage-traffic-filters.rules-empty-title'
            defaultMessage='This traffic filter has no rules yet. {addSome}.'
            values={{
              addSome: (
                <EuiLink onClick={() => this.startEditingTrafficFilter(ruleset)}>
                  <FormattedMessage
                    id='manage-traffic-filters.add-rules'
                    defaultMessage='Add some rules'
                  />
                </EuiLink>
              ),
            }}
          />
        </EuiTextColor>
      )}

      <EuiText color='subdued'>
        {ruleset.rules.map((rule) => (
          <TrafficFilterRulesetRuleSource key={rule.id} rule={rule} rulesetType={ruleset.type} />
        ))}
      </EuiText>
    </div>
  )

  startCreatingTrafficFilter = () => {
    this.startEditingTrafficFilter(null)
  }

  startEditingTrafficFilter = (rulesetUnderEdit: TrafficFilterRulesetInfo | null) => {
    this.setState({ editingRuleset: true, rulesetUnderEdit })
  }

  stopEditingTrafficFilter = () => {
    this.setState({ editingRuleset: false, rulesetUnderEdit: null })
  }

  deleteTrafficFilter = (ruleset: TrafficFilterRulesetInfo) => {
    const { deleteTrafficFilterRuleset } = this.props

    deleteTrafficFilterRuleset(ruleset)
      .then(() => this.addDeleteTrafficFilterSuccessToast(ruleset))
      .catch(() => this.addDeleteTrafficFilterFailureToast(ruleset))
  }

  addDeleteTrafficFilterSuccessToast = (ruleset: TrafficFilterRulesetInfo) => {
    const {
      intl: { formatMessage },
    } = this.props

    addToast({
      family: `manage-traffic-filters`,
      id: `manage-traffic-filters.delete-ruleset-success`,
      color: `success`,
      title: (
        <strong>
          {formatMessage(messages.deleteSuccessTitle, {
            ruleType: this.getRuleTypeTitle(ruleset),
          })}
        </strong>
      ),
      text: formatMessage(messages.deleteSuccessText, {
        ruleType: this.getRuleTypeText(ruleset),
        name: <strong>{ruleset.name}</strong>,
      }),
    })
  }

  addDeleteTrafficFilterFailureToast = (ruleset: TrafficFilterRulesetInfo) => {
    const {
      intl: { formatMessage },
    } = this.props

    addToast({
      family: `manage-traffic-filters`,
      id: `manage-traffic-filters.delete-ruleset-failed`,
      color: `danger`,
      title: (
        <strong>
          {formatMessage(messages.deleteFailedTitle, {
            ruleType: this.getRuleTypeTitle(ruleset),
          })}
        </strong>
      ),
      text: formatMessage(messages.deleteFailedText, {
        ruleType: this.getRuleTypeText(ruleset),
        name: <strong>{ruleset.name}</strong>,
      }),
    })
  }

  getRuleTypeTitle(ruleset: TrafficFilterRulesetInfo) {
    const {
      intl: { formatMessage },
    } = this.props

    if (ruleset.type === `azure_private_endpoint`) {
      return formatMessage(messages.resourceInTitle)
    }

    if (ruleset.type === `vpce`) {
      return formatMessage(messages.endpointInTitle)
    }

    return formatMessage(messages.ipFilterInTitle)
  }

  getRuleTypeText(ruleset: TrafficFilterRulesetInfo) {
    const {
      intl: { formatMessage },
    } = this.props

    if (ruleset.type === `azure_private_endpoint`) {
      return formatMessage(messages.resourceInText)
    }

    if (ruleset.type === `vpce`) {
      return formatMessage(messages.endpointInText)
    }

    return formatMessage(messages.ipFilterInText)
  }

  countProtectedDeployments(): number {
    const { rulesets } = this.props
    const associatedEntityIds = flatMap(rulesets, getAssociatedEntityIds)
    const uniqueIds = uniq(associatedEntityIds)
    const protectedDeployments = uniqueIds.length

    return protectedDeployments

    function getAssociatedEntityIds(ruleset: TrafficFilterRulesetInfo): string[] {
      if (!ruleset.associations) {
        return []
      }

      return ruleset.associations.map(getAssociatedEntityId)
    }

    function getAssociatedEntityId(association: FilterAssociation): string {
      return association.id
    }
  }

  getProtectedDeploymentPercentage(): number {
    const { searchResults } = this.props
    const totalCount = (searchResults && searchResults.match_count) || 0
    const protectedDeployments = this.countProtectedDeployments()
    const protectedPercentage = Math.floor((protectedDeployments / totalCount) * 100)
    const clamped = Math.max(0, Math.min(100, protectedPercentage))

    return clamped
  }
}

export default injectIntl(ManageTrafficFilters)
