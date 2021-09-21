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
import { FormattedMessage } from 'react-intl'
import { difference, get, isEmpty } from 'lodash'

import {
  EuiButton,
  EuiButtonEmpty,
  EuiComboBox,
  EuiDescribedFormGroup,
  EuiComboBoxOptionOption,
  EuiFlexGroup,
  EuiFlexItem,
  EuiText,
  EuiTextColor,
  EuiSpacer,
} from '@elastic/eui'

import { addToast, CuiPermissibleControl } from '../../../cui'

import RulesetsTable from '../../IpFilter/RulesetsTable'
import RulesTable from '../../IpFilter/RulesTable'
import EmptyTable from '../../IpFilter/EmptyTable'

import Permission from '../../../lib/api/v1/permissions'

import { AsyncRequestState } from '../../../types'
import { IpFilterRuleset } from '../../../lib/api/v1/types'

import './deploymentIpFilterRulesets.scss'

export type Props = {
  deploymentRulesets: IpFilterRuleset[]
  allRulesets: IpFilterRuleset[]
  regionId: string
  deploymentId: string
  createIpFilterRulesetAssociationRequest: () => AsyncRequestState
  deleteIpFilterRulesetAssociationRequest: () => AsyncRequestState
  createRulesetAssociation: (args: {
    rulesetId: string
    regionId: string
    associatedEntityId: string
  }) => Promise<void>
  deleteRulesetAssociation: (args: {
    rulesetId: string
    regionId: string
    associatedEntityId: string
  }) => Promise<void>
  fetchDeploymentRulesetAssociation: (args: {
    associatedEntityId: string
    regionId: string
  }) => Promise<void>
  getRuleset: (rulesetId: string) => IpFilterRuleset | undefined
}

type State = {
  selectedRules?: Array<EuiComboBoxOptionOption<IpFilterRuleset>>
  openedCombo: boolean
}

const toastText = {
  rulesetAssociationCreationFailure: {
    family: 'ipFilter',
    title: (
      <FormattedMessage
        id='ip-filter-rules-set.ruleset-association-fail'
        defaultMessage='Rule set association creation failed!'
      />
    ),
    color: 'danger',
  },
  rulesetAssociationDeletionFailure: {
    family: 'ipFilter',
    title: (
      <FormattedMessage
        id='ip-filter-rules-set.ruleset-association-delete-fail'
        defaultMessage='Rule set association deletion failed!'
      />
    ),
    color: 'danger',
  },
}

class DeploymentIpFilterRulesets extends Component<Props, State> {
  state: State = {
    openedCombo: false,
    selectedRules: [],
  }

  componentDidMount() {
    const { deploymentId, fetchDeploymentRulesetAssociation, regionId } = this.props
    fetchDeploymentRulesetAssociation({ associatedEntityId: deploymentId, regionId })
  }

  render() {
    return (
      <EuiDescribedFormGroup
        fullWidth={true}
        title={
          <h3>
            <FormattedMessage id='ip-filter-rules-set.title' defaultMessage='Traffic management' />
          </h3>
        }
        description={
          <FormattedMessage
            id='ip-filter-rules-set.title-description'
            defaultMessage='Apply one or more rule sets to allow traffic from the IP addresses to your deployment, blocking all other traffic. Until you apply a rule set, all traffic is allowed.'
          />
        }
      >
        <div data-test-id='ipfilter-ruleset-container' className='ipFilter-ruleset-container'>
          {this.renderMessages()}
          {this.renderRulesetsTable()}
          {this.renderCombo()}
        </div>
      </EuiDescribedFormGroup>
    )
  }

  renderMessages() {
    const { deploymentRulesets } = this.props

    if (deploymentRulesets.length === 0) {
      return (
        <Fragment>
          <FormattedMessage
            id='ip-filter-deployment.rules-set-zero'
            data-test-id='ip-filter-rules-set.rules-set-zero'
            defaultMessage='0 Rule sets currently set up. All traffic is being allowed.'
          />

          <EuiSpacer size='m' />

          {this.renderRulesetButton()}
        </Fragment>
      )
    }

    return (
      <FormattedMessage
        id='ip-filter-deployment.rules-set'
        defaultMessage='Applied rule set count: { rulesetNumber }'
        values={{
          rulesetNumber: deploymentRulesets.length,
        }}
      />
    )
  }

  renderRulesetsTable() {
    const { deploymentRulesets } = this.props

    if (deploymentRulesets.length === 0) {
      return null
    }

    return (
      <Fragment>
        <RulesetsTable
          deploymentTable={true}
          renderDetailRow={this.renderDetailRow}
          deleteAssociation={this.deleteAssociation}
          rulesets={deploymentRulesets}
          noItemsMessage={this.renderNoItemsMessage}
        />
        {this.renderRulesetButton()}
      </Fragment>
    )
  }

