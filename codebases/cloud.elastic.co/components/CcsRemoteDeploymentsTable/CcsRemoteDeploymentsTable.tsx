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

import { get, isEmpty, reject, without } from 'lodash'
import React, { Component, Fragment } from 'react'
import { defineMessages, FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl'

import {
  EuiButton,
  EuiEmptyPrompt,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
  EuiText,
} from '@elastic/eui'

import { CuiPermissibleControl, CuiTable } from '../../cui'

import EditDeploymentFlyout from './EditDeploymentFlyout'
import RemoteDeploymentDescription, { getRemoteName } from './RemoteDeploymentDescription'
import RemoteDeploymentVersion from './RemoteDeploymentVersion'
import RemoteDeploymentActions from './RemoteDeploymentActions'
import RefreshRemoteDeployments from './RefreshRemoteDeployments'

import { getRemoteDeployments, getVersion } from '../../lib/stackDeployments/selectors'
import { toRemoteDeploymentList } from '../../lib/deployments/ccs'

import Permission from '../../lib/api/v1/permissions'

import { RemoteResourceRef } from '../../lib/api/v1/types'
import { RemoteMapping, StackDeployment } from '../../types'

import { AllProps as Props, State } from './types'

const messages = defineMessages({
  columnDeployment: {
    id: `remote-deployments-table.column-deployment`,
    defaultMessage: `Deployment`,
  },
  columnAlias: {
    id: `remote-deployments-table.column-alias`,
    defaultMessage: `Alias`,
  },
  columnVersion: {
    id: `remote-deployments-table.column-version`,
    defaultMessage: `Version`,
  },
  columnActions: {
    id: `remote-deployments-table.column-actions`,
    defaultMessage: `Actions`,
  },
})

class CcsRemoteDeploymentsTable extends Component<Props & WrappedComponentProps, State> {
  state: State = {
    remotes: this.props.remoteDeployments || [],
    pendingRemote: null,
    editingAlias: null,
    limitRows: true,
    isFlyoutOpen: false,
  }

  render() {
    const { ccsDeployments } = this.props

    const { remotes } = this.state
    const remoteList = toRemoteDeploymentList({
      remotes,
      ccsDeployments,
    })

    return (
      <Fragment>
        {remoteList.length === 0 ? null : (
          <Fragment>
            <EuiSpacer size='m' />

            <EuiFlexGroup justifyContent='flexEnd'>
              <EuiFlexItem grow={false}>{this.renderAddRemoteDeploymentButton()}</EuiFlexItem>
            </EuiFlexGroup>
          </Fragment>
        )}

        <EuiSpacer size='m' />

        <CuiTable<RemoteMapping>
          data-test-id='remote-clusters-table'
          rows={remoteList}
          columns={this.getColumns()}
          emptyMessage={this.renderEmptyMessage()}
          pageSize={5}
        />

        {this.renderEditFlyout()}

        <RefreshRemoteDeployments refreshClusters={this.findCcsDeployments} />
      </Fragment>
    )
  }

  renderEmptyMessage() {
    return (
      <EuiEmptyPrompt
        title={
          <h3>
            <FormattedMessage
              id='remote-deployments-table.no-deployments'
              defaultMessage='No deployments'
            />
          </h3>
        }
        titleSize='xs'
        body={
          <EuiText>
            <p>
              <FormattedMessage
                id='remote-deployments-table.no-deployments-description'
                defaultMessage="Looks like you don't have any remote deployments."
              />
            </p>

            <p>
              <FormattedMessage
                id='remote-deployments-table.no-deployments-description-add-some'
                defaultMessage="Let's add some!"
              />
            </p>
          </EuiText>
        }
        actions={this.renderAddRemoteDeploymentButton()}
      />
    )
  }

  renderAddRemoteDeploymentButton() {
    return (
      <CuiPermissibleControl permissions={Permission.setEsClusterCcsSettings}>
        <EuiButton size='s' onClick={this.addRemoteDeployment}>
          <FormattedMessage
            id='remote-deployments-table.add-remote-deployment'
            defaultMessage='Add deployment'
          />
        </EuiButton>
      </CuiPermissibleControl>
    )
  }

  renderEditFlyout() {
    const { deployment, deploymentVersion, ccsDeployments, changeRequest, resetChangeRequest } =
      this.props
    const { remotes, pendingRemote, editingAlias, isFlyoutOpen } = this.state

    if (!isFlyoutOpen) {
      return null
    }

    const unavailableAliases = without(
      remotes.map(({ alias }) => alias),
      editingAlias,
    ) as string[]

    return (
      <EditDeploymentFlyout
        deployment={deployment}
        deploymentVersion={deploymentVersion}
        pendingRemote={pendingRemote}
        ccsDeployments={ccsDeployments}
        isEditing={Boolean(editingAlias)}
        unavailableAliases={unavailableAliases}
        resetChangeRequest={resetChangeRequest}
        changeRequest={changeRequest}
        onClose={() => {
          this.closePendingChanges()
        }}
        onSave={this.commitPendingChanges}
      />
    )
  }

  getColumns() {
    const {
      intl: { formatMessage },
      deployment,
      deploymentVersion,
    } = this.props

    return [
      {
        label: formatMessage(messages.columnDeployment),
        render: ({ remote, ccsDeployment }: RemoteMapping) => (
          <RemoteDeploymentDescription remote={remote} ccsDeployment={ccsDeployment} />
        ),
        sortKey: ({ remote, ccsDeployment }: RemoteMapping) =>
          getRemoteName({ ccsDeployment, remote }),
      },
      {
        label: formatMessage(messages.columnAlias),
        render: ({ remote }: RemoteMapping) => remote.alias,
        sortKey: `remote.alias`,
      },
      {
        label: formatMessage(messages.columnVersion),
        render: ({ ccsDeployment }: RemoteMapping) => (
          <RemoteDeploymentVersion
            deploymentVersion={deploymentVersion}
            ccsDeployment={ccsDeployment}
            isIncompatible={isIncompatible({ deployment, ccsDeployment })}
          />
        ),
        sortKey: ({ ccsDeployment }: RemoteMapping) =>
          ccsDeployment && getVersion({ deployment: ccsDeployment }),
        width: '90px',
      },
      {
        mobile: {
          label: formatMessage(messages.columnActions),
        },
        actions: true,
        render: ({ remote }: RemoteMapping) => (
          <RemoteDeploymentActions
            remote={remote}
            onEdit={this.editRemoteDeployment}
            onRemove={this.removeRemoteDeployment}
          />
        ),
        width: `80px`,
      },
    ]
  }

  addRemoteDeployment = () => {
    this.setState({ pendingRemote: null, editingAlias: null, isFlyoutOpen: true })
  }

  editRemoteDeployment = (remote: RemoteResourceRef) => {
    this.setState({ pendingRemote: remote, editingAlias: remote.alias, isFlyoutOpen: true })
  }

  removeRemoteDeployment = (remote: RemoteResourceRef) => {
    const { remotes } = this.state

    const nextRemotes = reject(remotes, { alias: remote.alias })

    this.onChange(nextRemotes)
  }

  closePendingChanges = (
    actionResult?: {
      body?: {
        errors?: unknown
      }
    } | void,
  ): boolean => {
    if (!isEmpty(get(actionResult, [`body`, `errors`]))) {
      return false // assume we'll render the error on the flyout
    }

    const { editingAlias } = this.state

    if (!editingAlias) {
      this.setState({ limitRows: false })
    }

    this.setState({ pendingRemote: null, editingAlias: null, isFlyoutOpen: false })

    return true
  }

  commitPendingChanges = (pendingRemote: RemoteResourceRef) => {
    const { remotes, editingAlias } = this.state

    const nextRemotes = editingAlias ? reject(remotes, { alias: editingAlias }) : remotes

    this.onChange([...nextRemotes, pendingRemote])
  }

  onChange(nextRemotes: RemoteResourceRef[]) {
    const { onChange } = this.props

    if (!onChange) {
      this.onChangeFinish(nextRemotes)
      return
    }

    const changeResult = onChange(nextRemotes)

    if (!(changeResult instanceof Promise)) {
      this.onChangeFinish(nextRemotes)
      return
    }

    return changeResult.then(
      (actionResult) => this.onChangeFinish(nextRemotes, actionResult),
      (actionResult) => this.onChangeFinish(nextRemotes, actionResult),
    )
  }

  onChangeFinish(nextRemotes: RemoteResourceRef[], actionResult?: void) {
    if (this.closePendingChanges(actionResult)) {
      this.setState({ remotes: nextRemotes })
    }
  }

  findCcsDeployments = () => {
    const { ccsDeployments, searchCcsDeployments } = this.props
    const { remotes } = this.state

    const remoteDeploymentIds = remotes.map(({ deployment_id }) => deployment_id)
    const currentDeploymentIds = ccsDeployments.map(({ id }) => id)

    // We only poll when we need to request new deployments
    const hasAllRemoteDeployments = remoteDeploymentIds.every((id) =>
      currentDeploymentIds.includes(id),
    )

    if (!isEmpty(remoteDeploymentIds) && !hasAllRemoteDeployments) {
      searchCcsDeployments(remoteDeploymentIds)
    }
  }
}

function isIncompatible({
  deployment,
  ccsDeployment,
}: {
  deployment?: StackDeployment
  ccsDeployment?: StackDeployment
}): boolean {
  if (!deployment || !ccsDeployment) {
    return false // we don't know, no reason not to be cautious here
  }

  const remoteDeployments = getRemoteDeployments({ deployment })

  return remoteDeployments.some(
    ({ deployment_id, info }) => deployment_id === ccsDeployment.id && info?.compatible === false,
  )
}

export default injectIntl(CcsRemoteDeploymentsTable)
