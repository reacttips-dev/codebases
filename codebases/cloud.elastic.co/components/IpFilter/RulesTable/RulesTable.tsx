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

import {
  EuiButton,
  EuiButtonIcon,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
  EuiText,
  EuiTitle,
} from '@elastic/eui'

import { CuiTable } from '../../../cui'

import CreateRule from '../CreateRule'
import EmptyTable from '../EmptyTable'

import { IpFilterRule, IpFilterRuleset } from '../../../lib/api/v1/types'

type ruleValues =
  | {
      source: string
    }
  | {
      description: string
    }

type Props = {
  intl: IntlShape
  currentRuleset: IpFilterRuleset | undefined
  editable: boolean
  showCreateButton: boolean
  showDescription: boolean
  rules: IpFilterRule[]
  deleteRule?: (id: string, currentRuleset?: IpFilterRuleset) => void
  saveRuleModal?: (rule: IpFilterRule, ruleset?: IpFilterRuleset) => void
  editRuleModal?: (rule: IpFilterRule, ruleset?: IpFilterRuleset) => Promise<any>
}

type State = {
  createModalIsOpen: boolean
  editModalIsOpen: boolean
  deleteRuleModal?: string
  currentRule: IpFilterRule
}

const messages = defineMessages({
  editRule: {
    id: `ip-filter-rules-set.edit-rule`,
    defaultMessage: `Edit rule`,
  },
  deleteRule: {
    id: `ip-filter-rules-set.delete-rule`,
    defaultMessage: `Delete rule`,
  },
})

class RulesTable extends Component<Props, State> {
  state: State = {
    createModalIsOpen: false,
    editModalIsOpen: false,
    deleteRuleModal: undefined,
    currentRule: {
      source: '',
      description: undefined,
      id: '-1',
    },
  }

  render() {
    const {
      intl: { formatMessage },
    } = this.props

    const columns = [
      {
        label: <FormattedMessage id='ip-filter-rules-set.source' defaultMessage='Source' />,
        render: (rule) => rule.source,
        sortKey: `source`,
        width: '180px',
      },
      {
        label: (
          <FormattedMessage id='ip-filter-rules-set.description' defaultMessage='Description' />
        ),
        textOnly: true,
        truncateText: true,
        render: ({ description }) => {
          if (description != null) {
            return <Fragment>{description}</Fragment>
          }

          return (
            <EuiText color='subdued' size='s'>
              <FormattedMessage
                id='ip-filter-rules.description-none'
                defaultMessage='No description'
              />
            </EuiText>
          )
        },
        sortKey: `description`,
      },
      ...(this.props.editable
        ? [
            {
              mobile: {
                label: (
                  <FormattedMessage id='ip-filter-rules-set.actions' defaultMessage='Actions' />
                ),
              },
              actions: true,
              width: '80px',
              render: (rule) => (
                <EuiFlexGroup gutterSize='s' alignItems='center' responsive={false}>
                  <EuiFlexItem grow={false}>
                    <EuiButtonIcon
                      aria-label={formatMessage(messages.editRule)}
                      iconType='pencil'
                      onClick={() => this.openEditModal(rule)}
                    />
                  </EuiFlexItem>

                  <EuiFlexItem grow={false}>
                    <EuiButtonIcon
                      iconType='trash'
                      color='danger'
                      aria-label={formatMessage(messages.deleteRule)}
                      onClick={() => this.deleteRule(rule)}
                    />
                  </EuiFlexItem>
                </EuiFlexGroup>
              ),
            },
          ]
        : []),
    ]

    return (
      <Fragment>
        <EuiFlexGroup alignItems='center' justifyContent='spaceBetween'>
          <EuiFlexItem grow={false}>
            <EuiTitle size='xs'>
              <h3>
                <FormattedMessage id='ip-filter-rules-set.rules' defaultMessage='Rules' />
              </h3>
            </EuiTitle>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>{this.renderRuleButton()}</EuiFlexItem>
        </EuiFlexGroup>
        <EuiSpacer size='m' />
        {this.renderTable(columns)}
        <EuiSpacer size='m' />
        {this.renderCreateModal()}
        {this.renderEditModal()}
      </Fragment>
    )
  }

