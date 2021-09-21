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
import { defineMessages, FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl'

import sluggish from 'sluggish'
import {
  EuiComboBox,
  EuiFormLabel,
  EuiFlexItem,
  EuiSpacer,
  EuiText,
  EuiFormControlLayout,
  EuiPopover,
  EuiButtonIcon,
} from '@elastic/eui'

import DocLink from '../../../../../components/DocLink'

import { isIncompatibleVersionForGlobalTemplate } from '../../../../../lib/globalDeploymentTemplates'
import { isTrialEligibleTemplate } from '../../../../../lib/deploymentTemplates/metadata'

import { VersionNumber } from '../../../../../types'
import {
  GlobalDeploymentTemplateInfo,
  DeploymentTemplateInfoV2,
} from '../../../../../lib/api/v1/types'

import './selectHardwareProfile.scss'

export interface Props extends WrappedComponentProps {
  currentTemplate?: DeploymentTemplateInfoV2
  stackTemplates?: GlobalDeploymentTemplateInfo[]
  onChange: (template) => void
  version: VersionNumber
  inTrial: boolean
  isUserconsole: boolean
  disabled?: boolean
}

type State = {
  isPopoverOpen: boolean
}

class SelectHardwareProfile extends Component<Props, State> {
  state = {
    isPopoverOpen: false,
  }

  render() {
    const {
      currentTemplate,
      stackTemplates,
      onChange,
      inTrial,
      version,
      isUserconsole,
      disabled,
      intl: { formatMessage },
    } = this.props

    if (!currentTemplate || !stackTemplates) {
      return null
    }

    const stackTemplateOptions =
      stackTemplates &&
      stackTemplates.map((template) => {
        const templateMissingSelectedVersion = isIncompatibleVersionForGlobalTemplate(
          template,
          version,
        )
        const trialTemplateUnavailable = inTrial && !isTrialEligibleTemplate(template)
        const disabled = templateMissingSelectedVersion || trialTemplateUnavailable

        return {
          ...template,
          label: template.name,
          value: template.template_category_id,
          disabled: Boolean(disabled),
          'data-test-id': `hardwareProfile-${sluggish(template.template_category_id)}`,
        }
      })
    const selectedOptions = stackTemplateOptions.filter(
      (option) => option.value === currentTemplate.template_category_id,
    )
    const messages = defineMessages({
      ess: {
        id: `select-hardware-profile-label`,
        defaultMessage: `Hardware profile`,
      },
      ece: {
        id: `select-template-label`,
        defaultMessage: `Template`,
      },
      popoverText: {
        id: `hardware-profile-template`,
        defaultMessage: `Learn more about hardware profiles.`,
      },
    })
    const label = isUserconsole ? messages.ess : messages.ece

    return (
      <EuiFlexItem>
        <EuiFormControlLayout
          fullWidth={true}
          prepend={
            <EuiFormLabel style={{ width: `180px` }}>
              <FormattedMessage {...label} />
              <EuiPopover
                isOpen={this.state.isPopoverOpen}
                closePopover={() => this.setState({ isPopoverOpen: false })}
                anchorPosition='upCenter'
                button={
                  <EuiButtonIcon
                    aria-label={formatMessage(messages.popoverText)}
                    className='hardwareProfileIcon'
                    onClick={() => this.setState({ isPopoverOpen: !this.state.isPopoverOpen })}
                    iconType='iInCircle'
                    color='text'
                  />
                }
              >
                <EuiText size='s' style={{ width: 300 }}>
                  {isUserconsole ? (
                    <FormattedMessage
                      data-test-id='ess-hardware-profile-tooltip'
                      id='select-hardware-profile.tooltip'
                      defaultMessage='A hardware profile deploys the Elastic Stack on virtual hardware. Each profile has a different blend of storage, RAM, and vCPU. {learnMore}'
                      values={{
                        learnMore: (
                          <DocLink link='templatesDocLink'>
                            <FormattedMessage
                              id='select-hardware-profile.learn-more'
                              defaultMessage='Learn more'
                            />
                          </DocLink>
                        ),
                      }}
                    />
                  ) : (
                    <FormattedMessage
                      data-test-id='ece-template-tooltip'
                      id='select-template.tooltip'
                      defaultMessage='Hardware templates deploy the Elastic Stack on virtual hardware. Each template has a different blend of RAM, storage, and vCPU. You can also customize them to suit your needs. {learnMore}'
                      values={{
                        learnMore: (
                          <DocLink link='templatesDocLink'>
                            <FormattedMessage
                              id='select-template-profile.learn-more'
                              defaultMessage='Learn more'
                            />
                          </DocLink>
                        ),
                      }}
                    />
                  )}
                </EuiText>
              </EuiPopover>
            </EuiFormLabel>
          }
        >
          <EuiComboBox
            isDisabled={disabled}
            fullWidth={true}
            options={stackTemplateOptions!}
            selectedOptions={selectedOptions}
            singleSelection={{ asPlainText: true }}
            isClearable={false}
            rowHeight={75}
            renderOption={(template) => this.renderHardwareProfile(template)}
            onChange={([selectedOption]) => onChange(selectedOption)}
            data-test-id='hardware-profile-combobox'
          />
        </EuiFormControlLayout>
      </EuiFlexItem>
    )
  }

  renderHardwareProfile(template) {
    const { inTrial } = this.props
    const trialTemplateUnavailable = inTrial && template.disabled
    const trialDescription = (
      <FormattedMessage
        id='create-deployment-from-template.hardware-profile.trial'
        defaultMessage='Not available in trial'
      />
    )

    return (
      <div>
        <EuiText data-test-id='hardware-profile-label' size='s'>
          <strong>{template.label}</strong>
        </EuiText>

        <EuiSpacer size='xs' />

        <EuiText
          style={{
            maxHeight: '3rem',
            overflow: 'hidden',
            whiteSpace: 'normal',
            display: 'block',
          }}
          size='s'
          color='subdued'
        >
          {trialTemplateUnavailable ? trialDescription : template.description}
        </EuiText>
      </div>
    )
  }
}

export default injectIntl(SelectHardwareProfile)
