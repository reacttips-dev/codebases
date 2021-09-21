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

import { uniq, cloneDeep, without, noop } from 'lodash'

import React, { Fragment, Component } from 'react'
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl'

import {
  EuiButtonEmpty,
  EuiButtonGroup,
  EuiButtonGroupProps,
  EuiButtonIcon,
  EuiCheckbox,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutFooter,
  EuiFlyoutHeader,
  EuiFormHelpText,
  EuiFormLabel,
  EuiHorizontalRule,
  EuiLoadingContent,
  EuiRadio,
  EuiSelect,
  EuiSpacer,
  EuiText,
  EuiTextArea,
  EuiTextColor,
  EuiTitle,
  EuiToolTip,
} from '@elastic/eui'

import { CuiAlert, addToast } from '../../../cui'

import ApiRequestExample from '../../ApiRequestExample'
import SpinButton from '../../SpinButton'
import DocLink from '../../DocLink'

import { replaceIn } from '../../../lib/immutability-helpers'
import { getPlatform, getPlatformInfoById, PlatformId } from '../../../lib/platform'

import {
  createTrafficFilterRulesetUrl,
  updateTrafficFilterRulesetUrl,
} from '../../../lib/api/v1/urls'

import messages from './messages'

import {
  TrafficFilterRulesetInfo,
  TrafficFilterRule,
  TrafficFilterRulesetRequest,
} from '../../../lib/api/v1/types'
import { AsyncRequestState } from '../../../types'

export type Props = {
  intl: IntlShape
  rulesetUnderEdit: TrafficFilterRulesetInfo | null
  fetchRegionList: () => Promise<void>
  fetchRegionListRequest: AsyncRequestState
  regionIds?: string[] | null
  defaultRegionId?: string
  getRegionName: (regionId: string) => string
  saveRuleset: (ruleset: TrafficFilterRulesetRequest) => Promise<void>
  saveRulesetRequest: (ruleset: TrafficFilterRulesetRequest) => AsyncRequestState
  onClose: () => void
}

type State = {
  ruleset: TrafficFilterRulesetRequest
  pristine: boolean
}

class EditTrafficFilterRulesetFlyout extends Component<Props, State> {
  state: State = {
    ruleset: this.getInitialRulesetState(),
    pristine: true,
  }

  componentDidMount() {
    const { rulesetUnderEdit, fetchRegionList } = this.props
    const isNew = rulesetUnderEdit === null

    if (isNew) {
      fetchRegionList()
    }
  }

  render() {
    const {
      intl: { formatMessage },
      rulesetUnderEdit,
      onClose,
      saveRulesetRequest,
    } = this.props

    const { ruleset } = this.state

    const isNew = rulesetUnderEdit === null
    const saveRequest = saveRulesetRequest(ruleset)

    return (
      <EuiFlyout
        ownFocus={true}
        onClose={onClose}
        size='s'
        aria-labelledby='editTrafficFilterRulesetFlyoutTitle'
        className='fs-unmask'
      >
        <EuiFlyoutHeader hasBorder={true}>
          <EuiTitle size='s'>
            <h2 id='editTrafficFilterRulesetFlyoutTitle'>{this.renderFlyoutTitleText()}</h2>
          </EuiTitle>
        </EuiFlyoutHeader>

        <EuiFlyoutBody>
          <div>{this.renderEditor()}</div>
        </EuiFlyoutBody>

        <EuiFlyoutFooter>
          <EuiFlexGroup justifyContent='spaceBetween'>
            <EuiFlexItem grow={false}>
              <EuiButtonEmpty iconType='cross' onClick={onClose} flush='left'>
                {formatMessage(messages.cancelEditing)}
              </EuiButtonEmpty>
            </EuiFlexItem>

            <EuiFlexItem grow={false}>
              <SpinButton fill={true} onClick={this.saveChanges} spin={saveRequest.inProgress}>
                {isNew
                  ? formatMessage(messages.createTrafficFilterAction)
                  : formatMessage(messages.editTrafficFilterAction)}
              </SpinButton>

              {isNew ? (
                <ApiRequestExample
                  method='POST'
                  endpoint={createTrafficFilterRulesetUrl()}
                  body={ruleset}
                />
              ) : (
                <ApiRequestExample
                  method='PUT'
                  endpoint={updateTrafficFilterRulesetUrl({ rulesetId: rulesetUnderEdit!.id })}
                  body={ruleset}
                />
              )}
            </EuiFlexItem>
          </EuiFlexGroup>

          {saveRequest.error && (
            <Fragment>
              <EuiSpacer size='m' />

              <CuiAlert type='error'>{saveRequest.error}</CuiAlert>
            </Fragment>
          )}
        </EuiFlyoutFooter>
      </EuiFlyout>
    )
  }

