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

import { EuiIcon, EuiText, EuiSpacer } from '@elastic/eui'

import ExternalLink from '../../components/ExternalLink'

import './landingPage.scss'

const SupportFooter: FunctionComponent = () => (
  <div className='landing-page-support'>
    <EuiText size='s'>
      <EuiIcon type='logoElastic' size='xxl' className='landing-page-elasticLogo' />

      <EuiSpacer size='xl' />

      <FormattedMessage
        id='landing-page.support'
        defaultMessage='Have questions? Email us at { link }'
        values={{
          link: (
            <a href='mailto:support@elastic.co?subject=Elastic%20Cloud%20Query'>
              support@elastic.co
            </a>
          ),
        }}
      />

      <EuiSpacer size='m' />

      <div className='landing-page-privacy'>
        <div>
          <FormattedMessage
            id='landing-page.links'
            defaultMessage='{ trademark } · { terms } · { privacy } · { brand }'
            values={{
              trademark: (
                <ExternalLink
                  className='landing-page-link'
                  href='https://www.elastic.co/legal/trademarks'
                >
                  <FormattedMessage
                    id='landing-page-privacy.trademark'
                    defaultMessage='Trademarks'
                  />
                </ExternalLink>
              ),
              terms: (
                <ExternalLink
                  className='landing-page-link'
                  href='https://www.elastic.co/legal/terms-of-use'
                >
                  <FormattedMessage id='landing-page-privacy.terms' defaultMessage='Terms of Use' />
                </ExternalLink>
              ),
              privacy: (
                <ExternalLink
                  className='landing-page-link'
                  href='https://www.elastic.co/legal/privacy-statement'
                >
                  <FormattedMessage id='landing-page-privacy.privacy' defaultMessage='Privacy' />
                </ExternalLink>
              ),
              brand: (
                <ExternalLink className='landing-page-link' href='https://www.elastic.co/brand'>
                  <FormattedMessage id='landing-page-privacy.brand' defaultMessage='Brand' />
                </ExternalLink>
              ),
            }}
          />
        </div>

        <div>
          <FormattedMessage
            id='landing-page.rights'
            defaultMessage='© 2021. All Rights Reserved – Elasticsearch'
          />
        </div>

        <div>
          <FormattedMessage
            id='landing-page.gdp3'
            defaultMessage='Elasticsearch is a trademark of Elasticsearch BV, registered in the U.S. and in other countries.'
          />
        </div>

        <div>
          <FormattedMessage
            id='landing-page.apache'
            defaultMessage='Apache, Apache Lucene, Apache Hadoop, Hadoop, HDFS and the yellow elephant logo are trademarks of the { apache } in the United States and/or other countries.'
            values={{
              apache: (
                <ExternalLink className='landing-page-link' href='http://www.apache.org/'>
                  <FormattedMessage
                    id='landing-page-privacy.apach'
                    defaultMessage='Apache Software Foundation'
                  />
                </ExternalLink>
              ),
            }}
          />
        </div>
      </div>
    </EuiText>
  </div>
)

export default SupportFooter
