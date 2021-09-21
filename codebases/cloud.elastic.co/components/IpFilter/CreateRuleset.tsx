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
import { filter, findIndex, isEmpty } from 'lodash'

import {
  EuiButton,
  EuiButtonEmpty,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutFooter,
  EuiFlyoutHeader,
  EuiForm,
  EuiFormRow,
  EuiTextArea,
  EuiTitle,
  EuiPortal,
} from '@elastic/eui'

import { IpFilterRule, IpFilterRuleset } from '../../lib/api/v1/types'
import { createIpFilterRulesetUrl, updateIpFilterRulesetUrl } from '../../lib/api/v1/urls'
import RulesTable from './RulesTable/RulesTable'
import ApiRequestExample from '../../components/ApiRequestExample'

interface Props {
  ruleset: IpFilterRuleset | undefined
  isEditing: boolean
  closeModal: () => void
  onSave: (value: IpFilterRuleset) => void
  onChange: (value: { [name: string]: any }) => void
  regionId: string
}

interface State {
  emptyName: boolean
  pendingRules: IpFilterRule[]
}

class CreateRuleset extends Component<Props, State> {
  constructor(props) {
    super(props)

    const { ruleset } = this.props

    let pendingRules: IpFilterRule[] = []

    if (ruleset && !isEmpty(ruleset) && ruleset.rules.length > 0) {
      pendingRules = ruleset.rules
    }

    this.state = {
      emptyName: false,
      pendingRules,
    }
  }

  render() {
    const { closeModal, isEditing } = this.props
    const title = isEditing ? (
      <FormattedMessage
        id='ipfilter-editor-ruleset.title-update'
        defaultMessage='Update rule set'
      />
    ) : (
      <FormattedMessage id='ipfilter-editor-ruleset.title-new' defaultMessage='Create rule set' />
    )

    return (
      <EuiPortal>
        <EuiFlyout data-test-id='create-ruleset-flyout' onClose={closeModal} ownFocus={true}>
          <EuiFlyoutHeader>
            <EuiTitle>
              <h2>{title}</h2>
            </EuiTitle>
          </EuiFlyoutHeader>
          {this.editRuleset()}
        </EuiFlyout>
      </EuiPortal>
    )
  }

  editRuleset() {
    const { ruleset, closeModal, onChange, isEditing, regionId } = this.props
    const { emptyName, pendingRules } = this.state

    const button = isEditing ? (
      <FormattedMessage
        id='ipfilter-editor-ruleset.title-update'
        defaultMessage='Update rule set'
      />
    ) : (
      <FormattedMessage id='ipfilter-editor-ruleset.title-new' defaultMessage='Create rule set' />
    )

    const rulesTable = (
      <RulesTable
        saveRuleModal={this.onSavePendingRule}
        editRuleModal={this.onEditPendingRule}
        deleteRule={this.onDeletePendingRule}
        currentRuleset={ruleset}
        showCreateButton={true}
        showDescription={false}
        rules={pendingRules}
        editable={true}
      />
    )

    const ruleSetPayloadExample: IpFilterRuleset = {
      name: ruleset?.name || '',
      description: ruleset?.description || '',
      rules: this.state.pendingRules,
    }

    return (
      <Fragment>
        <EuiFlyoutBody>
          <EuiForm>
            <EuiFormRow
              fullWidth={false}
              className='ipFilter-form-name'
              isInvalid={emptyName}
              label={<FormattedMessage id='ipfilter-editor-rule.name' defaultMessage='Name' />}
            >
              <EuiFieldText
                data-test-id='ruleset-name'
                isInvalid={emptyName}
                onChange={(e) => onChange({ name: e.target.value })}
                value={ruleset && ruleset.name ? ruleset.name : ''}
              />
            </EuiFormRow>
            <EuiFormRow
              className='ipFilter-form-description'
              label={
                <FormattedMessage
                  id='ipfilter-editor-rule.description'
                  defaultMessage='Description'
                />
              }
            >
              <EuiTextArea
                fullWidth={true}
                onChange={(e) => onChange({ description: e.target.value })}
                value={ruleset && ruleset.description ? ruleset.description : undefined}
              />
            </EuiFormRow>
            {rulesTable}
          </EuiForm>
        </EuiFlyoutBody>
        <EuiFlyoutFooter>
          <EuiFlexGroup justifyContent='spaceBetween'>
            <EuiFlexItem grow={false}>
              <EuiButtonEmpty onClick={closeModal}>
                <FormattedMessage id='ipfilter-editor-rule.cancel' defaultMessage='Cancel' />
              </EuiButtonEmpty>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <Fragment>
                <EuiButton
                  data-test-id='create-ruleset-button'
                  onClick={this.onSaveButton}
                  fill={true}
                  isLoading={false}
                >
                  {button}
                </EuiButton>

                {isEditing ? (
                  <ApiRequestExample
                    method='PUT'
                    endpoint={updateIpFilterRulesetUrl({
                      rulesetId: ruleset!.id!,
                      regionId,
                    })}
                    body={ruleSetPayloadExample}
                  />
                ) : (
                  <ApiRequestExample
                    method='POST'
                    endpoint={createIpFilterRulesetUrl({ regionId })}
                    body={ruleSetPayloadExample}
                  />
                )}
              </Fragment>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlyoutFooter>
      </Fragment>
    )
  }

  onSavePendingRule = (pendingRule) => {
    const { pendingRules } = this.state
    const newRule = {
      ...pendingRule,
      id: pendingRules.length.toString(), // API want a string
    }
    this.setState({ pendingRules: [...pendingRules, newRule] })
    return Promise.resolve()
  }

  onEditPendingRule = (pendingRule) => {
    const { pendingRules } = this.state
    const index = findIndex(pendingRules, ({ id }) => id === pendingRule.id) // todo improve this
    this.setState({ pendingRules: Object.assign([], pendingRules, { [index]: pendingRule }) })
    return Promise.resolve()
  }

  onSaveButton = () => {
    const { onSave, ruleset } = this.props
    const { pendingRules } = this.state

    if ((ruleset && ruleset.description === '') || !ruleset) {
      return this.setState({ emptyName: true })
    }

    const updatedRuleset: IpFilterRuleset = {
      ...ruleset,
      rules: pendingRules,
    }
    onSave(updatedRuleset)
  }

  onDeletePendingRule = (ruleId) => {
    const { pendingRules } = this.state
    const updatedRules = filter(pendingRules, ({ id }) => id !== ruleId) // todo improve this
    this.setState({ pendingRules: updatedRules })
    return Promise.resolve()
  }
}

export default CreateRuleset