  renderFlyoutTitleText() {
    const {
      intl: { formatMessage },
      rulesetUnderEdit,
    } = this.props

    const { ruleset } = this.state

    const isNew = rulesetUnderEdit === null

    if (isNew) {
      return formatMessage(messages.createTrafficFilter)
    }

    if (ruleset.type === `azure_private_endpoint`) {
      return formatMessage(messages.editVnetTrafficFilter)
    }

    if (ruleset.type === `vpce`) {
      return formatMessage(messages.editVpceTrafficFilter)
    }

    if (ruleset.type === `ip`) {
      return formatMessage(messages.editIpTrafficFilter)
    }

    return formatMessage(messages.editTrafficFilter) // sanity
  }

  renderEditor() {
    const {
      intl: { formatMessage },
      defaultRegionId,
    } = this.props

    const { ruleset, pristine } = this.state

    const cloudProviderId = getPlatform(ruleset.region)

    const isAzure = cloudProviderId === 'azure'

    const invalidNameEmpty = !pristine && ruleset.name.trim().length === 0

    return (
      <Fragment>
        {Boolean(defaultRegionId) || (
          <Fragment>
            <EuiSpacer size='m' />

            <EuiFormLabel>
              <FormattedMessage
                id='edit-traffic-filter-ruleset-flyout.endpoint-cloud-provider-label'
                defaultMessage='Cloud provider'
              />
            </EuiFormLabel>

            <EuiSpacer size='xs' />

            {this.renderCloudProviderPicker()}

            <EuiSpacer size='m' />

            <EuiFormLabel>
              <FormattedMessage
                id='edit-traffic-filter-ruleset-flyout.endpoint-region-label'
                defaultMessage='Region'
              />
            </EuiFormLabel>

            <EuiSpacer size='xs' />

            {this.renderRegionEditor()}

            <EuiSpacer size='m' />
          </Fragment>
        )}

        {this.renderFilterTypeEditor()}

        {isPrivateLinkRuleset(ruleset) && (
          <Fragment>
            <EuiText size='s'>
              <FormattedMessage
                id='edit-traffic-filter-ruleset-flyout.service-names-explainer'
                defaultMessage='Setting up your endpoint? Get the right {documentationLink} and review the rest of the prerequisites.'
                values={{
                  documentationLink: (
                    <DocLink link='manageTrafficFiltersVpc'>
                      <FormattedMessage
                        id='edit-traffic-filter-ruleset-flyout.service-names-documentation'
                        defaultMessage='Elastic Cloud service name for your region'
                      />
                    </DocLink>
                  ),
                }}
              />
            </EuiText>

            <EuiSpacer size='l' />
          </Fragment>
        )}

        <EuiFormLabel htmlFor='trafficFilterName'>
          <FormattedMessage
            id='edit-traffic-filter-ruleset-flyout.name-label'
            defaultMessage='Name'
          />
        </EuiFormLabel>

        <EuiSpacer size='xs' />

        <EuiFieldText
          id='trafficFilterName'
          isInvalid={invalidNameEmpty}
          value={ruleset.name}
          onChange={(e) => this.setState({ ruleset: replaceIn(ruleset, [`name`], e.target.value) })}
        />

        {invalidNameEmpty && (
          <EuiFormHelpText>
            <EuiTextColor color='danger'>
              <FormattedMessage
                id='edit-traffic-filter-ruleset-flyout.name-cannot-be-empty'
                defaultMessage='Enter a name'
              />
            </EuiTextColor>
          </EuiFormHelpText>
        )}

        <EuiSpacer size='m' />

        <EuiFormLabel htmlFor='trafficFilterDesc'>
          <FormattedMessage
            id='edit-traffic-filter-ruleset-flyout.description-label'
            defaultMessage='Description {optional}'
            values={{
              optional: (
                <EuiTextColor color='subdued'>
                  <FormattedMessage
                    id='edit-traffic-filter-ruleset-flyout.description-optional-label'
                    defaultMessage='(optional)'
                  />
                </EuiTextColor>
              ),
            }}
          />
        </EuiFormLabel>

        <EuiSpacer size='xs' />

        <EuiTextArea
          id='trafficFilterDesc'
          value={ruleset.description}
          onChange={(e) =>
            this.setState({ ruleset: replaceIn(ruleset, [`description`], e.target.value) })
          }
        />

        {isPrivateLinkRuleset(ruleset) && (
          <Fragment>
            <EuiSpacer size='m' />

            {isAzure ? (
              <Fragment>
                <EuiFormLabel htmlFor='trafficFilterResourceName'>
                  <FormattedMessage
                    id='edit-traffic-filter-ruleset-flyout.resource-name-label'
                    defaultMessage='Resource name'
                  />
                </EuiFormLabel>

                <EuiSpacer size='xs' />

                <EuiFieldText
                  id='trafficFilterResourceName'
                  placeholder={formatMessage(messages.vnetNamePlaceholder)}
                  value={
                    (ruleset.rules && ruleset.rules[0] && ruleset.rules[0].azure_endpoint_name) ||
                    ``
                  }
                  onChange={(e) =>
                    this.setState({
                      ruleset: replaceIn(
                        ruleset,
                        [`rules`, `0`, `azure_endpoint_name`],
                        e.target.value,
                      ),
                    })
                  }
                />

                <EuiFormHelpText>
                  <DocLink link='manageTrafficFiltersVpcFindResourceName'>
                    <FormattedMessage
                      id='edit-traffic-filter-ruleset-flyout.vpc-resource-name-where-to-find'
                      defaultMessage='How do I find my resource name?'
                    />
                  </DocLink>
                </EuiFormHelpText>

                <EuiSpacer size='m' />

                <EuiFormLabel htmlFor='trafficFilterResourceId'>
                  <FormattedMessage
                    id='edit-traffic-filter-ruleset-flyout.resource-id-label'
                    defaultMessage='Resource ID'
                  />
                </EuiFormLabel>

                <EuiSpacer size='xs' />

                <EuiFieldText
                  id='trafficFilterResourceId'
                  placeholder={formatMessage(messages.vnetIdPlaceholder)}
                  value={
                    (ruleset.rules && ruleset.rules[0] && ruleset.rules[0].azure_endpoint_guid) ||
                    ``
                  }
                  onChange={(e) =>
                    this.setState({
                      ruleset: replaceIn(
                        ruleset,
                        [`rules`, `0`, `azure_endpoint_guid`],
                        e.target.value,
                      ),
                    })
                  }
                />

                <EuiFormHelpText>
                  <DocLink link='manageTrafficFiltersVpcFindResourceId'>
                    <FormattedMessage
                      id='edit-traffic-filter-ruleset-flyout.vpc-resource.id-where-to-find'
                      defaultMessage='How do I find my resource ID?'
                    />
                  </DocLink>
                </EuiFormHelpText>
              </Fragment>
            ) : (
              <Fragment>
                <EuiFormLabel htmlFor='trafficFilterSource'>
                  <FormattedMessage
                    id='edit-traffic-filter-ruleset-flyout.endpoint-id-label'
                    defaultMessage='Endpoint ID'
                  />
                </EuiFormLabel>

                <EuiSpacer size='xs' />

                <EuiFieldText
                  id='trafficFilterSource'
                  placeholder={formatMessage(messages.endpointPlaceholder)}
                  value={(ruleset.rules && ruleset.rules[0] && ruleset.rules[0].source) || ``}
                  onChange={(e) =>
                    this.setState({
                      ruleset: replaceIn(ruleset, [`rules`, `0`, `source`], e.target.value),
                    })
                  }
                />

                <EuiFormHelpText>
                  <DocLink link='manageTrafficFiltersVpcFindEndpoint'>
                    <FormattedMessage
                      id='edit-traffic-filter-ruleset-flyout.vpc-endpoint-where-to-find'
                      defaultMessage='How do I find my endpoint ID?'
                    />
                  </DocLink>
                </EuiFormHelpText>
              </Fragment>
            )}
          </Fragment>
        )}

        {ruleset.type === `ip` && (
          <Fragment>
            <EuiSpacer size='m' />

            <EuiTitle size='xs'>
              <h3>
                <FormattedMessage
                  id='edit-traffic-filter-ruleset-flyout.rules-label'
                  defaultMessage='Rules'
                />
              </h3>
            </EuiTitle>

            <EuiSpacer size='m' />

            {ruleset.rules.map((rule, index, rules) => {
              const lastRule = index === rules.length - 1

              return (
                <Fragment key={rule.id || index}>
                  <EuiFormLabel htmlFor='trafficFilterSource'>
                    <FormattedMessage
                      id='edit-traffic-filter-ruleset-flyout.source-label'
                      defaultMessage='Source'
                    />
                  </EuiFormLabel>

                  <EuiFlexGroup gutterSize='m' responsive={false} alignItems='center'>
                    <EuiFlexItem>
                      <EuiFieldText
                        id='trafficFilterSource'
                        value={rule.source}
                        onChange={(e) =>
                          this.setState({
                            ruleset: replaceIn(
                              ruleset,
                              [`rules`, String(index), `source`],
                              e.target.value,
                            ),
                          })
                        }
                      />
                    </EuiFlexItem>

                    <EuiFlexItem grow={false}>
                      <div>
                        <EuiFlexGroup gutterSize='m' responsive={false} alignItems='center'>
                          <EuiFlexItem grow={false}>
                            <EuiButtonIcon
                              iconType='minusInCircleFilled'
                              disabled={rules.length === 1}
                              aria-label={formatMessage(messages.addAnotherRule)}
                              onClick={() =>
                                this.setState({
                                  ruleset: replaceIn(
                                    ruleset,
                                    [`rules`],
                                    without(ruleset.rules, rule),
                                  ),
                                })
                              }
                            />
                          </EuiFlexItem>

                          <EuiFlexItem grow={false}>
                            <EuiButtonIcon
                              iconType='plusInCircleFilled'
                              disabled={!lastRule}
                              aria-label={formatMessage(messages.removeThisRule)}
                              onClick={() =>
                                this.setState({
                                  ruleset: replaceIn(
                                    ruleset,
                                    [`rules`],
                                    [...ruleset.rules, { source: `` }],
                                  ),
                                })
                              }
                            />
                          </EuiFlexItem>
                        </EuiFlexGroup>
                      </div>
                    </EuiFlexItem>
                  </EuiFlexGroup>

                  {lastRule ? (
                    <EuiFormHelpText>
                      <FormattedMessage
                        id='edit-traffic-filter-ruleset-flyout.source-help-text'
                        defaultMessage='Enter CIDR or IP address e.g. 192.168.132.6/22'
                      />
                    </EuiFormHelpText>
                  ) : (
                    <EuiSpacer size='m' />
                  )}
                </Fragment>
              )
            })}
          </Fragment>
        )}

        <EuiSpacer size='m' />

        <EuiHorizontalRule />

        <EuiSpacer size='m' />

        <EuiTitle size='xs'>
          <h3>
            <FormattedMessage
              id='edit-traffic-filter-ruleset-flyout.add-to-deployments-label'
              defaultMessage='Add to deployments'
            />
          </h3>
        </EuiTitle>

        <EuiSpacer size='m' />

        <EuiCheckbox
          id='include-traffic-filter-by-default'
          label={formatMessage(messages.includeByDefault)}
          checked={ruleset.include_by_default}
          onChange={() =>
            this.setState({
              ruleset: replaceIn(ruleset, [`include_by_default`], !ruleset.include_by_default),
            })
          }
        />

        <EuiFormHelpText>
          <FormattedMessage
            id='edit-traffic-filter-ruleset-flyout.include-by-default-description'
            defaultMessage='Any future eligible deployments will have this filter applied automatically.'
          />
        </EuiFormHelpText>
      </Fragment>
    )
  }

