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

import { EuiSpacer, EuiText } from '@elastic/eui'

import { CuiAlert, CuiPermissibleControl } from '../../../../cui'

import SpinButton from '../../../SpinButton'

import { getSliderPrettyName } from '../../../../lib/sliders'

import Permission from '../../../../lib/api/v1/permissions'

import { AnyResourceInfo, AsyncRequestState, SliderInstanceType } from '../../../../types'
import { getResourceVersion } from '../../../../lib/stackDeployments'

type Props = {
  resource: AnyResourceInfo
  sliderInstanceType: SliderInstanceType
  unhideResourceRequest: AsyncRequestState
  unhideResource: () => void
}

const UnhideResource: FunctionComponent<Props> = ({
  resource,
  sliderInstanceType,
  unhideResourceRequest,
  unhideResource,
}) => {
  const name = (
    <FormattedMessage
      {...getSliderPrettyName({ sliderInstanceType, version: getResourceVersion({ resource }) })}
    />
  )

  return (
    <div>
      <EuiText>
        <FormattedMessage
          id='slider-unhide.title'
          defaultMessage='This deployment does not have a running {name}.'
          values={{ name }}
        />
      </EuiText>

      <EuiSpacer size='m' />

      <CuiPermissibleControl permissions={Permission.restartDeploymentStatelessResource}>
        <SpinButton
          className='sliderOverview-managementButtonsItem'
          data-test-id='sliderUnhide-Btn'
          onClick={() => unhideResource()}
          size='s'
          color='primary'
          fill={false}
          spin={unhideResourceRequest.inProgress}
        >
          <FormattedMessage id='slider-unhide.button' defaultMessage='Enable' />
        </SpinButton>
      </CuiPermissibleControl>

      {unhideResourceRequest.error && (
        <div>
          <EuiSpacer size='s' />
          <CuiAlert type='error'>{unhideResourceRequest.error}</CuiAlert>
        </div>
      )}

      <EuiSpacer size='l' />
    </div>
  )
}

export default UnhideResource
