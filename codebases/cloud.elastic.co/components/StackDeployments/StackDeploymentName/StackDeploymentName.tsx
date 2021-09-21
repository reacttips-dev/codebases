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
import { defineMessages, FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl'

import {
  EuiButtonEmpty,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormLabel,
  EuiSpacer,
  EuiText,
} from '@elastic/eui'

import { CuiAlert } from '../../../cui'

import SpinButton from '../../SpinButton'

import ClusterLockingGate from '../../ClusterLockingGate'

import {
  createUpdateRequestFromGetResponse,
  isSystemOwned,
  getDisplayName,
  getDisplayId,
} from '../../../lib/stackDeployments'

import { ifPermitted } from '../../../lib/requiresPermission'

import Permission from '../../../lib/api/v1/permissions'
import { DeploymentUpdateRequest } from '../../../lib/api/v1/types'
import { AsyncRequestState, StackDeployment } from '../../../types'

const messages = defineMessages({
  deploymentName: {
    id: `deployment-name.deployment-name-placeholder`,
    defaultMessage: `Deployment name`,
  },
})

type StateProps = {
  updateStackDeploymentRequest: AsyncRequestState
}

type DispatchProps = {
  updateDeployment: (updateRequest: DeploymentUpdateRequest) => Promise<any>
}

type ConsumerProps = {
  deployment: StackDeployment
}

type Props = StateProps & DispatchProps & ConsumerProps & WrappedComponentProps

type State = {
  editing: boolean
  editingName: string
}

class DeploymentName extends Component<Props, State> {
  state: State = {
    editing: false,
    editingName: ``,
  }

  render() {
    const { updateStackDeploymentRequest } = this.props
    const { editing } = this.state

    return (
      <div>
        <EuiFormLabel htmlFor='deploymentName'>
          <FormattedMessage id='deployment-name.deployment-name' defaultMessage='Deployment name' />
        </EuiFormLabel>

        <EuiSpacer size='s' />

        <EuiFlexGroup gutterSize='s' alignItems='center' responsive={false}>
          {editing ? this.renderEditForm() : this.renderDeploymentName()}
        </EuiFlexGroup>

        {updateStackDeploymentRequest.error && (
          <Fragment>
            <EuiSpacer size='m' />
            <CuiAlert type='error'>{updateStackDeploymentRequest.error}</CuiAlert>
          </Fragment>
        )}
      </div>
    )
  }

  renderDeploymentName() {
    const { deployment } = this.props
    const { name } = deployment
    const systemOwned = isSystemOwned({ deployment })
    const displayName = getDisplayName({ deployment })

    return (
      <Fragment>
        <EuiFlexItem grow={false}>
          <EuiFlexGroup
            gutterSize='none'
            justifyContent='flexStart'
            alignItems='center'
            responsive={false}
          >
            <EuiFlexItem grow={false} style={{ minWidth: `150px` }}>
              <EuiFieldText
                data-test-id='deploymentManage-deploymentName'
                id='deploymentName'
                value={displayName}
                readOnly={true}
              />
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <ClusterLockingGate>
                {!systemOwned &&
                  ifPermitted(Permission.updateDeployment, () => (
                    <EuiFlexItem grow={false}>
                      <EuiButtonEmpty
                        data-test-id='deploymentManage-deploymentNameEdit'
                        onClick={() => this.setState({ editing: true, editingName: name })}
                      >
                        <FormattedMessage id='deployment-name.rename-link' defaultMessage='Edit' />
                      </EuiButtonEmpty>
                    </EuiFlexItem>
                  ))}
              </ClusterLockingGate>
            </EuiFlexItem>
          </EuiFlexGroup>
          <EuiText size='xs' color='subdued'>
            <FormattedMessage id='deploymentName-deployment-id' defaultMessage='Deployment ID:' />
            {` ${getDisplayId({ deployment })}`}
          </EuiText>
        </EuiFlexItem>
      </Fragment>
    )
  }

  renderEditForm() {
    const {
      intl: { formatMessage },
      deployment,
      updateStackDeploymentRequest,
    } = this.props

    const { editingName } = this.state
    const currentName = deployment.name

    const isDirty = editingName !== currentName

    return (
      <Fragment>
        <EuiFlexItem grow={false}>
          <EuiFieldText
            data-test-id='deploymentManage-deploymentNameEditable'
            aria-label='deploymentName'
            id='deploymentName'
            placeholder={formatMessage(messages.deploymentName)}
            value={editingName}
            onChange={(e) => this.setState({ editingName: (e.target as HTMLInputElement).value })}
          />
        </EuiFlexItem>

        <EuiFlexItem grow={false}>
          <SpinButton
            color='primary'
            onClick={() => this.saveChanges()}
            disabled={!isDirty}
            data-test-id='deploymentManage-deploymentNameUpdate'
            spin={updateStackDeploymentRequest.inProgress}
            requiresSudo={true}
          >
            <FormattedMessage id='deployment-name.rename-button' defaultMessage='Update' />
          </SpinButton>
        </EuiFlexItem>

        <EuiFlexItem grow={false}>
          <EuiButtonEmpty
            onClick={() => this.stopEditing()}
            data-test-id='deploymentManage-deploymentNameCancel'
          >
            <FormattedMessage id='deployment-name.cancel' defaultMessage='Cancel' />
          </EuiButtonEmpty>
        </EuiFlexItem>
      </Fragment>
    )
  }

  saveChanges() {
    const { editingName } = this.state
    const { deployment, updateDeployment } = this.props
    const updateRequest = createUpdateRequestFromGetResponse({ deployment, omitResources: true })

    updateRequest.name = editingName

    updateDeployment(updateRequest).then(() => this.stopEditing())
  }

  stopEditing() {
    this.setState({ editing: false, editingName: `` })
  }
}

export default injectIntl(DeploymentName)
