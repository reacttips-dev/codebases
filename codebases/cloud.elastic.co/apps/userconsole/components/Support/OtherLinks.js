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

import React from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiText } from '@elastic/eui'

import ExternalLink from '../../../../components/ExternalLink'
import DocLink from '../../../../components/DocLink'

export default function OtherLinks({ showDoc }) {
  return (
    <fieldset className='help-otherLinksContainer'>
      <legend className='help-otherLinksTitle'>
        <EuiText>
          <FormattedMessage id='help.other-links' defaultMessage='Helpful Links' />
        </EuiText>
      </legend>
      <div className='help-otherLinksInnerContainer'>
        <DocLink link='gettingStartedDocLink' showExternalLinkIcon={false}>
          <FormattedMessage id='help.getting-started' defaultMessage='Getting Started' />
        </DocLink>
        {showDoc && (
          <DocLink link='helpDocLink' showExternalLinkIcon={false}>
            <FormattedMessage id='help.docs.title' defaultMessage='Documentation' />
          </DocLink>
        )}
        <DocLink link='faqGettingStarted' showExternalLinkIcon={false}>
          <FormattedMessage id='help.faq' defaultMessage='FAQ' />
        </DocLink>
        {showDoc ? (
          <ExternalLink
            showExternalLinkIcon={false}
            href='https://www.elastic.co/support/welcome/cloud'
          >
            <FormattedMessage
              id='help.support-policy-standard.title'
              defaultMessage='Support Policy'
            />
          </ExternalLink>
        ) : (
          <ExternalLink
            showExternalLinkIcon={false}
            href='https://www.elastic.co/legal/support_policy/cloud_premium'
          >
            <FormattedMessage
              id='help.support-policy-premium.title'
              defaultMessage='Premium Support Policy'
            />
          </ExternalLink>
        )}
        <ExternalLink showExternalLinkIcon={false} href='https://cloud-status.elastic.co/'>
          <FormattedMessage id='help.status' defaultMessage='Service Status' />
        </ExternalLink>
      </div>
    </fieldset>
  )
}
