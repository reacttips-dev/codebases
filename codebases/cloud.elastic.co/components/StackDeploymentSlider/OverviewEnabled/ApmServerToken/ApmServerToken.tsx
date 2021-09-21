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

import {
  EuiCode,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormLabel,
  EuiLink,
  EuiLoadingContent,
  EuiSpacer,
} from '@elastic/eui'

import RequiresSudo from '../../../RequiresSudo'
import DangerButton from '../../../DangerButton'
import CopyButton from '../../../CopyButton'

import {
  getPlanInfo,
  getRegionId,
  isDeploymentAvailable,
  isResourceAvailable,
} from '../../../../lib/stackDeployments'

import { ApmPlanInfo, ApmResourceInfo } from '../../../../lib/api/v1/types'
import { StackDeployment } from '../../../../types'

import './apmServerToken.scss'

type Props = {
  deployment: StackDeployment
  resource: ApmResourceInfo
  resetApmToken: (regionId: string, apmId: string, deploymentId: string) => void
  fetchApm: (regionId: string, id: string) => void
}

const ApmServerToken: FunctionComponent<Props> = ({
  deployment,
  resource,
  fetchApm,
  resetApmToken,
}) => {
  const plan = getPlanInfo({ resource }) as ApmPlanInfo
  const regionId = getRegionId({ deployment })!
  const deploymentIsAvailable = isDeploymentAvailable(deployment)
  const apmIsAvailable = isResourceAvailable(resource)
  const isEnabled = deploymentIsAvailable && apmIsAvailable
  const secretToken = plan.plan?.apm.system_settings?.secret_token || `-`
  const isTokenVisible = secretToken !== `-`

  if (!apmIsAvailable) {
    return null
  }

  return (
    <Fragment>
      <EuiFormLabel className='apmServerToken-label'>
        <FormattedMessage id='apm.security-token.title' defaultMessage='APM Server secret token' />
      </EuiFormLabel>

      <EuiSpacer size='xs' />

      <RequiresSudo
        color='primary'
        buttonType={EuiLink}
        to={
          <FormattedMessage
            id='apm.security-token.reveal-apm-secret'
            defaultMessage='Reveal APM secret'
          />
        }
        helpText={false}
        actionPrefix={false}
        onSudo={() => fetchApm(regionId, resource.id)}
      >
        {isTokenVisible ? (
          <EuiFlexGroup
            justifyContent='flexStart'
            alignItems='center'
            gutterSize='none'
            responsive={false}
          >
            <EuiFlexItem grow={false}>
              <EuiCode transparentBackground={true} className='apmServerToken-token'>
                {secretToken}
              </EuiCode>
            </EuiFlexItem>

            <EuiFlexItem grow={false}>
              <CopyButton value={secretToken} />
            </EuiFlexItem>

            <EuiFlexItem grow={false}>
              <span className='apmServerToken-divider'>|</span>
            </EuiFlexItem>

            <EuiFlexItem grow={false}>
              <DangerButton
                size='s'
                color='primary'
                isEmpty={true}
                disabled={!isEnabled}
                onConfirm={() => resetApmToken(regionId, resource.id, deployment.id)}
                modal={{
                  body: (
                    <FormattedMessage
                      id='apm.security-token.reset-modal.body'
                      defaultMessage='Resetting your token requires the APM servers to be restarted, which will render it unavailable until the restart is complete. This will also invalidate the existing token, and requests from all agents will be rejected until you update their configuration with the new token.'
                    />
                  ),
                  confirmButtonText: (
                    <FormattedMessage
                      id='apm.security-token.reset-modal.confirm-button'
                      defaultMessage='Reset token'
                    />
                  ),
                  title: (
                    <FormattedMessage
                      id='apm.security-token.reset-modal.title'
                      defaultMessage='Reset your APM server token?'
                    />
                  ),
                }}
              >
                <FormattedMessage
                  id='apm.security-token.reset-button'
                  defaultMessage='Reset token'
                />
              </DangerButton>
            </EuiFlexItem>
          </EuiFlexGroup>
        ) : (
          <EuiLoadingContent lines={1} />
        )}
      </RequiresSudo>
    </Fragment>
  )
}

export default ApmServerToken
