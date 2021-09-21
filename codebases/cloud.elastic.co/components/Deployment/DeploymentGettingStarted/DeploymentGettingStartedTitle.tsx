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
import React, { Fragment, ReactElement, FunctionComponent } from 'react'
import { EuiText } from '@elastic/eui'

type Props = {
  title: ReactElement
  helpText?: ReactElement
}

const DeploymentGettingStartedTitle: FunctionComponent<Props> = ({ title, helpText }) => (
  <Fragment>
    {helpText && (
      <EuiText textAlign='center' size='m' className='getting-started-title-help-text'>
        {helpText}
      </EuiText>
    )}
    <EuiText textAlign='center'>
      <h2>
        <strong>{title}</strong>
      </h2>
    </EuiText>
  </Fragment>
)

export default DeploymentGettingStartedTitle
