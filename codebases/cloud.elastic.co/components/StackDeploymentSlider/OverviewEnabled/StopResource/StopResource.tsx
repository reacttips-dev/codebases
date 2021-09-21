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

import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiSpacer } from '@elastic/eui'

import DangerButton from '../../../DangerButton'
import { CuiAlert, CuiPermissibleControl } from '../../../../cui'

import { getSliderPrettyName } from '../../../../lib/sliders'

import Permission from '../../../../lib/api/v1/permissions'

import { AnyResourceInfo, AsyncRequestState, SliderInstanceType } from '../../../../types'
import { getResourceVersion } from '../../../../lib/stackDeployments'

type Props = {
  resource: AnyResourceInfo
  sliderInstanceType: SliderInstanceType
  stop: () => void
  stopRequest: AsyncRequestState
}

const Stop: FunctionComponent<Props> = ({ resource, sliderInstanceType, stop, stopRequest }) => {
  const name = (
    <FormattedMessage
      {...getSliderPrettyName({ sliderInstanceType, version: getResourceVersion({ resource }) })}
    />
  )

  return (
    <div>
      <CuiPermissibleControl permissions={Permission.shutdownDeploymentStatelessResource}>
        <DangerButton
          className='sliderOverview-managementButtonsItem'
          data-test-id='sliderStop-Btn'
          onConfirm={stop}
          size='s'
          fill={false}
          modal={{
            body: (
              <FormattedMessage
                id='slider-stop.body'
                defaultMessage='Downscales your {name}, so that it no longer contains any running instances. You can easily re-start {name} after stopping it.'
                values={{ name }}
              />
            ),
            confirmButtonText: (
              <FormattedMessage id='slider-stop.confirm' defaultMessage='Terminate' />
            ),
            title: (
              <FormattedMessage
                id='slider-stop.title'
                defaultMessage='Terminate your {name}?'
                values={{ name }}
              />
            ),
          }}
          isBusy={stopRequest.inProgress}
        >
          <FormattedMessage id='slider-stop.stop' defaultMessage='Terminate' />
        </DangerButton>
      </CuiPermissibleControl>

      {stopRequest.error && (
        <div>
          <EuiSpacer size='s' />
          <CuiAlert type='error'>{stopRequest.error}</CuiAlert>
        </div>
      )}

      <EuiSpacer size='l' />
    </div>
  )
}

export default Stop
