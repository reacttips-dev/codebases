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
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl'

import { EuiCheckbox, EuiHorizontalRule, EuiText, EuiTitle } from '@elastic/eui'

import DocLink from '../DocLink'

import {
  getBlankNodeConfigurationPerTemplate,
  isAutoscalingEnabled,
  setAutoscalingEnabled,
  setAutoscalingDisabled,
} from '../../lib/stackDeployments'

import {
  DeploymentCreateRequest,
  DeploymentUpdateRequest,
  DeploymentTemplateInfoV2,
  ElasticsearchClusterPlan,
} from '../../lib/api/v1/types'

interface Props extends WrappedComponentProps {
  deployment: DeploymentCreateRequest | DeploymentUpdateRequest
  deploymentTemplate?: DeploymentTemplateInfoV2
  onChangeAutoscaling: (deployment: DeploymentCreateRequest | DeploymentUpdateRequest) => void
}

class AutoscalingToggle extends Component<Props> {
  render() {
    const { deployment } = this.props
    const autoscalingEnabled = isAutoscalingEnabled({ deployment })

    return (
      <Fragment>
        <EuiCheckbox
          id='autoscaling-enable'
          data-test-id='autoscaling-enable'
          label={
            <Fragment>
              <EuiTitle size='xxs'>
                <h3>
                  <FormattedMessage
                    id='autoscaling-toggle.label'
                    defaultMessage='Autoscale this deployment'
                  />
                </h3>
              </EuiTitle>
              <EuiText color='subdued' size='s'>
                <FormattedMessage
                  id='autoscaling-toggle.description'
                  defaultMessage='Scale the capacity of your data and machine learning nodes automatically. {learnMore}'
                  values={{
                    learnMore: (
                      <DocLink link='autoscalingEnableDocLink'>
                        <FormattedMessage
                          id='autoscaling-toggle.description.learn-more'
                          defaultMessage='Learn more'
                        />
                      </DocLink>
                    ),
                  }}
                />
              </EuiText>
            </Fragment>
          }
          checked={autoscalingEnabled}
          onChange={this.onChange}
        />
        <EuiHorizontalRule />
      </Fragment>
    )
  }

  onChange = () => {
    const { deployment, deploymentTemplate, onChangeAutoscaling } = this.props

    const blankTemplate = getBlankNodeConfigurationPerTemplate({
      sliderInstanceType: 'elasticsearch',
      deploymentTemplate: deploymentTemplate!,
    }) as ElasticsearchClusterPlan

    const autoscalingEnabled = isAutoscalingEnabled({ deployment })
      ? setAutoscalingDisabled({ deployment })
      : setAutoscalingEnabled({
          deployment,
          blankTemplate,
        })

    if (!autoscalingEnabled.resources || !autoscalingEnabled.resources.elasticsearch) {
      return
    }

    onChangeAutoscaling(autoscalingEnabled)
  }
}

export default injectIntl(AutoscalingToggle)
