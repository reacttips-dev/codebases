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

import ExternalLink from '../../../../components/ExternalLink'

const GovCloudBillingNotice: FunctionComponent = () => (
  <FormattedMessage
    id='billing-details.gov-cloud.description'
    defaultMessage='Please {contactUs} to learn more about our subscription options.'
    values={{
      contactUs: (
        <ExternalLink href='https://www.elastic.co/cloud/contact'>
          <FormattedMessage
            id='billing-details.gov-cloud.description.contact-us-link'
            defaultMessage='contact us'
          />
        </ExternalLink>
      ),
    }}
  />
)

export default GovCloudBillingNotice
