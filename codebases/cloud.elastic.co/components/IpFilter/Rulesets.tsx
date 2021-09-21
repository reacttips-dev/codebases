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

import React, { Component, ReactNode } from 'react'
import { get, isEmpty } from 'lodash'
import { defineMessages, FormattedMessage, IntlShape, injectIntl } from 'react-intl'
import {
  EuiButton,
  EuiConfirmModal,
  EuiDescribedFormGroup,
  EuiFlexGroup,
  EuiFlexItem,
  EuiGlobalToastList,
  EuiLoadingSpinner,
  EuiOverlayMask,
  EuiSpacer,
  EuiTitle,
} from '@elastic/eui'

import RulesetsTable from './RulesetsTable'
import CreateRuleset from './CreateRuleset'
import RulesTable from './RulesTable'
import EmptyTable from './EmptyTable'
import './IpFilter.scss'

import { IpFilterRule, IpFilterRuleset } from '../../lib/api/v1/types'
import { AsyncRequestState } from '../../types'

type ToastColor = 'primary' | 'success' | 'warning' | 'danger'

type Props = {
  intl: IntlShape
  getRulesetsRequest: AsyncRequestState
  deleteRuleRequest: () => AsyncRequestState
  deleteRulesetRequest: () => AsyncRequestState
  rulesets: IpFilterRuleset[]
  regionId: string
  fetchIpFilterRulesets: (args: { regionId: string }) => Promise<void>
  updateIpFilterRuleset: (args: {
    rulesetId: string
    regionId: string
    payload: unknown
  }) => Promise<void>
  createIpFilterRuleset: (args: { regionId: string; payload: IpFilterRuleset }) => Promise<void>
  deleteIpFilterRuleset: (args: {
    rulesetId: string
    regionId: string
    ignoreAssociations?: boolean
  }) => Promise<void>
  fetchRulesetDeploymentAssociation: (args: {
    rulesetId: string
    regionId: string
  }) => Promise<void>
  updateIpFilterRule: (args: {
    regionId: string
    rule: IpFilterRule
    ruleset: IpFilterRuleset
  }) => Promise<void>
  createIpFilterRule: (args: {
    regionId: string
    rule: IpFilterRule
    ruleset: IpFilterRuleset
  }) => Promise<void>
  deleteIpFilterRule: (args: {
    regionId: string
    ruleId: string
    ruleset: IpFilterRuleset
  }) => Promise<void>
  getRuleset: (ruleId: string) => IpFilterRuleset
}

type Toast = {
  id: string
  title: ReactNode
  text?: string
  color: ToastColor
}

type State = {
  createModalIsOpen: boolean
  editModalIsOpen: boolean
  deleteRulesetModal?: string
  currentRuleset?: IpFilterRuleset
  currentRule: unknown | undefined
  toasts: Toast[]
}
const toastText = {
  ruleCreationSuccess: {
    id: 'ruleCreationSuccess',
    title: (
      <FormattedMessage
        id='ip-filter-rules-set.rules-create-success'
        data-test-id='ip-filter-rules-set.rules-create-success'
        defaultMessage='Rule created successfully!'
      />
    ),
    color: 'success',
  },
  rulesetCreationSuccess: {
    id: 'rulesetCreationSuccess',
    title: (
      <FormattedMessage
        id='ip-filter-rules-set.ruleset-create-success'
        data-test-id='ip-filter-rules-set.ruleset-create-success'
        defaultMessage='Rule set created successfully!'
      />
    ),
    color: 'success',
  },
  ruleUpdateSuccess: {
    id: 'ruleUpdateSuccess',
    title: (
      <FormattedMessage
        id='ip-filter-rules-set.rules-update-success'
        data-test-id='ip-filter-rules-set.rules-update-success'
        defaultMessage='Rule successfully updated!'
      />
    ),
    color: 'success',
  },
  rulesetUpdateSuccess: {
    id: 'rulesetUpdateSuccess',
    title: (
      <FormattedMessage
        id='ip-filter-rules-set.ruleset-update-success'
        data-test-id='ip-filter-rules-set.ruleset-update-success'
        defaultMessage='Rule set successfully updated!'
      />
    ),
    color: 'success',
  },
  rulesetDeleteFailure: {
    id: 'rulesetCreationFailure',
    title: (
      <FormattedMessage
        id='ip-filter-rules-set.ruleset-delete-failure'
        data-test-id='ip-filter-rules-set.ruleset-delete-failure'
        defaultMessage='Rule set delete failed!'
      />
    ),
    color: 'danger',
  },
  ruleDeleteFailure: {
    id: 'rulesetCreationFailure',
    title: (
      <FormattedMessage
        id='ip-filter-rules-set.rule-delete-failure'
        data-test-id='ip-filter-rules-set.ruleset-delete-failure'
        defaultMessage='Rule delete failed!'
      />
    ),
    color: 'danger',
  },
}