  renderNoItemsMessage = () => (
    <EmptyTable
      message={
        <FormattedMessage
          id='ip-filter-deployment.no-ruleset-text'
          defaultMessage="Looks like you don't have any rule sets. Let's apply some!"
        />
      }
      actions={
        <FormattedMessage
          id='ip-filter-deployment.no-ruleset-action'
          defaultMessage='Apply rule set'
        />
      }
      onAction={() => this.setState({ openedCombo: true })}
    />
  )

  renderDetailRow = (ruleset) => {
    const { getRuleset } = this.props

    return (
      <RulesTable
        editable={false}
        showCreateButton={false}
        showDescription={false}
        currentRuleset={getRuleset(ruleset.id)}
      />
    )
  }

  renderRulesetButton() {
    if (this.state.openedCombo) {
      return null
    }

    return (
      <div>
        <CuiPermissibleControl permissions={Permission.createIpFilterRuleset}>
          <EuiButton
            size='s'
            className='ip-filter-add-rule-set'
            onClick={() => this.setState({ openedCombo: true })}
          >
            <FormattedMessage
              id='ip-filter-deployment.apply-rules-set'
              defaultMessage='Apply rule set'
            />
          </EuiButton>
        </CuiPermissibleControl>
      </div>
    )
  }

  renderCombo() {
    const { selectedRules, openedCombo } = this.state

    if (!openedCombo) {
      return null
    }

    const rulesetOptions = this.parseRulesets()

    return (
      <EuiFlexGroup className='ip-filter-combo-group'>
        <EuiFlexItem grow={3}>
          <EuiComboBox<IpFilterRuleset>
            singleSelection={{ asPlainText: true }}
            onChange={(selectedRules) => {
              this.setState({ selectedRules })
            }}
            renderOption={this.renderRulesetOption}
            selectedOptions={selectedRules}
            options={rulesetOptions}
          />
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiButton onClick={this.applyRulesets}>
            <FormattedMessage
              id='ip-filter-deployment.apply'
              description='Apply'
              defaultMessage='Apply'
            />
          </EuiButton>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiButtonEmpty onClick={() => this.setState({ openedCombo: false })}>
            <FormattedMessage
              id='ip-filter-deployment.cancel'
              description='Cancel'
              defaultMessage='Cancel'
            />
          </EuiButtonEmpty>
        </EuiFlexItem>
      </EuiFlexGroup>
    )
  }

  renderRulesetOption = (ruleset: EuiComboBoxOptionOption<IpFilterRuleset>) => {
    const shortId = ruleset.id ? ruleset.id.slice(0, 6) : ''
    return (
      <EuiText size='s'>
        {ruleset.name}
        <EuiTextColor color='subdued'>({shortId})</EuiTextColor>
      </EuiText>
    )
  }

  parseRulesets() {
    const { allRulesets, deploymentRulesets } = this.props

    if (isEmpty(allRulesets)) {
      return []
    }

    return difference(allRulesets, deploymentRulesets).map((ruleset: IpFilterRuleset) => {
      const { name, id } = ruleset

      const shortId = id ? id.slice(0, 6) : ''
      const label = `${name} (${shortId})`

      return {
        ...ruleset,
        label,
      }
    })
  }

  applyRulesets = () => {
    const {
      createRulesetAssociation,
      deploymentId,
      createIpFilterRulesetAssociationRequest,
      regionId,
    } = this.props
    const { selectedRules } = this.state

    if (!selectedRules) {
      return
    }

    const [selected] = selectedRules

    if (selected && selected.id) {
      return createRulesetAssociation({
        rulesetId: selected.id,
        regionId,
        associatedEntityId: deploymentId,
      })
        .then(() => this.setState({ selectedRules: [] }))
        .catch(() => {
          const request = createIpFilterRulesetAssociationRequest()
          const error = get(request, [`error`, `body`, `errors`, `0`, `message`])
          addToast({
            ...toastText.rulesetAssociationCreationFailure,
            text: error,
          })
        })
    }
  }

  deleteAssociation = ({ id }: IpFilterRuleset) => {
    const {
      deleteRulesetAssociation,
      deleteIpFilterRulesetAssociationRequest,
      deploymentId,
      regionId,
    } = this.props

    if (id) {
      deleteRulesetAssociation({ rulesetId: id, regionId, associatedEntityId: deploymentId }).catch(
        () => {
          const request = deleteIpFilterRulesetAssociationRequest()
          const error = get(request, [`error`, `body`, `errors`, `0`, `message`])
          addToast({
            ...toastText.rulesetAssociationDeletionFailure,
            text: error,
          })
        },
      )
    }
  }
}

export default DeploymentIpFilterRulesets
