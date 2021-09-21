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

import { EuiPanel, EuiSpacer, EuiText, EuiTitle } from '@elastic/eui'

import ExternalLink from '../ExternalLink'

import './userRegistration.scss'

const OnPremPanel: FunctionComponent = () => {
  const downloadLink =
    'https://www.elastic.co/downloads?storm=on-premise&elektra=cloud-registration'

  return (
    <EuiPanel
      className='cloud-signup-page-panel cloud-signup-page-on-prem-panel cloud-signup-page-panel-narrow'
      hasShadow={true}
    >
      <EuiTitle size='xs' className='cloud-signup-page-on-prem-title'>
        <h2>
          <FormattedMessage
            id='cloud-signup-page.on-prem-title'
            defaultMessage='Looking for on-premise?'
          />
        </h2>
      </EuiTitle>

      <EuiSpacer size='m' />

      <EuiText size='m' textAlign='center'>
        <FormattedMessage
          id='cloud-signup-page.on-prem-description'
          defaultMessage='Manage Elastic solutions yourself by checking out our {downloads}.'
          values={{
            downloads: (
              <ExternalLink href={downloadLink}>
                <FormattedMessage
                  id='cloud-signup-page.on-prem-description-download'
                  defaultMessage='downloads'
                />
              </ExternalLink>
            ),
          }}
        />
      </EuiText>
    </EuiPanel>
  )
}

export default OnPremPanel