  renderCloudProviderPicker() {
    const {
      intl: { formatMessage },
      regionIds,
      rulesetUnderEdit,
    } = this.props

    const { ruleset } = this.state
    const selectedCloudProvider = getPlatform(ruleset.region)

    const isNew = rulesetUnderEdit === null

    const buttonGroupProps: EuiButtonGroupProps = {
      color: 'primary',
      isFullWidth: true,
      legend: formatMessage(messages.selectCloudProvider),
      idSelected: selectedCloudProvider,
      options: [],
      onChange: noop,
    }

    if (!isNew) {
      return (
        <EuiButtonGroup
          {...buttonGroupProps}
          options={[getCloudProviderButton(selectedCloudProvider)]}
          isDisabled={true}
        />
      )
    }

    if (!regionIds) {
      return <EuiLoadingContent lines={1} />
    }

    const cloudProviders = uniq(regionIds.map(getPlatform))

    const filteredCloudProviders =
      ruleset.type === 'ip'
        ? cloudProviders
        : cloudProviders.filter((cloudProvider) => ['aws', 'azure'].includes(cloudProvider))

    const cloudProviderButtons = filteredCloudProviders.map(getCloudProviderButton)

    return (
      <EuiButtonGroup
        {...buttonGroupProps}
        options={cloudProviderButtons}
        onChange={(cloudProvider) => {
          if (selectedCloudProvider === cloudProvider) {
            return
          }

          const providerRegionIds = regionIds.filter(
            (regionId) => getPlatform(regionId) === cloudProvider,
          )

          const [defaultProviderRegionId] = providerRegionIds

          this.setRegion(defaultProviderRegionId)
        }}
      />
    )

    function getCloudProviderButton(cloudProvider: PlatformId) {
      const { id, iconType, shortTitle } = getPlatformInfoById(cloudProvider)

      return {
        id,
        iconType,
        label: shortTitle,
      }
    }
  }

