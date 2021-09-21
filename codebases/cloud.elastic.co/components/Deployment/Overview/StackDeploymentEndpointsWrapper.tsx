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

import React, { Fragment, FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiFlexItem } from '@elastic/eui'

import CloudId from './CloudId'

import ApplicationLinks from '../../StackDeployments/StackDeploymentApplicationLinks'

import { getCloudId } from '../../../lib/stackDeployments/selectors'

import { StackDeployment } from '../../../types'

import './overview.scss'

type Props = {
  deployment: StackDeployment
}

const StackDeploymentEndpointsWrapper: FunctionComponent<Props> = ({ deployment }) => {
  const applicationLinksTitle = (
    <FormattedMessage id='applicationLinks.title' defaultMessage='Applications' />
  )
  const cloudId = getCloudId({ deployment })

  return (
    <Fragment>
      <EuiFlexItem className='deploymentOverview-Applications'>
        <ApplicationLinks title={applicationLinksTitle} deployment={deployment} />
      </EuiFlexItem>

      {cloudId && (
        <EuiFlexItem grow={false}>
          <CloudId cloudId={cloudId} />
        </EuiFlexItem>
      )}
    </Fragment>
  )
}

export default StackDeploymentEndpointsWrapper