  renderRuleButton() {
    const { rules, showCreateButton } = this.props

    if (!showCreateButton || rules.length === 0) {
      return null
    }

    return (
      <EuiButton className='ip-filter-add-rule' onClick={this.openCreateModal}>
        <FormattedMessage id='ip-filter-rules-set.add-rules' defaultMessage='Add rule' />
      </EuiButton>
    )
  }

  renderCreateModal() {
    const { currentRule, createModalIsOpen } = this.state

    if (!createModalIsOpen) {
      return null
    }

    return (
      <CreateRule
        isEditing={false}
        onChange={this.updateCurrentRule}
        currentRule={currentRule}
        saveRuleModal={this.onSaveCreateRule}
        closeModal={this.closeCreateModal}
      />
    )
  }

  renderEditModal() {
    const { currentRule, editModalIsOpen } = this.state

    if (!editModalIsOpen) {
      return
    }

    return (
      <CreateRule
        isEditing={true}
        onChange={this.updateCurrentRule}
        currentRule={currentRule}
        saveRuleModal={this.onSaveEditRule}
        closeModal={this.closeEditModal}
      />
    )
  }

  renderTable(columns) {
    const { rules, currentRuleset, showDescription } = this.props

    const description =
      currentRuleset && currentRuleset.total_associations === 0 && showDescription ? (
        <Fragment>
          <EuiSpacer size='m' />

          <EuiTitle size='xs'>
            <h3>
              <FormattedMessage
                id='ip-filter-rules-set.deployment-rules'
                defaultMessage='Deployments'
              />
            </h3>
          </EuiTitle>
          <EuiSpacer size='s' />
          <EuiText size='s' color='subdued'>
            <FormattedMessage
              id='ip-filter-rules-set.deployment-rules-description'
              defaultMessage='This rule set is not associated with any deployments. Go to the deployment that you want and apply the rule set from the Security page.'
            />
          </EuiText>
        </Fragment>
      ) : null

    return (
      <Fragment>
        <CuiTable
          rows={rules}
          getRowId={(rule) => rule.id || '__no_rule_id__'}
          data-test-id='ip-filter-rules.table'
          columns={columns}
          emptyMessage={
            <EmptyTable
              onAction={this.openCreateModal}
              actions={
                <FormattedMessage
                  id='ip-filter-rules-set.create-rule'
                  defaultMessage='Create rule'
                />
              }
              message={
                <FormattedMessage
                  id='ip-filter-rules-set.no-rule-test'
                  defaultMessage="Looks like you don't have any rules. Let's create some!"
                />
              }
            />
          }
        />

        {description}
      </Fragment>
    )
  }

  openCreateModal = () => this.setState({ createModalIsOpen: true })

  closeCreateModal = () =>
    this.setState({
      createModalIsOpen: false,
      currentRule: {
        source: '',
        description: undefined,
      },
    })

  openEditModal = (item: IpFilterRule) => {
    this.setState({
      editModalIsOpen: true,
      currentRule: item,
    })
  }

  closeEditModal = () =>
    this.setState({
      editModalIsOpen: false,
      currentRule: {
        source: '',
        description: undefined,
      },
    })

  deleteRule = (rule: IpFilterRule) => {
    const { deleteRule, currentRuleset } = this.props

    if (deleteRule && rule.id) {
      deleteRule(rule.id, currentRuleset)
    }
  }

  onSaveCreateRule = () => {
    const { saveRuleModal, currentRuleset: ruleset } = this.props
    const { currentRule: rule } = this.state

    if (saveRuleModal) {
      // can save until I have a ruleset, coming from CreateRuleset
      saveRuleModal(rule, ruleset)
    }

    this.closeCreateModal()
  }

  onSaveEditRule = () => {
    const { editRuleModal, currentRuleset: ruleset } = this.props
    const { currentRule: rule } = this.state

    if (editRuleModal) {
      return editRuleModal(rule, ruleset).then(() => this.closeEditModal())
    }

    return Promise.resolve()
  }

  updateCurrentRule = (value: ruleValues) => {
    this.setState({
      currentRule: {
        ...this.state.currentRule,
        ...value,
      },
    })
  }
}

export default injectIntl(RulesTable)