  renderRegionEditor() {
    const { fetchRegionListRequest, regionIds, rulesetUnderEdit, getRegionName } = this.props

    const { ruleset, pristine } = this.state

    const isNew = rulesetUnderEdit === null

    const invalidRegionEmpty = !pristine && !ruleset.region

    if (!isNew) {
      return (
        <div data-test-id='edit-traffic-filter-ruleset-flyout-region-readonly'>
          <EuiFieldText value={getRegionName(ruleset.region)} readOnly={true} />
        </div>
      )
    }

    if (!regionIds) {
      return <EuiLoadingContent lines={1} />
    }

    const cloudProvider = getPlatform(ruleset.region)
    const filteredRegionIds = regionIds.filter(
      (regionId) => getPlatform(regionId) === cloudProvider,
    )

    const regionOptions = filteredRegionIds
      .map((regionId) => ({
        value: regionId,
        text: getRegionName(regionId),
      }))
      .sort((a, b) => a.text.localeCompare(b.text))

    return (
      <Fragment>
        <div data-test-id='edit-traffic-filter-ruleset-flyout-region-select'>
          <EuiSelect
            isLoading={fetchRegionListRequest.inProgress}
            options={regionOptions}
            value={ruleset.region}
            onChange={(e) => this.setRegion(e.target.value)}
          />
        </div>

        {invalidRegionEmpty && (
          <EuiFormHelpText>
            <EuiTextColor color='danger'>
              <FormattedMessage
                id='edit-traffic-filter-ruleset-flyout.region-cannot-be-empty'
                defaultMessage='Select a region'
              />
            </EuiTextColor>
          </EuiFormHelpText>
        )}

        {fetchRegionListRequest.error && (
          <Fragment>
            <EuiSpacer size='m' />

            <CuiAlert type='error'>{fetchRegionListRequest.error}</CuiAlert>
          </Fragment>
        )}
      </Fragment>
    )
  }

