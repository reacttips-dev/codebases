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

import React, { Component, ComponentType } from 'react'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import { isEmpty } from 'lodash'

import { EuiLoadingContent } from '@elastic/eui'

import { CuiAlert } from '../../../cui'

import EditClusterContent from './EditClusterContent'

import { elasticStackVersionsUrl } from '../../../lib/urlBuilder'

import { withStackDeploymentRouteParams, WithStackDeploymentRouteParamsProps } from '../routing'

import { Props as EditClusterFormProps } from './EditClusterForm'

import { EditEditorComponentConsumerProps } from '../types'
import { AsyncRequestState } from '../../../types'
import {
  StackVersionConfig,
  DeploymentTemplateInfoV2,
  InstanceConfiguration,
} from '../../../lib/api/v1/types'

export type ConsumerProps = EditEditorComponentConsumerProps & {
  architectureSummary?: ComponentType<any>
  basedOnAttempt: boolean
  convertLegacyPlans: boolean
  deploymentTemplate: DeploymentTemplateInfoV2
  esVersions?: StackVersionConfig[]
  esVersionsRequest: AsyncRequestState
  fetchVersion: (version: string, regionId: string) => void
  hideAdvancedEdit: boolean
  hideConfigChangeStrategy: boolean
  instanceConfigurations: InstanceConfiguration[]
  resetUpdateDeployment: (stackDeploymentId: string) => void
  version: string
}

export type Props = EditClusterFormProps & WithStackDeploymentRouteParamsProps & ConsumerProps

class EditClusterFormBased extends Component<Props> {
  componentDidMount() {
    const { fetchVersion, regionId, version } = this.props
    fetchVersion(version, regionId)
  }

  componentWillUnmount() {
    const { stackDeploymentId, resetUpdateDeployment } = this.props
    resetUpdateDeployment(stackDeploymentId!)
  }

  render() {
    const { regionId, esVersions, esVersionsRequest } = this.props

    if (esVersionsRequest.error) {
      return (
        <CuiAlert
          data-test-id='edit-cluster-form-fetch-version-failed'
          details={esVersionsRequest.error}
          type='error'
        >
          <FormattedMessage
            id='edit-cluster-simple.fetching-elasticsearch-versions-failed'
            defaultMessage='Fetching Elasticsearch versions failed'
          />
        </CuiAlert>
      )
    }

    if (esVersions == null) {
      return (
        <div data-test-id='edit-cluster-form-loading'>
          <EuiLoadingContent lines={6} />
        </div>
      )
    }

    if (isEmpty(esVersions)) {
      return (
        <CuiAlert data-test-id='edit-cluster-form-fetch-version-empty' type='warning'>
          <FormattedMessage
            id='edit-cluster-simple.could-not-find-any-elasticsearch-versions-you-need-to-add-version-before-you-can-edit-the-cluster'
            defaultMessage='Could not find any Elasticsearch versions. You need to {addVersion} before you can edit the cluster.'
            values={{
              addVersion: (
                <Link to={elasticStackVersionsUrl(regionId)}>
                  <FormattedMessage
                    id='edit-cluster-simple.add-an-elasticsearch-version'
                    defaultMessage='add an Elasticsearch version'
                  />
                </Link>
              ),
            }}
          />
        </CuiAlert>
      )
    }

    return <EditClusterContent {...this.props} />
  }
}

export default withStackDeploymentRouteParams<Props>(EditClusterFormBased)
