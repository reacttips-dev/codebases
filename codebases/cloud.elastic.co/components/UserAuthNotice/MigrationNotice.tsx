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

import { EuiCallOut, EuiSpacer, EuiText, EuiLink } from '@elastic/eui'

import ExternalLink from '../ExternalLink'

const MigrationNotice: FunctionComponent = () => (
  <div className='info-message'>
    <EuiCallOut
      iconType='pinFilled'
      size='s'
      title={
        <FormattedMessage
          data-test-id='community-info-message'
          id='info-message.title.community'
          defaultMessage='We have made a change to how you access the Elastic community events'
        />
      }
    >
      <EuiText size='xs'>
        <FormattedMessage
          id='info-message.support.description'
          defaultMessage='An Elastic Cloud account is now required to access {domain}. {learnMore}.'
          values={{
            learnMore: (
              <ExternalLink href={'https://www.elastic.co/'}>
                <FormattedMessage
                  id='info-message.support.description.learn-more'
                  defaultMessage='Learn more'
                />
              </ExternalLink>
            ),
            domain: (
              <FormattedMessage
                id='info-message.community.description.domain'
                defaultMessage='Elastic community events'
              />
            ),
          }}
        />
        <EuiSpacer size='m' />

        <ul>
          <li>
            <FormattedMessage
              id='info-message.event.description.item-1'
              defaultMessage='If you already have an Elastic community events account login using the same email address. You may be prompted to reset your password. '
            />
          </li>
          <li>
            <FormattedMessage
              id='info-message.event.description.item-2'
              defaultMessage="If you're new to Elastic community events, sign up to get started."
            />
          </li>
        </ul>

        <FormattedMessage
          id='info-message.support.description.footer'
          defaultMessage='If you are having issues accessing your account, contact {support}.'
          values={{
            support: (
              <EuiLink href='mailto:support@elastic.co?subject=Support+account+issue'>
                support@elastic.co
              </EuiLink>
            ),
          }}
        />
      </EuiText>
    </EuiCallOut>
  </div>
)

export default MigrationNotice