  renderFilterTypeEditor() {
    const {
      intl: { formatMessage },
      rulesetUnderEdit,
      defaultRegionId,
    } = this.props

    const { ruleset } = this.state

    const cloudProviderId = getPlatform(ruleset.region)
    const cloudProviderInfo = getPlatformInfoById(cloudProviderId)
    const cloudProviderTitle = cloudProviderInfo.title

    const isEce = Boolean(defaultRegionId)
    const isAws = cloudProviderId === 'aws'
    const isAzure = cloudProviderId === 'azure'
    const isNew = rulesetUnderEdit === null

    const supportsPrivateLink = !isEce && (isAws || isAzure)

    const privateLinkRadio = (
      <EuiRadio
        id='trafficFilter-selectFilterType-vpce'
        label={formatMessage(messages.selectFilterTypeEndpoint)}
        checked={isPrivateLinkRuleset(ruleset)}
        disabled={!supportsPrivateLink}
        onChange={() => {
          const rules: TrafficFilterRule[] = [
            isAzure ? { azure_endpoint_name: ``, azure_endpoint_guid: `` } : { source: `` },
          ]

          const rulesetWithEmptyRules = replaceIn(ruleset, [`rules`], rules)

          const nextRuleset = replaceIn(
            rulesetWithEmptyRules,
            [`type`],
            isAzure ? `azure_private_endpoint` : `vpce`,
          )

          this.setState({ ruleset: nextRuleset })
        }}
      />
    )

    if (!isNew) {
      return null
    }

    return (
      <Fragment>
        <EuiFormLabel>
          <FormattedMessage
            id='edit-traffic-filter-ruleset-flyout.filter-type-label'
            defaultMessage='Filter type'
          />
        </EuiFormLabel>

        <EuiSpacer size='xs' />

        {isEce ? (
          <FormattedMessage {...messages.selectFilterTypeIpAddress} />
        ) : (
          <Fragment>
            <EuiRadio
              id='trafficFilter-selectFilterType-ip'
              label={formatMessage(messages.selectFilterTypeIpAddress)}
              checked={ruleset.type === `ip`}
              onChange={() => {
                const rulesetWithEmptyRules = replaceIn(ruleset, [`rules`], [{ source: `` }])
                const nextRuleset = replaceIn(rulesetWithEmptyRules, [`type`], `ip`)

                this.setState({ ruleset: nextRuleset })
              }}
            />

            <EuiSpacer size='xs' />

            {supportsPrivateLink ? (
              privateLinkRadio
            ) : (
              <EuiToolTip
                position='bottom'
                content={formatMessage(messages.privateLinkUnsupported, { cloudProviderTitle })}
              >
                {privateLinkRadio}
              </EuiToolTip>
            )}
          </Fragment>
        )}

        <EuiSpacer size='m' />
      </Fragment>
    )
  }

