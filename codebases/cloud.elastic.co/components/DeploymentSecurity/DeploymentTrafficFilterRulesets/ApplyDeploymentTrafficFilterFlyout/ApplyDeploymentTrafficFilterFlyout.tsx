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

import { find } from 'lodash'

import React, { Fragment, Component } from 'react'
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl'

import {
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFormHelpText,
  EuiLoadingContent,
  EuiFlyoutFooter,
  EuiFlyoutHeader,
  EuiFormLabel,
  EuiSpacer,
  EuiSelect,
  EuiText,
  EuiTitle,
} from '@elastic/eui'

import { CuiAlert, addToast } from '../../../../cui'

import ApiRequestExample from '../../../ApiRequestExample'
import SpinButton from '../../../SpinButton'

import TrafficFiltersCreationLink from '../../../ManageTrafficFilters/TrafficFiltersCreationLink'
import TrafficFilterRulesetRuleSource from '../../../ManageTrafficFilters/TrafficFilterRulesetRuleSource'

import messages from './messages'

import { createTrafficFilterRulesetAssociationUrl } from '../../../../lib/api/v1/urls'

import { TrafficFilterRulesetInfo, FilterAssociation } from '../../../../lib/api/v1/types'
import { AsyncRequestState } from '../../../../types'

type Props = {
  intl: IntlShape
  deploymentId: string
  regionId: string
  trafficFilterRulesets: TrafficFilterRulesetInfo[] | null
  createRulesetAssociation: (rulesetId: string) => Promise<void>
  createRulesetAssociationRequest: (rulesetId: string) => AsyncRequestState
  onClose: () => void
}

type State = {
  ruleset: TrafficFilterRulesetInfo | null
}

class ApplyDeploymentTrafficFilterFlyout extends Component<Props, State> {
  state: State = {
    ruleset: null,
  }

  render() {
    const {
      intl: { formatMessage },
      onClose,
      createRulesetAssociationRequest,
      deploymentId,
    } = this.props

    const { ruleset } = this.state

    return (
      <EuiFlyout
        ownFocus={true}
        onClose={onClose}
        size='s'
        aria-labelledby='applyDeploymentTrafficFilterFlyoutTitle'
      >
        <EuiFlyoutHeader hasBorder={true}>
          <EuiTitle size='s'>
            <h2 id='applyDeploymentTrafficFilterFlyoutTitle'>
              {formatMessage(messages.applyTrafficFilter)}
            </h2>
          </EuiTitle>
        </EuiFlyoutHeader>

        <EuiFlyoutBody>
          <div>{this.renderEditor()}</div>
        </EuiFlyoutBody>

        <EuiFlyoutFooter>
          <EuiFlexGroup justifyContent='spaceBetween'>
            <EuiFlexItem grow={false}>
              <EuiButtonEmpty iconType='cross' onClick={onClose} flush='left'>
                {formatMessage(messages.closeFlyout)}
              </EuiButtonEmpty>
            </EuiFlexItem>

            <EuiFlexItem grow={false}>
              <SpinButton
                type='button'
                onClick={this.saveChanges}
                disabled={!ruleset}
                spin={Boolean(ruleset && createRulesetAssociationRequest(ruleset.id).inProgress)}
                fill={true}
              >
                {formatMessage(messages.applyTrafficFilterAction)}
              </SpinButton>

              {ruleset && (
                <Fragment>
                  <ApiRequestExample
                    method='POST'
                    endpoint={createTrafficFilterRulesetAssociationUrl({ rulesetId: ruleset.id })}
                    body={{
                      id: deploymentId,
                      entity_type: `deployment`,
                    }}
                  />

                  {createRulesetAssociationRequest(ruleset.id).error && (
                    <Fragment>
                      <EuiSpacer size='m' />

                      <CuiAlert type='error'>
                        {createRulesetAssociationRequest(ruleset.id).error}
                      </CuiAlert>
                    </Fragment>
                  )}
                </Fragment>
              )}
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlyoutFooter>
      </EuiFlyout>
    )
  }

