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
import { EuiFlexItem, EuiCard, EuiIcon, EuiButton } from '@elastic/eui'

const SupportPortalTile: FunctionComponent = () => (
  <EuiFlexItem>
    <EuiCard
      icon={<EuiIcon size='xxl' type='help' />}
      title={<FormattedMessage id='help.support-portal.title' defaultMessage='Elastic Support' />}
      description={
        <FormattedMessage
          id='help.support-portal.description'
          defaultMessage='Get help directly from the creators of the Elastic Stack.'
        />
      }
      footer={
        <EuiButton href='https://support.elastic.co/' target='_blank' rel='noopener noreferrer'>
          <FormattedMessage id='help.support-portal.button' defaultMessage='Get support' />
        </EuiButton>
      }
    />
  </EuiFlexItem>
)

export default SupportPortalTile
