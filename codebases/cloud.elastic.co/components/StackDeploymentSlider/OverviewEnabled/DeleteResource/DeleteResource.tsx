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

import React, { Fragment, FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiFormHelpText, EuiTextColor, EuiSpacer } from '@elastic/eui'

import { CuiAlert, CuiPermissibleControl } from '../../../../cui'

import DangerButton from '../../../DangerButton'

import { getSliderPrettyName } from '../../../../lib/sliders'
import {
  countInstances,
  getResourceVersion,
  isStopped,
} from '../../../../lib/stackDeployments/selectors'
import { getDedicatedTemplateType } from '../../../../lib/deploymentTemplates/metadata'
import { startsWithVowel } from '../../../../lib/string'

import Permission from '../../../../lib/api/v1/permissions'

import { AnyResourceInfo, AsyncRequestState, SliderInstanceType } from '../../../../types'
import { DeploymentTemplateInfoV2 } from '../../../../lib/api/v1/types'

type Props = {
  resource: AnyResourceInfo
  sliderInstanceType: SliderInstanceType
  delete: () => void
  deleteRequest: AsyncRequestState
  deploymentTemplate?: DeploymentTemplateInfoV2
}

const DeleteResource: FunctionComponent<Props> = ({
  resource,
  sliderInstanceType,
  delete: deleteResource,
  deleteRequest,
  deploymentTemplate,
}) => {
  const stopped = isStopped({ resource })
  const { running } = countInstances({ resource })
  const stillRunning = !stopped || running > 0
  const isDedicatedTemplate = getDedicatedTemplateType(deploymentTemplate) === sliderInstanceType
  const isDisabled = stillRunning || isDedicatedTemplate

  const name = (
    <FormattedMessage
      {...getSliderPrettyName({ sliderInstanceType, version: getResourceVersion({ resource }) })}
    />
  )

  return (
    <div>
      <CuiPermissibleControl permissions={Permission.deleteDeploymentStatelessResource}>
        <DangerButton
          className='sliderOverview-managementButtonsItem'
          data-test-id='sliderDelete-Btn'
          size='s'
          fill={false}
          disabled={isDisabled}
          onConfirm={deleteResource}
          modal={{
            body: (
              <FormattedMessage
                id='delete-slider.body'
                defaultMessage='Permanently deletes your {name}.'
                values={{ name }}
              />
            ),
            confirmButtonText: (
              <FormattedMessage id='delete-slider.confirm' defaultMessage='Delete' />
            ),
            title: (
              <FormattedMessage
                id='delete-slider.title'
                defaultMessage='Delete your {name}?'
                values={{ name }}
              />
            ),
          }}
          isBusy={deleteRequest.inProgress}
        >
          <FormattedMessage
            id='delete-slider.downscale-and-delete'
            defaultMessage='Delete {name}'
            values={{ name }}
          />
        </DangerButton>
      </CuiPermissibleControl>

      {getHelpText({ isDedicatedTemplate, stillRunning, name })}

      {deleteRequest.error && (
        <Fragment>
          <EuiSpacer size='s' />
          <CuiAlert type='error'>{deleteRequest.error}</CuiAlert>
        </Fragment>
      )}
    </div>
  )
}

function getHelpText({
  isDedicatedTemplate,
  stillRunning,
  name,
}: {
  isDedicatedTemplate: boolean
  stillRunning: boolean
  name: JSX.Element
}) {
  if (isDedicatedTemplate) {
    const prefix = startsWithVowel(name.props.defaultMessage || ``) ? `an` : `a`

    return (
      <EuiFormHelpText data-test-id='resource-dedicated-warning'>
        <EuiTextColor color='warning'>
          <FormattedMessage
            id='delete-slider.dedicated-resource'
            defaultMessage='This is {prefix} {name} deployment, you cannot delete this instance.'
            values={{ name, prefix }}
          />
        </EuiTextColor>
      </EuiFormHelpText>
    )
  }

  // An instance aborted on upscale will be stopped but still running
  if (stillRunning) {
    return (
      <EuiFormHelpText data-test-id='resource-running-warning'>
        <EuiTextColor color='warning'>
          <FormattedMessage
            id='delete-slider.terminate-slider-before-delete'
            defaultMessage='Terminate {name} before deleting.'
            values={{ name }}
          />
        </EuiTextColor>
      </EuiFormHelpText>
    )
  }

  return null
}

export default DeleteResource
