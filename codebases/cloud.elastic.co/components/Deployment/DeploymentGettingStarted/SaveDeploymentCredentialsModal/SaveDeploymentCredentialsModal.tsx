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

import React, { Fragment, PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import {
  EuiButtonEmpty,
  EuiCode,
  EuiEmptyPrompt,
  EuiModal,
  EuiModalBody,
  EuiOverlayMask,
  EuiPanel,
  EuiSpacer,
  EuiText,
  EuiTitle,
} from '@elastic/eui'
import StackElasticCredentials from '../../../StackElasticCredentials'
import { messages } from '../messages'

import { GettingStartedType, StackDeployment, Theme } from '../../../../types'
import { DeploymentTemplateInfoV2 } from '../../../../lib/api/v1/types'

import saveCredentialsModalHeaderDark from '../../../../files/save-credentials-darkmode.svg'
import saveCredentialsModalHeaderLight from '../../../../files/save-credentials-lightmode.svg'

import './saveDeploymentCredentialsModal.scss'

interface Props {
  deployment: StackDeployment
  deploymentTemplate?: DeploymentTemplateInfoV2
  instanceType?: GettingStartedType
  onDismiss?: () => void
  theme: Theme
}

interface State {
  isOpen: boolean
}

class SaveDeploymentCredentialsModal extends PureComponent<Props, State> {
  state = {
    isOpen: true,
  }

  render() {
    const { theme, deployment, deploymentTemplate } = this.props
    const { isOpen } = this.state

    if (!isOpen) {
      return null
    }

    return (
      <EuiOverlayMask>
        <EuiModal
          data-test-id='save-deployment-credential-modal'
          onClose={this.closeModal}
          className='save-credentials-modal'
          maxWidth={540}
        >
          <EuiModalBody>
            <EuiEmptyPrompt
              className='save-credentials-modal-prompt'
              iconType={
                theme === 'dark' ? saveCredentialsModalHeaderDark : saveCredentialsModalHeaderLight
              }
              title={this.getTitle()}
              body={
                <Fragment>
                  {this.getInstanceInfo()}

                  <EuiPanel hasShadow={false} paddingSize='none'>
                    <StackElasticCredentials
                      onlyShowCredentials={true}
                      deploymentTemplate={deploymentTemplate}
                      deployment={deployment}
                      onDownloadCredentials={this.closeModal}
                    />
                  </EuiPanel>

                  <EuiSpacer size='m' />

                  <EuiButtonEmpty
                    onClick={this.closeModal}
                    data-test-id='continue-without-download'
                  >
                    <EuiText size='s'>
                      <FormattedMessage {...messages.continueWithoutDownloading} />
                    </EuiText>
                  </EuiButtonEmpty>
                </Fragment>
              }
            />
          </EuiModalBody>
        </EuiModal>
      </EuiOverlayMask>
    )
  }

  getTitle() {
    const title = {
      ...messages.saveCredentialsModalTitle,
      values: {
        elastic: <EuiCode>elastic</EuiCode>,
      },
    }
    return (
      <EuiTitle size='s'>
        <h3 className='save-credentials-modal-title' data-test-id='save-credentials-modal-title'>
          <FormattedMessage {...title} />
        </h3>
      </EuiTitle>
    )
  }

  getInstanceInfo() {
    const { instanceType } = this.props

    if (instanceType !== 'kibana') {
      return null
    }

    return (
      <Fragment>
        <EuiText color='subdued' data-test-id='save-credentials-modal-instance-info'>
          <FormattedMessage {...messages.saveCredentialsModalInfo} />
        </EuiText>

        <EuiSpacer size='m' />
      </Fragment>
    )
  }

  closeModal = (): void => {
    this.setState({ isOpen: false }, () => {
      const { onDismiss } = this.props

      if (onDismiss) {
        onDismiss()
      }
    })
  }
}

export default SaveDeploymentCredentialsModal
