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

import { EuiText } from '@elastic/eui'

import CcsRemoteDeploymentsTable from '../../CcsRemoteDeploymentsTable'

import { getEsPlan, getUpsertVersion } from '../../../lib/stackDeployments'

import { DeepPartial } from '../../../lib/ts-essentials'
import { markShallow } from '../../../lib/immutability-helpers'

import { RemoteResourceRef } from '../../../lib/api/v1/types'
import { StackDeploymentCreateRequest } from '../../../types'

export type Props = {
  editorState: StackDeploymentCreateRequest
  onChange: (
    changes: DeepPartial<StackDeploymentCreateRequest>,
    settings?: { shallow?: boolean },
  ) => void
}

class CcsSetupRemoteDeployments extends Component<Props> {
  render(): JSX.Element {
    const { editorState } = this.props
    const {
      deployment: { name },
    } = editorState
    const version = getUpsertVersion(editorState)
    const remoteDeployments = this.getRemoteDeployments()

    return (
      <Fragment>
        <EuiText color='subdued'>
          <FormattedMessage
            id='setup-associated-deployments.description'
            defaultMessage='The {deploymentName} deployment can read data from other deployments. Specify which deployments to search across.'
            values={{
              deploymentName: <strong>{name}</strong>,
            }}
          />
        </EuiText>

        <CcsRemoteDeploymentsTable
          deploymentVersion={version!}
          remoteDeployments={remoteDeployments}
          onChange={this.updateRemoteDeployments}
        />
      </Fragment>
    )
  }

  getRemoteDeployments(): RemoteResourceRef[] | null {
    const { editorState } = this.props
    const { deployment } = editorState

    const plan = getEsPlan({ deployment })

    if (!plan?.transient?.remote_clusters) {
      return null
    }

    return plan.transient.remote_clusters.resources
  }

  updateRemoteDeployments = (remoteResources: RemoteResourceRef[]): void => {
    const { onChange } = this.props

    onChange({
      deployment: {
        resources: {
          elasticsearch: [
            {
              plan: {
                transient: {
                  remote_clusters: {
                    resources: markShallow(remoteResources),
                  },
                },
              },
            },
          ],
        },
      },
    })
  }
}

export default CcsSetupRemoteDeployments
