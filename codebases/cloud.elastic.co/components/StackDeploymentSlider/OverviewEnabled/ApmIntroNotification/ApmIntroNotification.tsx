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

import { EuiButton, EuiCallOut, EuiSpacer } from '@elastic/eui'

import ExternalLink from '../../../../components/ExternalLink'

import { getFirstSliderClusterFromGet, isStopped } from '../../../../lib/stackDeployments/selectors'

import { kibanaApmTutorialUrl } from '../../../../lib/serviceProviderDeepLinks'

import { StackDeployment } from '../../../../types'
import { KibanaResourceInfo } from '../../../../lib/api/v1/types'

export type Props = {
  deployment: StackDeployment
  dismissNotification: () => void
  notificationMessage: { dismissed: boolean | null }
}

const IntroNotification: FunctionComponent<Props> = ({
  deployment,
  dismissNotification,
  notificationMessage: { dismissed },
}) => {
  if (dismissed) {
    return null
  }

  const kibana = getFirstSliderClusterFromGet<KibanaResourceInfo>({
    deployment,
    sliderInstanceType: `kibana`,
  })!

  const instructionsLink = !isStopped({ resource: kibana })
    ? kibanaApmTutorialUrl({ resource: kibana })
    : `https://www.elastic.co/guide/en/apm/agent/index.html` // Link to APM Agent docs outside of users' kibana cluster if kibana is down

  return (
    <Fragment>
      <EuiCallOut>
        <p>
          <FormattedMessage
            id='apm-intro-notification.message'
            defaultMessage='Complete your APM configuration by creating and installing APM Agents. { installInstructions }.'
            values={{
              installInstructions: (
                <ExternalLink href={instructionsLink}>
                  <FormattedMessage id='apm-intro-notification.link' defaultMessage='Launch APM' />
                </ExternalLink>
              ),
            }}
          />
        </p>
        <EuiButton onClick={() => dismissNotification()}>
          <FormattedMessage id='apm-intro-notification.button' defaultMessage='Dismiss' />
        </EuiButton>
      </EuiCallOut>
      <EuiSpacer />
    </Fragment>
  )
}

export default IntroNotification