const messages = defineMessages({
  cancel: {
    id: `ip-filter-rulesets.cancel`,
    defaultMessage: `Cancel`,
  },
  deleteRule: {
    id: `ip-filter-rulesets.delete-rule`,
    defaultMessage: `Delete rule set`,
  },
})

class Rulesets extends Component<Props, State> {
  state: State = {
    createModalIsOpen: false,
    editModalIsOpen: false,
    currentRuleset: undefined,
    deleteRulesetModal: undefined,
    currentRule: undefined,
    toasts: [],
  }

  componentDidMount() {
    const { fetchIpFilterRulesets, regionId } = this.props
    fetchIpFilterRulesets({ regionId })
  }

  render() {
    const { rulesets } = this.props
    const describedFormTitle = (
      <EuiTitle>
        <h2>
          <FormattedMessage id='ip-filter-rules-set.title' defaultMessage='Traffic management' />
        </h2>
      </EuiTitle>
    )
    const describedFormDesc = (
      <FormattedMessage
        id='ip-filter-rules-set.form-description'
        defaultMessage='Create rules and rule sets to apply to your deployments. Only traffic matching the IP addresses is allowed through, blocking all other traffic. Until you apply a rule set, all traffic is allowed.'
      />
    )

    return (
      <div className='ipFilter-ruleset-container'>
        <EuiFlexItem>
          <EuiDescribedFormGroup title={describedFormTitle} description={describedFormDesc}>
            <EuiFlexGroup gutterSize='xl'>
              <EuiFlexItem grow={false} className='ipFilter-rules-number'>
                <EuiSpacer size='l' />
                {rulesets.length > 0 && (
                  <EuiButton className='ip-filter-add-rule-set' onClick={this.openRulesetModal}>
                    <FormattedMessage
                      id='ip-filter-rules-set.add-rules-set'
                      defaultMessage='Create rule set'
                    />
                  </EuiButton>
                )}
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiDescribedFormGroup>
        </EuiFlexItem>
        <EuiSpacer size='m' />
        <EuiFlexGroup gutterSize='m' direction='column' className='ipFilter-ruleset'>
          <EuiFlexItem>{this.renderRulesetsTable()}</EuiFlexItem>
        </EuiFlexGroup>

        {this.renderDialogs()}
        {this.renderToast()}
      </div>
    )
  }

  renderRulesetsTable() {
    const { rulesets, getRulesetsRequest } = this.props

    if (!getRulesetsRequest.isDone) {
      return <EuiLoadingSpinner size='m' />
    }

    return (
      <RulesetsTable
        deploymentTable={false}
        openEditRuleset={this.openEditRuleset}
        openDeleteModal={this.openDeleteModal}
        renderDetailRow={this.renderDetailRow}
        noItemsMessage={this.renderNoItemsMessage}
        rulesets={rulesets}
      />
    )
  }