  renderEditor() {
    return (
      <Fragment>
        <EuiFormLabel>
          <FormattedMessage
            id='apply-deployment-filter-flyout.select-filter'
            defaultMessage='Select filter'
          />
        </EuiFormLabel>

        <EuiSpacer size='xs' />

        {this.renderRulesetPicker()}

        {this.renderRuleset()}
      </Fragment>
    )
  }

  renderRulesetPicker() {
    const { regionId, trafficFilterRulesets } = this.props
    const { ruleset } = this.state

    if (!trafficFilterRulesets) {
      return <EuiLoadingContent />
    }

    const options = this.getRulesetOptions()

    return (
      <Fragment>
        <EuiSelect
          options={options}
          disabled={options.length === 0}
          value={ruleset ? ruleset.id : ``}
          onChange={(e) => {
            const id = e.target.value
            const nextRuleset = find(trafficFilterRulesets, { id }) || null
            this.setState({ ruleset: nextRuleset })
          }}
        />

        {options.length === 0 && (
          <EuiFormHelpText>
            <TrafficFiltersCreationLink regionId={regionId} />
          </EuiFormHelpText>
        )}

        <EuiSpacer size='m' />
      </Fragment>
    )
  }

  renderRuleset() {
    const { ruleset } = this.state

    if (!ruleset) {
      return null
    }

    return (
      <Fragment>
        <EuiFormLabel>
          <FormattedMessage
            id='apply-deployment-filter-flyout.description'
            defaultMessage='Description'
          />
        </EuiFormLabel>

        <EuiText size='s' color='subdued'>
          {ruleset.description}
        </EuiText>

        <EuiSpacer size='m' />

        <EuiFormLabel>
          <FormattedMessage id='apply-deployment-filter-flyout.rules' defaultMessage='Rules' />
        </EuiFormLabel>

        <EuiText size='s' color='subdued'>
          {ruleset.rules.map((rule) => (
            <TrafficFilterRulesetRuleSource key={rule.id} rule={rule} rulesetType={ruleset.type} />
          ))}
        </EuiText>
      </Fragment>
    )
  }

  getRulesetOptions = () => {
    const { deploymentId, trafficFilterRulesets } = this.props

    if (!trafficFilterRulesets) {
      return []
    }

    const remainingRulesets = trafficFilterRulesets.filter(
      (ruleset) => !ruleset.associations || !ruleset.associations.some(matchesThisDeployment),
    )

    if (remainingRulesets.length === 0) {
      return [] // sanity
    }

    const options = [
      { value: ``, text: `` },
      ...remainingRulesets.map((ruleset) => ({ value: ruleset.id, text: ruleset.name })),
    ]

    return options

    function matchesThisDeployment(association: FilterAssociation): boolean {
      return association.entity_type === `deployment` && association.id === deploymentId
    }
  }

  saveChanges = () => {
    const { createRulesetAssociation, onClose } = this.props
    const { ruleset } = this.state

    if (!ruleset) {
      return
    }

    createRulesetAssociation(ruleset.id).then(() => {
      this.addSaveSuccessToast(ruleset)
      onClose()
    })
  }

  addSaveSuccessToast = (ruleset: TrafficFilterRulesetInfo) => {
    const {
      intl: { formatMessage },
    } = this.props

    addToast({
      family: `apply-traffic-filter-association-flyout`,
      id: `apply-traffic-filter-association-flyout.save-association-success`,
      color: `success`,
      title: (
        <strong>
          {formatMessage(messages.saveAssociationSuccessTitle, {
            ruleType: this.getRuleTypeTitle(ruleset),
          })}
        </strong>
      ),
      text: formatMessage(messages.saveAssociationSuccessText, {
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
}

export default injectIntl(ApplyDeploymentTrafficFilterFlyout)
