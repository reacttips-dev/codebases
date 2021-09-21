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

import React, { Fragment, FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { EuiCallOut, EuiSpacer } from '@elastic/eui'

import { isGCPUser, isAWSUser } from '../../lib/marketPlace'

import ExternalLink from '../ExternalLink'
import { UserProfile } from '../../types'

export interface Props {
  profile: UserProfile
}

const UnSubscribedMarketPlaceUserCallout: FunctionComponent<Props> = ({ profile }) => (
  <Fragment>
    <EuiCallOut color='danger' className='stack-deployment-search-unsubscribed-user-callout'>
      {isGCPUser(profile) && getUnSubscribedGCPUserCalloutMessage()}
      {isAWSUser(profile) && getUnSubscribedAWSUserCalloutMessage()}
    </EuiCallOut>
    <EuiSpacer size='m' />
  </Fragment>
)

const getUnSubscribedGCPUserCalloutMessage = () => (
  <FormattedMessage
    id='stack-deployment-search.unsubscribed-gcp-user'
    defaultMessage='The Google Cloud project associated with your Elastic Cloud account has been disconnected. Any active deployments will be deleted soon. To create new deployments you first need to {enable}'
    values={{
      enable: (
        <ExternalLink href='https://www.elastic.co/guide/en/cloud/current/ec-billing-gcp.html#ec-billing-gcp-account-change'>
          <FormattedMessage
            id='stack-deployment-search.unsubscribed-gcp-user-link'
            defaultMessage='re-enable this account'
          />
        </ExternalLink>
      ),
    }}
  />
)

const getUnSubscribedAWSUserCalloutMessage = () => (
  <FormattedMessage
    id='stack-deployment-search.unsubscribed-aws-user'
    defaultMessage='The AWS Marketplace billing account associated with your Elastic Cloud account has been disconnected. To create a deployment you need to open a new Elastic Cloud account.'
  />
)

export default UnSubscribedMarketPlaceUserCallout