  hasValidationErrors(): boolean {
    const { ruleset } = this.state

    if (ruleset.name.trim() === ``) {
      return true
    }

    if (!ruleset.region) {
      return true
    }

    return false
  }

  setRegion = (regionId: string) => {
    const { ruleset } = this.state

    const nextCloudProvider = getPlatform(regionId)

    const rulesetInNextRegion = replaceIn(ruleset, [`region`], regionId)
    const rulesetWithNextRules = replaceIn(rulesetInNextRegion, [`rules`], getNextRules())
    const rulesetInNextType = replaceIn(rulesetWithNextRules, [`type`], getNextRulesetType())

    this.setState({
      ruleset: rulesetInNextType,
    })

    function getNextRules() {
      const { rules } = ruleset

      if (!rules) {
        return rules
      }

      // switch into Azure VNet model
      if (nextCloudProvider === 'azure' && ruleset.type === 'vpce') {
        return [{ azure_endpoint_name: ``, azure_endpoint_guid: `` }]
      }

      // switch out of Azure VNet model
      if (nextCloudProvider !== 'azure' && ruleset.type === 'azure_private_endpoint') {
        return [{ source: `` }]
      }

      return rules
    }

    function getNextRulesetType() {
      // respect equivalences when switching Cloud providers
      if (ruleset.type === 'azure_private_endpoint') {
        if (nextCloudProvider === 'azure') {
          return ruleset.type
        }

        if (nextCloudProvider === 'aws') {
          return 'vpce'
        }
      }

      if (ruleset.type === 'vpce') {
        if (nextCloudProvider === 'azure') {
          return 'azure_private_endpoint'
        }

        if (nextCloudProvider === 'aws') {
          return ruleset.type
        }
      }

      return 'ip'
    }
  }

