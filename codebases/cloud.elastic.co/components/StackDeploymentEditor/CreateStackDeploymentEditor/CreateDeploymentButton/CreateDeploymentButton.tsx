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

import { EuiFlexItem } from '@elastic/eui'

import SpinButton from '../../../SpinButton'

import { getCreatePayload } from '../../../../lib/stackDeployments'

import {
  AsyncRequestState,
  Region,
  StackDeploymentCreateRequest,
  UserProfile,
} from '../../../../types'

import {
  DeploymentCreateRequest,
  DeploymentCreateResponse,
  StackVersionConfig,
} from '../../../../lib/api/v1/types'
import ApiRequestExample from '../../../ApiRequestExample'
import { createDeploymentUrl } from '../../../../lib/api/v1/urls'
import { isTrialUser } from '../../../../lib/billing'

type StateProps = {
  region?: Region
  createStackDeploymentRequest: AsyncRequestState
  profile?: UserProfile | null
  stackVersions?: StackVersionConfig[] | null
}

type DispatchProps = {
  createDeployment: (params: {
    deployment: DeploymentCreateRequest
    profile?: UserProfile | null
  }) => Promise<any>
  resetCreateDeployment: () => void
  redirectToStackGettingStarted: (stackDeploymentId: string) => void
}

type ConsumerProps = {
  editorState: StackDeploymentCreateRequest
  disabled?: boolean

  // `filterIngestPlugins` prop already existed, but it carries a bug:
  // depending where we render the button, we might or not filter ingest
  // plugins. this is bad. we need to kill it and look at (or maybe update)
  // the editor state instead
  filterIngestPlugins?: boolean

  // `hasIndexCuration` prop already existed, but it carries a bug:
  // depending where we render the button, we might or not consider we have
  // index curation. this is bad. we need to kill it and look at the editor
  // state instead
  hasIndexCuration?: boolean

  showApiRequest?: boolean
}

type Props = StateProps & DispatchProps & ConsumerProps

export default class CreateDeploymentButton extends Component<Props> {
  static defaultProps = {
    filterIngestPlugins: false,
  }

  componentWillUnmount() {
    const { resetCreateDeployment } = this.props
    resetCreateDeployment()
  }

  render() {
    const { disabled, createStackDeploymentRequest, showApiRequest, profile } = this.props
    const displayApiRequestLink = !disabled && showApiRequest
    const isTrial = profile && isTrialUser(profile)

    return (
      <EuiFlexItem grow={false}>
        <div>
          <SpinButton
            data-test-id='submit-create-deployment'
            className='create-deployment-action-button'
            fill={true}
            requiresSudo={true}
            disabled={disabled}
            onClick={this.createDeployment}
            spin={createStackDeploymentRequest.inProgress}
          >
            <FormattedMessage
              id='create-deployment-from-template.create-deployment'
              defaultMessage='Create deployment'
            />
          </SpinButton>

          {displayApiRequestLink && !isTrial && (
            <ApiRequestExample
              method='POST'
              endpoint={createDeploymentUrl()}
              body={this.getCreatePayload()}
            />
          )}
        </div>
      </EuiFlexItem>
    )
  }

  getCreatePayload() {
    const { editorState, hasIndexCuration, filterIngestPlugins, stackVersions } = this.props
    const region = this.props.region!

    const payload = getCreatePayload({
      region,
      editorState,
      hasIndexCuration,
      filterIngestPlugins,
      stackVersions,
    })

    return payload!
  }

  createDeployment = () => {
    const { createDeployment, redirectToStackGettingStarted, profile } = this.props

    return createDeployment({
      deployment: this.getCreatePayload(),
      profile,
    }).then(createdDeployment)

    function createdDeployment(actionResult) {
      if (actionResult.error || !actionResult.payload) {
        return // we rely on the error being rendered elsewhere
      }

      const response: DeploymentCreateResponse = actionResult.payload
      const { id } = response

      redirectToStackGettingStarted(id)
    }
  }
}
