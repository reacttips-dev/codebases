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

import { EuiButtonEmpty, EuiSpacer } from '@elastic/eui'

import DangerButton from '../../DangerButton'

import { CuiAlert, CuiPermissibleControl } from '../../../cui'

import { AsyncRequestState } from '../../../types'

import Permission from '../../../lib/api/v1/permissions'

type Props = {
  cancelPlan: () => void
  cancelPlanRequest: AsyncRequestState
  resetCancelPlanRequest: () => void
}

class CancelPlanButton extends Component<Props> {
  componentWillUnmount() {
    this.props.resetCancelPlanRequest()
  }

  render() {
    const { cancelPlan, cancelPlanRequest } = this.props

    const cancelled = cancelPlanRequest.isDone && !cancelPlanRequest.error
    const busy = cancelPlanRequest.inProgress

    return (
      <Fragment>
        <CuiPermissibleControl permissions={Permission.cancelDeploymentResourcePendingPlan}>
          <DangerButton
            data-test-id='planAttempt-cancelPlanBtn'
            buttonType={EuiButtonEmpty}
            color='primary'
            modal={{
              title: (
                <FormattedMessage
                  id='plan-attempt-cancel-plan-button.modal-title'
                  defaultMessage='Cancel configuration change?'
                />
              ),
              body: (
                <FormattedMessage
                  id='plan-attempt-cancel-plan-button.modal-body'
                  defaultMessage='The change is still being applied. Cancelling skips any pending changes and reverts to the previously saved configuration.'
                />
              ),
              confirmButtonText: (
                <FormattedMessage
                  id='plan-attempt-cancel-plan-button.modal-do-cancel-change'
                  defaultMessage='Cancel change'
                />
              ),
              cancelButtonText: (
                <FormattedMessage
                  id='plan-attempt-cancel-plan-button.modal-dont-cancel-change'
                  defaultMessage="Don't cancel"
                />
              ),
            }}
            size='s'
            requiresSudo={true}
            isBusy={busy}
            disabled={cancelled}
            onConfirm={cancelPlan}
          >
            <FormattedMessage id='plan-attempt-cancel-plan-button.cancel' defaultMessage='Cancel' />
          </DangerButton>
        </CuiPermissibleControl>

        {cancelPlanRequest.error && (
          <Fragment>
            <EuiSpacer size='m' />
            <CuiAlert type='error'>{cancelPlanRequest.error}</CuiAlert>
          </Fragment>
        )}
      </Fragment>
    )
  }
}

export default CancelPlanButton
