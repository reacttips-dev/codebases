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
import { RouteComponentProps } from 'react-router'

import { EuiLoadingContent, EuiSpacer } from '@elastic/eui'

import { CuiAlert, CuiRouterLinkButtonEmpty } from '../../cui'

import Header from '../Header'

import DeploymentExtensionForm from '../DeploymentExtensionForm'

import { deploymentExtensionsUrl } from '../../lib/urlBuilder'
import { deploymentExtensionCrumbs } from '../../lib/crumbBuilder'

import { Extension, UpdateExtensionRequest } from '../../lib/api/v1/types'
import { AsyncRequestState } from '../../types'

import './plugin.scss'

type RouteParams = {
  extensionId: string
}

export type Props = RouteComponentProps<RouteParams> & {
  extension: Extension | null
  canEditBundles: boolean
  canEditPlugins: boolean
  fetchExtension: () => void
  fetchExtensionRequest: AsyncRequestState
  resetUpdateExtension: () => void
  resetUploadExtension: () => void
  updateExtension: (extension: UpdateExtensionRequest) => Promise<void>
  uploadExtension: (file: File) => Promise<void>
  updateExtensionRequest: AsyncRequestState
  uploadExtensionRequest: AsyncRequestState
}

type State = {
  busyness: number
}

class DeploymentExtensionEdit extends Component<Props, State> {
  state: State = {
    busyness: 0,
  }

  componentDidMount() {
    this.props.fetchExtension()
  }

  componentWillUnmount() {
    const { resetUpdateExtension, resetUploadExtension } = this.props

    resetUpdateExtension()
    resetUploadExtension()
  }

  render() {
    const {
      match: {
        params: { extensionId },
      },
    } = this.props

    return (
      <Fragment>
        <Header
          name={
            <FormattedMessage
              id='deployment-extension-edit.deployment-extension'
              defaultMessage='Deployment extension'
            />
          }
          breadcrumbs={deploymentExtensionCrumbs({ extensionId })}
        />

        {this.renderContent()}
      </Fragment>
    )
  }

  renderContent() {
    const {
      extension,
      fetchExtensionRequest,
      updateExtensionRequest,
      uploadExtensionRequest,
      canEditPlugins,
      canEditBundles,
    } = this.props

    const { busyness } = this.state

    if (fetchExtensionRequest.error) {
      return (
        <Fragment>
          <EuiSpacer />

          <CuiAlert type='error'>{fetchExtensionRequest.error}</CuiAlert>
        </Fragment>
      )
    }

    if (!extension) {
      return <EuiLoadingContent data-test-id='spinner' />
    }

    return (
      <div data-test-id='deployment-extension-form'>
        <DeploymentExtensionForm
          extensionUnderEdit={extension}
          save={this.updateExtension}
          saveRequest={updateExtensionRequest}
          uploadRequest={uploadExtensionRequest}
          canEditPlugins={canEditPlugins}
          canEditBundles={canEditBundles}
          cancelButton={
            <CuiRouterLinkButtonEmpty size='s' to={deploymentExtensionsUrl()}>
              <FormattedMessage id='deployment-extension-edit.back-button' defaultMessage='Back' />
            </CuiRouterLinkButtonEmpty>
          }
          busy={busyness > 0}
        />
      </div>
    )
  }

  updateExtension = ({
    extension,
    file,
  }: {
    extension: UpdateExtensionRequest
    file: File | null
  }) => {
    const { updateExtension, uploadExtension, resetUpdateExtension, resetUploadExtension } =
      this.props

    this.setState({ busyness: file ? 2 : 1 })

    resetUpdateExtension()
    resetUploadExtension()

    updateExtension(extension).finally(this.decrementBusyness)

    if (file) {
      uploadExtension(file).finally(this.decrementBusyness)
    }
  }

  decrementBusyness = () => {
    this.setState(({ busyness }) => ({ busyness: busyness - 1 }))
  }
}

export default DeploymentExtensionEdit
