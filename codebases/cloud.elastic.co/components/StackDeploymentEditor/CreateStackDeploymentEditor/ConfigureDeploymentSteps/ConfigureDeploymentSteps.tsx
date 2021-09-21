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
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl'

import { EuiCallOut, EuiSpacer, EuiStepProps, EuiSteps } from '@elastic/eui'

import ConfigureDeployment, { Props as ConfigureDeploymentProps } from '../ConfigureDeployment'
import CcsSetupRemoteDeployments, {
  Props as CcsSetupRemoteDeploymentsProps,
} from '../CcsSetupRemoteDeployments'

import { AppSearchDeploymentPageNotice } from '../../../DeprecationNotices/AppsearchNotices'

import { isCrossClusterSearch } from '../../../../lib/deployments/ccs'
import { isSliderInstanceTypeSupportedInTemplate } from '../../../../lib/sliders'

const messages = defineMessages({
  remoteDeployments: {
    id: `create-deployment-configure.remote-deployments`,
    defaultMessage: `Remote deployments`,
  },
  deploymentInfrastructure: {
    id: `create-deployment-configure.deployment-infrastructure`,
    defaultMessage: `Deployment infrastructure`,
  },
})

type OwnProps = {
  firstStepNumber: number
}

type Props = ConfigureDeploymentProps & CcsSetupRemoteDeploymentsProps & OwnProps

class ConfigureDeploymentSteps extends Component<Props> {
  render() {
    return (
      <div>
        <EuiSpacer size='s' />

        {this.renderTrialCallout()}
        {this.renderAppsearchCallout()}
        {this.renderConfigurationSteps()}
      </div>
    )
  }

  renderConfigurationSteps() {
    const {
      intl: { formatMessage },
      firstStepNumber,
      editorState,
    } = this.props

    const { deploymentTemplate } = editorState

    const deploymentTemplateId = deploymentTemplate!.id!
    const steps: EuiStepProps[] = []

    if (isCrossClusterSearch({ deploymentTemplateId, systemOwned: false })) {
      steps.push({
        title: formatMessage(messages.remoteDeployments),
        children: this.renderRemoteDeployments(),
      })
    }

    steps.push({
      title: formatMessage(messages.deploymentInfrastructure),
      children: this.renderDeploymentInfrastructure(),
    })

    return (
      <div>
        {steps.length === 1 ? (
          steps[0].children
        ) : (
          <EuiSteps steps={steps} firstStepNumber={firstStepNumber} headingElement='h2' />
        )}
      </div>
    )
  }

  renderTrialCallout() {
    const { inTrial } = this.props

    if (!inTrial) {
      return null
    }

    return (
      <Fragment>
        <EuiCallOut
          title={
            <FormattedMessage
              id='create-deployment-configure.inTrial.title'
              defaultMessage='Trial user?'
            />
          }
        >
          <FormattedMessage
            id='create-deployment-configure.inTrial.description'
            defaultMessage='The trial includes more than enough to get you started with the Elastic Stack. Larger deployments require a credit card to unlock and are not free.'
          />
        </EuiCallOut>
        <EuiSpacer size='m' />
      </Fragment>
    )
  }

  renderAppsearchCallout() {
    const {
      editorState: { deploymentTemplate },
    } = this.props

    if (!isSliderInstanceTypeSupportedInTemplate(`appsearch`, deploymentTemplate)) {
      return null
    }

    return (
      <Fragment>
        <AppSearchDeploymentPageNotice />
        <EuiSpacer size='m' />
      </Fragment>
    )
  }

  renderRemoteDeployments() {
    const { editorState, onChange } = this.props

    return <CcsSetupRemoteDeployments editorState={editorState} onChange={onChange} />
  }

  renderDeploymentInfrastructure() {
    return <ConfigureDeployment {...this.props} />
  }
}

export default injectIntl(ConfigureDeploymentSteps)
