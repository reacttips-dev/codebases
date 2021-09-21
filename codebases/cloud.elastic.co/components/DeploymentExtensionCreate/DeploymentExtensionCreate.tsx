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

import { CuiRouterLinkButtonEmpty } from '../../cui'

import DeploymentExtensionForm from '../DeploymentExtensionForm'

import Header from '../Header'

import { deploymentExtensionsUrl } from '../../lib/urlBuilder'

import { extensionCreateCrumbs } from '../../lib/crumbBuilder'

import { AsyncRequestState } from '../../types'
import { CreateExtensionRequest, Extension } from '../../lib/api/v1/types'

type Props = {
  canEditBundles: boolean
  canEditPlugins: boolean
  createExtension: (params: { extension: CreateExtensionRequest }) => Promise<any>
  createExtensionRequest: AsyncRequestState
  uploadExtension: (params: { extensionId: string; file: File }) => Promise<any>
  uploadExtensionRequest: (extensionId: string) => AsyncRequestState
  resetCreateExtension: () => void
  resetUploadExtension: (extensionId: string) => void
  redirectToList: () => void
}

type State = {
  extensionId: string | null
  busy: boolean
}

class DeploymentExtensionCreate extends Component<Props, State> {
  state: State = {
    extensionId: null,
    busy: false,
  }

  _mounted: boolean = false

  componentDidMount() {
    const { resetCreateExtension } = this.props
    resetCreateExtension()
    this._mounted = true
  }

  render() {
    const { createExtensionRequest, uploadExtensionRequest, canEditPlugins, canEditBundles } =
      this.props

    const { extensionId, busy } = this.state

    return (
      <Fragment>
        <Header
          name={
            <FormattedMessage
              id='deployment-extension-create.header'
              defaultMessage='Create extension'
            />
          }
          breadcrumbs={extensionCreateCrumbs()}
        />

        <DeploymentExtensionForm
          cancelButton={
            <CuiRouterLinkButtonEmpty size='s' to={deploymentExtensionsUrl()}>
              <FormattedMessage
                id='deployment-extension-create.back-to-list'
                defaultMessage='Back to Extensions'
              />
            </CuiRouterLinkButtonEmpty>
          }
          busy={busy}
          save={this.saveExtension}
          saveRequest={createExtensionRequest}
          uploadRequest={extensionId ? uploadExtensionRequest(extensionId) : undefined}
          canEditPlugins={canEditPlugins}
          canEditBundles={canEditBundles}
        />
      </Fragment>
    )
  }

  saveExtension = ({ extension, file }: { extension: Extension; file: File | null }) => {
    const { createExtension, uploadExtension, redirectToList, resetUploadExtension } = this.props

    const { extensionId } = this.state

    if (extensionId) {
      resetUploadExtension(extensionId)
    }

    this.setState({ busy: true })

    upsertExtension
      .call(this)
      .then(() => redirectToList())
      .catch(() => this.setStateAsync({ busy: false }))

    function upsertExtension() {
      // we've already created, but presumably failed to upload
      if (extensionId) {
        return uploadStep(extensionId)
      }

      return createExtension({ extension }).then((actionResult) => {
        this.setStateAsync({ extensionId: actionResult.payload.id })

        return uploadStep(actionResult.payload.id)
      })
    }

    function uploadStep(extensionId) {
      if (!file) {
        return Promise.resolve()
      }

      return uploadExtension({ extensionId, file })
    }
  }

  setStateAsync = (state) => {
    if (this._mounted) {
      this.setState(state)
    }
  }
}

export default DeploymentExtensionCreate
