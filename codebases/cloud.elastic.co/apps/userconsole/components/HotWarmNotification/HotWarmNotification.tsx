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

import { EuiButton, EuiCallOut, EuiSpacer } from '@elastic/eui'
import { FormattedMessage } from 'react-intl'
import ExternalLink from '../../../../components/ExternalLink'

export type Props = {
  dismissNotification: () => void
  notificationMessage: { dismissed: boolean | null }
  notificationEligible: boolean
}

const HotWarmNotification: FunctionComponent<Props> = (props) => {
  const {
    dismissNotification,
    notificationMessage: { dismissed },
    notificationEligible,
  } = props

  if (!dismissed && notificationEligible) {
    return (
      <Fragment>
        <EuiCallOut
          color='success'
          title={
            <FormattedMessage
              id='hot-warm.title'
              defaultMessage='We’ve increased storage on all hot-warm deployments at no extra cost!'
            />
          }
          iconType='document'
        >
          <p>
            <FormattedMessage
              id='hot-warm.message'
              defaultMessage="The RAM to storage ratio for warm nodes in hot-warm deployments is up from 1:100 to 1:160, giving you 60% more storage. No action is required, we've already applied this update to all your deployments on Elasticsearch Service. {LearnMore}"
              values={{
                LearnMore: (
                  <ExternalLink href='https://www.elastic.co/blog/free-elasticsearch-service-hot-warm-upgrade'>
                    <FormattedMessage id='hot-warm-changes-link' defaultMessage='Learn more' />
                  </ExternalLink>
                ),
              }}
            />
          </p>

          <EuiButton size='s' color='secondary' onClick={() => dismissNotification()}>
            <FormattedMessage id='hot-warm.button' defaultMessage='Dismiss' />
          </EuiButton>
        </EuiCallOut>

        <EuiSpacer />
      </Fragment>
    )
  }

  return null
}

export default HotWarmNotification
