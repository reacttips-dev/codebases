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
import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { EuiFlexItem, EuiFlexGroup } from '@elastic/eui'

import DeploymentGettingStartedTitle from './DeploymentGettingStartedTitle'
import VideoPlayer from '../../VideoPlayer'

import './deploymentGettingStarted.scss'

type Props = {
  planInProgress: boolean
}

const DeploymentGettingStartedVideo: FunctionComponent<Props> = ({ planInProgress }) => {
  const title = (
    <FormattedMessage
      id='deployment-waiting-experience.title.discover'
      defaultMessage='Discover what you can do with Elastic'
    />
  )
  const helpText = (
    <FormattedMessage
      id='deployment-waiting-experience.while-waiting'
      defaultMessage={`While you're waiting,`}
    />
  )
  return (
    <EuiFlexGroup direction='column'>
      <EuiFlexItem>
        <DeploymentGettingStartedTitle
          title={title}
          helpText={planInProgress ? helpText : undefined}
        />
      </EuiFlexItem>

      <VideoPlayer uuid='fPzN7ZgKG1NkwzxjfQDWYr' />
    </EuiFlexGroup>
  )
}

export default DeploymentGettingStartedVideo
