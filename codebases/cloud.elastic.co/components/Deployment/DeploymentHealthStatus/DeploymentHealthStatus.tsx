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

import StackDeploymentHealthProblems from '../../StackDeploymentHealthProblems'

import { DeploymentGetResponse, RemoteResources } from '../../../lib/api/v1/types'

export type StateProps = {
  ccsSettings: RemoteResources | null
}

export type DispatchProps = {
  fetchCcsSettings: () => void
}

export type ConsumerProps = {
  stackDeployment: DeploymentGetResponse | null
  hideActivityBits?: boolean
  onGettingStartedPage?: boolean
  spacerAfter?: boolean
}

type AllProps = StateProps & DispatchProps & ConsumerProps

class DeploymentHealthStatus extends Component<AllProps> {
  componentDidMount(): void {
    this.props.fetchCcsSettings()
  }

  render(): JSX.Element {
    const {
      stackDeployment,
      hideActivityBits,
      onGettingStartedPage,
      spacerAfter = true,
      ccsSettings,
    } = this.props

    return (
      <StackDeploymentHealthProblems
        onGettingStartedPage={onGettingStartedPage}
        deployment={stackDeployment!}
        spacerAfter={spacerAfter}
        linkRecentChanges={true}
        hideActivityBits={hideActivityBits}
        ccsSettings={ccsSettings}
      />
    )
  }
}

export default DeploymentHealthStatus