  renderNoItemsMessage = () => (
    <EmptyTable
      onAction={this.openRulesetModal}
      actions={
        <FormattedMessage id='ip-filter-rules-set.add-rules-set' defaultMessage='Create rule set' />
      }
      message={
        <FormattedMessage
          id='ip-filter-rules-set.no-ruleset-test'
          defaultMessage="Looks like you don't have any rule sets. Let's create some!"
        />
      }
    />
  )

  renderDetailRow = (ruleset) => {
    const { getRuleset } = this.props
    return (
      <RulesTable
        editable={true}
        showCreateButton={false}
        showDescription={true}
        saveRuleModal={this.saveRuleModal}
        editRuleModal={this.editRuleModal}
        deleteRule={this.deleteRule}
        currentRuleset={getRuleset(ruleset.id)}
      />
    )
  }

  renderDialogs() {
    const {
      intl: { formatMessage },
      getRuleset,
    } = this.props

    const { createModalIsOpen, deleteRulesetModal, editModalIsOpen, currentRuleset } = this.state

    if (createModalIsOpen) {
      return (
        <CreateRuleset
          isEditing={false}
          onChange={this.updateCurrentRuleset}
          ruleset={currentRuleset}
          onSave={this.onSaveCreateRuleset}
          closeModal={this.closeRulesetModal}
          regionId={this.props.regionId}
        />
      )
    }

    if (editModalIsOpen) {
      return (
        <CreateRuleset
          isEditing={true}
          onChange={this.updateCurrentRuleset}
          ruleset={currentRuleset}
          onSave={this.onSaveEditRuleset}
          closeModal={this.closeEditRuleset}
          regionId={this.props.regionId}
        />
      )
    }

    if (deleteRulesetModal) {
      const ruleset = getRuleset(deleteRulesetModal)

      if (ruleset.total_associations && ruleset.total_associations > 0) {
        return (
          <EuiOverlayMask>
            <EuiConfirmModal
              buttonColor='danger'
              title={
                <FormattedMessage
                  id='ip-filter-rules-set.delete-rules-set-title'
                  defaultMessage='Delete rule set?'
                />
              }
              onCancel={() => this.closeDeleteModal()}
              onConfirm={() => this.deleteRuleset(true)}
              cancelButtonText={formatMessage(messages.cancel)}
              confirmButtonText={formatMessage(messages.deleteRule)}
            >
              <FormattedMessage
                id='ip-filter-rules-set.dont-delete-rules-set'
                defaultMessage='This rule set is associate with { deployment, number } { deployment, plural, one {deployment} other {deployments}}.'
                values={{
                  deployment: ruleset.total_associations,
                }}
              />
              <EuiSpacer size='xs' />
              <FormattedMessage
                id='ip-filter-rules-set.delete-rules-set-description'
                defaultMessage='Deleting this rule set will remove it from all associated deployments.'
              />
              <EuiSpacer size='m' />
              <FormattedMessage
                id='ip-filter-rules-set.delete-rules-set'
                defaultMessage='Delete the rule set?'
              />
            </EuiConfirmModal>
          </EuiOverlayMask>
        )
      }

      return (
        <EuiOverlayMask>
          <EuiConfirmModal
            title={
              <FormattedMessage
                id='ip-filter-rules-set.delete-rules-set-title'
                defaultMessage='Delete rule set?'
              />
            }
            onCancel={() => this.closeDeleteModal()}
            onConfirm={() => this.deleteRuleset(false)}
            cancelButtonText={formatMessage(messages.cancel)}
            confirmButtonText={formatMessage(messages.deleteRule)}
          >
            <FormattedMessage
              id='ip-filter-rules-set.delete-rules-set'
              defaultMessage='Delete the rule set?'
            />
          </EuiConfirmModal>
        </EuiOverlayMask>
      )
    }
  }

  renderToast() {
    return (
      <EuiGlobalToastList
        toasts={this.state.toasts}
        dismissToast={this.removeToast}
        toastLifeTimeMs={3000}
      />
    )
  }

  removeToast = (removedToast) => {
    this.setState((prevState) => ({
      toasts: prevState.toasts.filter((toast) => toast.id !== removedToast.id),
    }))
  }

