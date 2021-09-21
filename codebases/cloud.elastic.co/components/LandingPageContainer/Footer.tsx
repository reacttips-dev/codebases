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

import React, { FunctionComponent, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import ExternalLink from '../ExternalLink'
import { privacyUrl, termOfService, contactUs } from '../../apps/userconsole/urls'

type Props = { cloudStatusUrl?: string }

const Footer: FunctionComponent<Props> = ({ cloudStatusUrl }) => (
  <Fragment>
    <ExternalLink showExternalLinkIcon={false} href={termOfService}>
      <FormattedMessage id='landing-page-privacy.service' defaultMessage='Terms of service' />
    </ExternalLink>
    <ExternalLink showExternalLinkIcon={false} href={privacyUrl}>
      <FormattedMessage id='landing-page-privacy.privacy' defaultMessage='Privacy' />
    </ExternalLink>
    <ExternalLink showExternalLinkIcon={false} href={contactUs}>
      <FormattedMessage id='landing-page-contact-us-link' defaultMessage='Contact us' />
    </ExternalLink>
    {cloudStatusUrl && (
      <ExternalLink showExternalLinkIcon={false} href={cloudStatusUrl}>
        <FormattedMessage
          id='landing-page-status-cloud-link'
          defaultMessage='Elastic service status'
        />
      </ExternalLink>
    )}
  </Fragment>
)

export default Footer
