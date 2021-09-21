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

import React, { FunctionComponent, ReactElement } from 'react'

import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui'

import CopyButton from '../../CopyButton'

import './remoteClusterLink.scss'

export type Props = {
  title: ReactElement
  description: ReactElement
  endpoint: string
}

const RemoteClusterLink: FunctionComponent<Props> = ({ title, description, endpoint }) => (
  <EuiFlexGroup alignItems='center'>
    <EuiFlexItem className='remote-cluster-link-heading'>
      <CopyButton color='primary' value={endpoint}>
        {title}
      </CopyButton>
    </EuiFlexItem>
    <EuiFlexItem>{description}</EuiFlexItem>
  </EuiFlexGroup>
)

export default RemoteClusterLink