  addToast(toast) {
    const { toasts } = this.state
    this.setState({
      toasts: [...toasts, toast],
    })
  }

  openRulesetModal = () =>
    this.setState({
      currentRuleset: undefined,
      createModalIsOpen: true,
    })

  closeRulesetModal = () => this.setState({ createModalIsOpen: false })

  onSaveCreateRuleset = (ruleset: IpFilterRuleset) => {
    const { createIpFilterRuleset, regionId } = this.props

    const payload = {
      ...ruleset,
    }

    return createIpFilterRuleset({ regionId, payload }).then(() => {
      this.addToast(toastText.rulesetCreationSuccess)
      return this.closeRulesetModal()
    })
  }

  saveRuleModal = (rule: IpFilterRule, ruleset: IpFilterRuleset) => {
    const { createIpFilterRule, regionId } = this.props

    if (!isEmpty(ruleset)) {
      return createIpFilterRule({ regionId, rule, ruleset }).then(() =>
        this.addToast(toastText.ruleCreationSuccess),
      )
    }
  }

  editRuleModal = (rule: IpFilterRule, ruleset: IpFilterRuleset) => {
    const { updateIpFilterRule, regionId } = this.props

    return updateIpFilterRule({ regionId, rule, ruleset }).then(() => {
      this.addToast(toastText.ruleUpdateSuccess)
      return this.closeRulesetModal()
    })
  }

  openEditRuleset = (currentRuleset: IpFilterRuleset) => {
    this.setState({
      editModalIsOpen: true,
      currentRuleset,
    })
  }

  updateCurrentRuleset = (value: IpFilterRuleset) => {
    const { currentRuleset } = this.state

    if (value !== undefined) {
      this.setState({
        currentRuleset: {
          ...currentRuleset,
          ...value,
        },
      })
    }
  }

  closeEditRuleset = () => {
    this.setState({
      editModalIsOpen: false,
      currentRuleset: undefined,
    })
  }

  onSaveEditRuleset = (payload: IpFilterRuleset) => {
    const { updateIpFilterRuleset, regionId } = this.props

    if (!payload.id) {
      return
    }

    return updateIpFilterRuleset({ rulesetId: payload.id, regionId, payload }).then(() => {
      this.addToast(toastText.rulesetUpdateSuccess)
      return this.setState({
        editModalIsOpen: false,
        currentRuleset: undefined,
      })
    })
  }

  closeDeleteModal = () => this.setState({ deleteRulesetModal: undefined })

  openDeleteModal = (id: string) => this.setState({ deleteRulesetModal: id })

  deleteRuleset = (ignoreAssociations?: boolean) => {
    const { deleteIpFilterRuleset, regionId, deleteRulesetRequest } = this.props
    const { deleteRulesetModal: rulesetId = '' } = this.state
    deleteIpFilterRuleset({ rulesetId, regionId, ignoreAssociations })
      .then(() => {
        this.addToast(toastText.rulesetUpdateSuccess)
        return
      })
      .catch(() => {
        const request = deleteRulesetRequest()
        const error = get(request, [`error`, `body`, `errors`, `0`, `message`])
        this.addToast({
          ...toastText.rulesetDeleteFailure,
          text: error,
        })
      })
    this.closeDeleteModal()
  }

  deleteRule = (id: string, currentRuleset: IpFilterRuleset) => {
    const { deleteIpFilterRule, regionId, deleteRuleRequest } = this.props
    deleteIpFilterRule({ regionId, ruleId: id, ruleset: currentRuleset })
      .then(() => {
        this.addToast(toastText.ruleUpdateSuccess)
        return
      })
      .catch(() => {
        const request = deleteRuleRequest()
        const error = get(request, [`error`, `body`, `errors`, `0`, `message`])
        this.addToast({
          ...toastText.ruleDeleteFailure,
          text: error,
        })
      })
  }
}

export default injectIntl(Rulesets)
