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
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { EuiCallOut, EuiSpacer } from '@elastic/eui'

import { accountBillingUrl } from '../../../../apps/userconsole/urls'

const TrialLimitMessage: FunctionComponent = () => (
  <Fragment>
    <EuiCallOut
      data-test-id='trial-maxed-out'
      title={
        <FormattedMessage
          id='create-deployment.inTrial.title-ma'
          defaultMessage='Maximum deployments reached'
        />
      }
    >
      <FormattedMessage
        id='create-deployment.inTrial.description'
        defaultMessage='Your 14-day trial includes one deployment to start your Elasticsearch journey. Add your {billingDetails} to create multiple deployments or delete your existing deployment to make a new trial deployment.'
        values={{
          billingDetails: (
            <Link to={accountBillingUrl()}>
              <FormattedMessage
                id='create-deployment.inTrial.billing-details'
                defaultMessage='billing details'
              />
            </Link>
          ),
        }}
      />
      <EuiSpacer size='m' />
      <FormattedMessage
        id='create-deployment.inTrial.description-deleted'
        defaultMessage='Deleted but still seeing this message? Wait a few moments and refresh the page.'
      />
    </EuiCallOut>
    <EuiSpacer size='m' />
  </Fragment>
)

export default TrialLimitMessage
