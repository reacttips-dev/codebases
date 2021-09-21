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

import DeploymentGettingStartedCredentials from './DeploymentGettingStartedCredentials'
import DeploymentGettingStartedVideo from './DeploymentGettingStartedVideo'
import DelploymentGettingStartedFailed from './DeploymentGettingStartedFailed'
import ProductGif from './ProductGif'

import {
  GettingStartedType,
  StackDeployment,
  NewDeploymentCredentials,
  LinkInfo,
} from '../../../types'
import { DeploymentTemplateInfoV2 } from '../../../lib/api/v1/types'

import './deploymentGettingStarted.scss'

type DeploymentGettingStartedDetailsProps = {
  credentials?: NewDeploymentCredentials
  deployment: StackDeployment
  deploymentTemplate: DeploymentTemplateInfoV2
  instanceType: GettingStartedType
  linkInfo: LinkInfo
  planInProgress: boolean
  disabled: boolean
  planFailed: boolean
  isAnyAdminConsole: boolean
}

export type Props = DeploymentGettingStartedDetailsProps

class DeploymentGettingStartedDetails extends Component<Props> {
  state = {
    showCredentials: true,
  }

  render() {
    const {
      credentials,
      deployment,
      deploymentTemplate,
      planInProgress,
      planFailed,
      isAnyAdminConsole,
    } = this.props
    const { showCredentials } = this.state
    const displayCredentials = credentials !== undefined && showCredentials && !planFailed

    if (displayCredentials) {
      return (
        <DeploymentGettingStartedCredentials
          onContinue={() => this.setState({ showCredentials: false })}
          deployment={deployment}
          deploymentTemplate={deploymentTemplate}
        />
      )
    }

    if (planFailed) {
      return <DelploymentGettingStartedFailed deployment={deployment} />
    }

    if (isAnyAdminConsole) {
      return <ProductGif />
    }

    return <DeploymentGettingStartedVideo planInProgress={planInProgress} />
  }
}

export default DeploymentGettingStartedDetails
