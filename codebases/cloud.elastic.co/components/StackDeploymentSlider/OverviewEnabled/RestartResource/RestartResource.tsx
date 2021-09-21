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

import { EuiSpacer } from '@elastic/eui'

import { CuiAlert, CuiPermissibleControl } from '../../../../cui'

import DangerButton from '../../../DangerButton'

import { getSliderPrettyName } from '../../../../lib/sliders'

import Permission from '../../../../lib/api/v1/permissions'

import { AnyResourceInfo, AsyncRequestState, SliderInstanceType } from '../../../../types'
import { getResourceVersion } from '../../../../lib/stackDeployments'

type Props = {
  resource: AnyResourceInfo
  sliderInstanceType: SliderInstanceType
  restart: () => void
  resetRestartRequest: () => void
  restartRequest: AsyncRequestState
}

class Restart extends Component<Props> {
  componentWillUnmount() {
    this.props.resetRestartRequest()
  }

  render() {
    const { resource, restart, restartRequest, sliderInstanceType } = this.props
    const name = (
      <FormattedMessage
        {...getSliderPrettyName({ sliderInstanceType, version: getResourceVersion({ resource }) })}
      />
    )

    return (
      <div>
        <CuiPermissibleControl permissions={Permission.restartDeploymentStatelessResource}>
          <DangerButton
            className='sliderOverview-managementButtonsItem'
            data-test-id='sliderForceRestart-Btn'
            onConfirm={restart}
            size='s'
            fill={false}
            isBusy={restartRequest.inProgress}
            modal={{
              body: (
                <FormattedMessage
                  id='restart-slider.body'
                  defaultMessage='If your {name} is not working well, sometimes it helps to force restart it.'
                  values={{ name }}
                />
              ),
              confirmButtonText: (
                <FormattedMessage id='restart-slider.confirm' defaultMessage='Force Restart' />
              ),
              title: (
                <FormattedMessage
                  id='restart-slider.title'
                  defaultMessage='Force restart your {name}?'
                  values={{ name }}
                />
              ),
            }}
          >
            <FormattedMessage id='restart-slider.restart' defaultMessage='Force Restart' />
          </DangerButton>
        </CuiPermissibleControl>

        {restartRequest.error && (
          <div>
            <EuiSpacer size='s' />
            <CuiAlert type='error'>{restartRequest.error}</CuiAlert>
          </div>
        )}

        <EuiSpacer size='l' />
      </div>
    )
  }
}

export default Restart
