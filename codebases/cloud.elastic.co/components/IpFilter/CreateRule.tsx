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

import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
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
import { checkIp } from '../../lib/ip'

type ruleValues =
  | {
      source: string
    }
  | {
      description: string
    }
type Props = {
  currentRule?: IpFilterRule
  isEditing: boolean
  onChange: (value: ruleValues) => void
  saveRuleModal: (currentRule: ruleValues, ruleset?: IpFilterRuleset) => void
  closeModal: () => void
}
type State = {
  invalidIp: boolean
}

class CreateRule extends Component<Props, State> {
  state: State = {
    invalidIp: false,
  }

  render() {
    const { closeModal, currentRule, isEditing } = this.props
    const { invalidIp } = this.state
    const titleButton = isEditing ? (
      <FormattedMessage id='ipfilter-editor-rule.title-update' defaultMessage='Update rule' />
    ) : (
      <FormattedMessage id='ipfilter-editor-rule.title-new' defaultMessage='Create rule' />
    )

    return (
      <EuiPortal>
        <EuiFlyout onClose={closeModal} ownFocus={true}>
          <EuiFlyoutHeader>
            <EuiTitle>
              <h2>{titleButton}</h2>
            </EuiTitle>
          </EuiFlyoutHeader>

          <EuiFlyoutBody data-test-id='ip-filter-rules.create-rule-flyout'>
            <EuiForm>
              <EuiFormRow
                helpText={
                  <FormattedMessage
                    id='ipfilter-editor-rule.helptext'
                    defaultMessage='Provide a valid IPv4 address or CIDR to whitelist'
                  />
                }
                error={
                  <FormattedMessage
                    id='ipfilter-editor-rule.error'
                    defaultMessage='Provide a valid Source'
                  />
                }
                isInvalid={invalidIp}
                label={
                  <FormattedMessage id='ipfilter-editor-rule.ip-addess' defaultMessage='Source' />
                }
              >
                <EuiFieldText
                  placeholder='e.g. 172.16.254.1'
                  data-test-id='rule-ip'
                  isInvalid={invalidIp}
                  value={currentRule && currentRule.source ? currentRule.source : ''}
                  onChange={(e) => this.onChange({ source: e.target.value })}
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
                  value={
                    currentRule && currentRule.description ? currentRule.description : undefined
                  }
                  onChange={(e) => this.onChange({ description: e.target.value })}
                />
              </EuiFormRow>
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
                <EuiButton data-test-id='create-rule-button' onClick={this.onSave} fill={true}>
                  {titleButton}
                </EuiButton>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlyoutFooter>
        </EuiFlyout>
      </EuiPortal>
    )
  }

  onChange(payload: ruleValues) {
    const { onChange } = this.props
    onChange(payload)
  }

  onSave = () => {
    const { saveRuleModal, currentRule } = this.props
    const isValid = currentRule && checkIp(currentRule.source)
    this.setState({ invalidIp: !isValid })

    if (isValid) {
      saveRuleModal(currentRule!)
    }
  }
}

export default CreateRule
