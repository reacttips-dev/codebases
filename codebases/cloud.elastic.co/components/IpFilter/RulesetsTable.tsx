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

import { compact } from 'lodash'
import React, { Component, ReactNode, Fragment } from 'react'
import { defineMessages, WrappedComponentProps, injectIntl, IntlShape } from 'react-intl'

import { EuiFlexItem, EuiFlexGroup, EuiButtonIcon, EuiSpacer, EuiText } from '@elastic/eui'

import { CuiTable } from '../../cui'

import { IpFilterRuleset } from '../../lib/api/v1/types'

interface Props {
  rulesets: IpFilterRuleset[]
  deleteAssociation?: (item: IpFilterRuleset) => void
  openEditRuleset?: (item: IpFilterRuleset) => void
  openDeleteModal?: (id: string) => void
  renderDetailRow: (item: IpFilterRuleset) => ReactNode
  noItemsMessage: () => ReactNode
  deploymentTable?: boolean
  intl: IntlShape
}

interface State {
  createModalIsOpen: boolean
  editModalIsOpen: boolean
  deleteRulesetModal?: string
  currentRuleset?: IpFilterRuleset
}

const messages = defineMessages({
  actions: {
    id: 'ip-filter-rules-set.actions',
    defaultMessage: 'Actions',
  },
  edit: {
    id: 'ip-filter-rules-set.edit',
    defaultMessage: 'Edit',
  },
  editRuleset: {
    id: 'ip-filter-rules-set.edit-ruleset',
    defaultMessage: 'Edit rule set',
  },
  delete: {
    id: 'ip-filter-rules-set.delete',
    defaultMessage: 'Delete',
  },
  deleteRuleset: {
    id: 'ip-filter-rules-set.delete-rule-set',
    defaultMessage: 'Delete rule set',
  },
  description: {
    id: 'ip-filter-rules-set.description',
    defaultMessage: 'Description',
  },
  rules: {
    id: 'ip-filter-rules-set.rules',
    defaultMessage: 'Rules',
  },
  deployments: {
    id: 'ip-filter-rules-set.deployments',
    defaultMessage: 'Deployments',
  },
  action: {
    id: 'ip-filter-rules-set.action',
    defaultMessage: 'Action',
  },
  deleteAssociation: {
    id: 'ip-filter-rules-set.delete-association',
    defaultMessage: 'Delete association',
  },
  ruleset: {
    id: 'ip-filter-rules-set.rule-set',
    defaultMessage: 'Rule set',
  },
  descriptionNone: {
    id: 'ip-filter-rules-set.description-none',
    defaultMessage: 'No description',
  },
})

class RulesetsTable extends Component<Props & WrappedComponentProps, State> {
  state: State = {
    createModalIsOpen: false,
    editModalIsOpen: false,
    currentRuleset: undefined,
    deleteRulesetModal: undefined,
  }

  render() {
    const {
      renderDetailRow,
      deleteAssociation,
      deploymentTable,
      intl: { formatMessage },
      noItemsMessage,
    } = this.props

    const columns = [
      {
        label: formatMessage(messages.ruleset),
        render: (ruleset) => ruleset.name,
        sortKey: `name`,
      },
      {
        label: formatMessage(messages.description),
        textOnly: true,
        truncateText: true,
        render: ({ description }) => {
          if (description) {
            return <Fragment>{description}</Fragment>
          }

          return (
            <EuiText color='subdued' size='s'>
              {formatMessage(messages.descriptionNone)}
            </EuiText>
          )
        },
      },
      {
        label: formatMessage(messages.rules),
        width: '120px',
        align: 'right' as const,
        render: (ruleset) => ruleset.rulesNumber,
      },
      ...(!deploymentTable
        ? [
            {
              label: formatMessage(messages.deployments),
              align: 'right' as const,
              width: '120px',
              render: (ruleset) => ruleset.total_associations,
            },
          ]
        : []),
      ...(deleteAssociation
        ? [
            {
              label: formatMessage(messages.delete),
              render: (ruleset) => (
                <EuiButtonIcon
                  aria-label={formatMessage(messages.deleteAssociation)}
                  iconType='cross'
                  color='warning'
                  onClick={() => this.deleteAssociation(ruleset)}
                />
              ),
            },
          ]
        : [
            {
              mobile: {
                label: formatMessage(messages.actions),
              },
              width: '120px',
              actions: true,
              render: (ruleset) => (
                <EuiFlexGroup gutterSize='s' alignItems='center' responsive={false}>
                  <EuiFlexItem grow={false}>
                    <EuiButtonIcon
                      aria-label={formatMessage(messages.editRuleset)}
                      iconType='pencil'
                      onClick={() => this.openEditRuleset(ruleset)}
                    />
                  </EuiFlexItem>

                  <EuiFlexItem grow={false}>
                    <EuiButtonIcon
                      iconType='trash'
                      color='danger'
                      aria-label={formatMessage(messages.deleteRuleset)}
                      onClick={() => this.openDeleteModal(ruleset)}
                    />
                  </EuiFlexItem>
                </EuiFlexGroup>
              ),
            },
          ]),
    ]

    return (
      <Fragment>
        <CuiTable
          data-test-id='ip-filter-rules-set.table'
          rows={this.renderRulesets()}
          getRowId={(ruleset) => ruleset.id}
          columns={columns}
          hasDetailRow={true}
          renderDetailRow={renderDetailRow}
          emptyMessage={noItemsMessage()}
        />
        <EuiSpacer size='s' />
      </Fragment>
    )
  }

  renderRulesets() {
    const { rulesets } = this.props
    return compact(rulesets).map((ruleset) => ({
      ...ruleset,
      rulesNumber: ruleset.rules.length,
    }))
  }

  deleteAssociation = (item) => {
    const { deleteAssociation } = this.props

    if (deleteAssociation) {
      return deleteAssociation(item)
    }
  }

  openDeleteModal = (item) => {
    if (this.props.openDeleteModal) {
      return this.props.openDeleteModal(item.id)
    }
  }

  openEditRuleset = (item) => {
    if (this.props.openEditRuleset) {
      return this.props.openEditRuleset(item)
    }
  }
}

export default injectIntl(RulesetsTable)
