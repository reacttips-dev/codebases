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
import { EuiText } from '@elastic/eui'
import { FormattedMessage } from 'react-intl'
import ExternalLink from '../ExternalLink'
import { termOfService } from '../../apps/userconsole/urls'

const TermsOfService: FunctionComponent = () => (
  <EuiText className='terms-of-service' textAlign='center' color='subdued' size='s'>
    <FormattedMessage
      id='terms-of-service.privacy-description'
      defaultMessage="By signing up, you acknowledge that you've read and agree to our {termsOfService} and {privacyStatement}."
      values={{
        termsOfService: (
          <ExternalLink showExternalLinkIcon={false} href={termOfService}>
            <FormattedMessage id='terms-of-service.link' defaultMessage='Terms of Service' />
          </ExternalLink>
        ),
        privacyStatement: (
          <ExternalLink
            showExternalLinkIcon={false}
            href='https://www.elastic.co/legal/privacy-statement'
          >
            <FormattedMessage
              id='terms-of-service.privacy-statement-link'
              defaultMessage='Privacy Statement'
            />
          </ExternalLink>
        ),
      }}
    />
  </EuiText>
)

export default TermsOfService
