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

import { EuiSpacer } from '@elastic/eui'

import { CuiAlert } from '../../../../cui'
import DangerButton from '../../../DangerButton'
import prettySize from '../../../../lib/prettySize'
import { getSliderPrettyName } from '../../../../lib/sliders'
import { getHealthyPlanInfoFromHistory, getResourceVersion } from '../../../../lib/stackDeployments'

import {
  getDeploymentSize,
  getDeploymentInstanceCount,
} from '../../../../lib/deployments/conversion'

import {
  AnyResourceInfo,
  AsyncRequestState,
  SliderInstanceType,
  StackDeployment,
} from '../../../../types'
import { InstanceConfiguration } from '../../../../lib/api/v1/types'

type Props = {
  deployment: StackDeployment
  resource: AnyResourceInfo
  sliderInstanceType: SliderInstanceType
  instanceConfigurations: InstanceConfiguration[]
  restart: () => void
  resetRestartRequest: () => void
  fetchInstanceConfigurationsIfNeeded: () => void
  restartRequest: AsyncRequestState
}

class RestartStopped extends Component<Props> {
  componentDidMount() {
    this.props.fetchInstanceConfigurationsIfNeeded()
  }

  componentWillUnmount() {
    this.props.resetRestartRequest()
  }

  render() {
    const { instanceConfigurations, resource, restart, restartRequest, sliderInstanceType } =
      this.props

    const name = (
      <FormattedMessage
        {...getSliderPrettyName({ sliderInstanceType, version: getResourceVersion({ resource }) })}
      />
    )

    const planInfo = getHealthyPlanInfoFromHistory({ resource })

    if (planInfo == null) {
      return (
        <Fragment>
          <CuiAlert type='error'>
            <FormattedMessage
              id='cluster-restart-stopped-cluster.could-not-find-any-previous-configuration-to-use-for-restarting-slider'
              defaultMessage='Could not find any previous configuration to use for restarting {name}.'
              values={{ name }}
            />
          </CuiAlert>
          <EuiSpacer size='m' />
        </Fragment>
      )
    }

    const { plan } = planInfo

    // we know plan exists on planInfo, as it's part of the check within getHealthyPlanInfoFromHistory
    const nodeConfigurations = plan!.cluster_topology ? plan!.cluster_topology : []
    const instanceSize = getDeploymentSize({
      nodeConfigurations,
      instanceConfigurations,
    })
    const instanceCount = getDeploymentInstanceCount({
      // @ts-ignore TODO: Update for other plan types
      plan: plan!,
      instanceConfigurations,
    })

    return (
      <Fragment>
        <DangerButton
          size='s'
          fill={false}
          className='sliderOverview-managementButtonsItem'
          data-test-id='sliderRestart-Btn'
          onConfirm={restart}
          isBusy={restartRequest.inProgress}
          modal={{
            body: (
              <FormattedMessage
                id='slider-restart-stopped.body'
                defaultMessage='This will restart your {name} deployment of {formattedCount} {instanceCount, plural,
                    one {node with}
                    other {nodes with a total of}
                  } {capacity} memory.'
                values={{
                  name,
                  instanceCount,
                  formattedCount: <strong>{instanceCount}</strong>,
                  capacity: <strong>{prettySize(instanceSize)}</strong>,
                }}
              />
            ),
            confirmButtonText: (
              <FormattedMessage id='slider-restart-stopped.confirm' defaultMessage='Restart' />
            ),
            title: (
              <FormattedMessage
                id='slider-restart-stopped.title'
                defaultMessage='Restart your terminated {name} deployment?'
                values={{ name }}
              />
            ),
          }}
        >
          <FormattedMessage
            id='slider-restart-stopped.restart'
            defaultMessage='Restart {name}'
            values={{ name }}
          />
        </DangerButton>

        {restartRequest.error && (
          <Fragment>
            <EuiSpacer size='m' />
            <CuiAlert type='error'>{restartRequest.error}</CuiAlert>
          </Fragment>
        )}

        <EuiSpacer size='m' />
      </Fragment>
    )
  }
}

export default RestartStopped
