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

import { EuiTitle, EuiSpacer, EuiText } from '@elastic/eui'

import './createStackDeploymentTitle.scss'

type Props = {
  showTrialExperience: boolean
  page: string
}

class CreateStackDeploymentTitle extends Component<Props> {
  render() {
    const { showTrialExperience, page } = this.props

    return (
      <Fragment>
        {showTrialExperience && (
          <Fragment>
            <EuiText className='create-trial-deployment' size='s'>
              <FormattedMessage
                data-test-id='trial-welcome'
                defaultMessage='Welcome to Elastic!'
                id='create-deployment.trial.welcome'
              />
            </EuiText>

            <EuiSpacer size='s' />
          </Fragment>
        )}
        <EuiTitle size='l' data-test-id='deployment-title'>
          <h1 data-test-id='cloud-page-title'>{this.renderTitle()}</h1>
        </EuiTitle>
        <EuiSpacer size='s' />
        {page !== `configureDeployment` && (
          <EuiText size='s' color='subdued'>
            <FormattedMessage
              data-test-id='create-sub-header'
              id='stack-deployment-editor-dependencies.welcome-to-trial.sub-header'
              defaultMessage='A deployment includes Elasticsearch, Kibana, and other Elastic Stack features, allowing you to store, search, and analyze your data.'
            />
          </EuiText>
        )}
      </Fragment>
    )
  }

  renderTitle() {
    const { showTrialExperience, page } = this.props

    if (showTrialExperience) {
      return (
        <span data-test-id='stack-deployment-editor-dependencies.welcome-to-trial'>
          <FormattedMessage
            data-test-id='trial-create-title'
            id='stack-deployment-editor-dependencies.welcome-to-trial'
            defaultMessage='Create your first deployment'
          />
        </span>
      )
    }

    if (page === `configureDeployment`) {
      return (
        <FormattedMessage
          data-test-id='advanced-settings-title'
          id='stack-deployment-editor-dependencies.create-deployment.advanced'
          defaultMessage='Advanced settings'
        />
      )
    }

    return (
      <FormattedMessage
        data-test-id='paying-create-title'
        id='stack-deployment-editor-dependencies.create-deployment'
        defaultMessage='Create a deployment'
      />
    )
  }
}

export default CreateStackDeploymentTitle