  saveChanges = () => {
    const { rulesetUnderEdit, saveRuleset } = this.props

    const { ruleset } = this.state

    if (this.hasValidationErrors()) {
      this.setState({ pristine: false })
      return
    }

    saveRuleset(ruleset).then(() => {
      if (rulesetUnderEdit === null) {
        this.addCreateSuccessToast()
      } else {
        this.addUpdateSuccessToast()
      }
    })
  }

  getInitialRulesetState(): TrafficFilterRulesetRequest {
    const { rulesetUnderEdit, defaultRegionId } = this.props

    if (rulesetUnderEdit !== null) {
      return cloneDeep(rulesetUnderEdit)
    }

    return {
      name: ``,
      region: defaultRegionId || ``,
      description: ``,
      type: `ip`,
      rules: [{ source: `` }],
      include_by_default: false,
    }
  }

  getInitialCloudProviderState(): PlatformId {
    const { rulesetUnderEdit, defaultRegionId } = this.props

    const regionId = rulesetUnderEdit ? rulesetUnderEdit.region : defaultRegionId
    const platformId = getPlatform(regionId)

    return platformId
  }

  addCreateSuccessToast() {
    const {
      intl: { formatMessage },
    } = this.props

    const { ruleset } = this.state

    addToast({
      family: `edit-traffic-filter-flyout`,
      id: `edit-traffic-filter-flyout.create-success`,
      color: `success`,
      title: (
        <strong>
          {formatMessage(messages.createSuccessTitle, {
            ruleType: this.getRuleTypeTitle(ruleset),
          })}
        </strong>
      ),
      text: formatMessage(messages.createSuccessText, {
        ruleType: this.getRuleTypeText(ruleset),
        name: <strong>{ruleset.name}</strong>,
      }),
    })
  }

  addUpdateSuccessToast() {
    const {
      intl: { formatMessage },
    } = this.props

    const { ruleset } = this.state

    addToast({
      family: `edit-traffic-filter-flyout`,
      id: `edit-traffic-filter-flyout.update-success`,
      color: `success`,
      title: (
        <strong>
          {formatMessage(messages.updateSuccessTitle, {
            ruleType: this.getRuleTypeTitle(ruleset),
          })}
        </strong>
      ),
      text: formatMessage(messages.updateSuccessText, {
        ruleType: this.getRuleTypeText(ruleset),
        name: <strong>{ruleset.name}</strong>,
      }),
    })
  }

  getRuleTypeTitle(ruleset: TrafficFilterRulesetRequest) {
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

  getRuleTypeText(ruleset: TrafficFilterRulesetRequest) {
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
}

export default injectIntl(EditTrafficFilterRulesetFlyout)

function isPrivateLinkRuleset(ruleset: TrafficFilterRulesetRequest): boolean {
  return ruleset.type === `vpce` || ruleset.type === `azure_private_endpoint`
}
