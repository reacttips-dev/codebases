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

import { isEmpty } from 'lodash'

import React, { FunctionComponent, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'

import { EuiSpacer } from '@elastic/eui'

import { CuiAlert } from '../../../cui'

import ExternalLink from '../../ExternalLink'

import DeprecationDetails from './DeprecationDetails'

import { countByLevel, getDeprecationLevel, DeprecationCounts } from './deprecationUtils'

import { getFirstSliderClusterFromGet } from '../../../lib/stackDeployments'
import { kibanaUpgradeAssistantUrl } from '../../../lib/serviceProviderDeepLinks'

import messages from './messages'

import { Url, StackDeployment, DeprecationsResponse } from '../../../types'
import { KibanaResourceInfo } from '../../../lib/api/v1/types'

import './deprecations.scss'

const renderKibanaMessage = (
  hasKibana: boolean | null,
  kibanaRoute: Url | null,
  deployment: StackDeployment,
) => {
  if (hasKibana) {
    const kibana = getFirstSliderClusterFromGet<KibanaResourceInfo>({
      deployment,
      sliderInstanceType: `kibana`,
    })

    return (
      <span data-test-id='deprecations-with-kibana'>
        <FormattedMessage
          {...messages.goToKibana}
          values={{
            kibana: (
              <ExternalLink href={kibanaUpgradeAssistantUrl({ resource: kibana })}>
                Kibana
              </ExternalLink>
            ),
          }}
        />
      </span>
    )
  }

  return (
    <span data-test-id='deprecations-without-kibana'>
      <FormattedMessage
        {...messages.enableKibana}
        values={{
          enableKibana: (
            <Link to={kibanaRoute!}>
              <FormattedMessage {...messages.enableKibanaText} />
            </Link>
          ),
        }}
      />
    </span>
  )
}

export type Props = {
  deprecations?: DeprecationsResponse
  hasKibana: boolean | null
  kibanaRoute: Url | null
  deployment: StackDeployment
}

const Deprecations: FunctionComponent<Props> = ({
  deprecations,
  hasKibana,
  kibanaRoute,
  deployment,
}) => {
  if (deprecations == null || isEmpty(deprecations)) {
    return null
  }

  const totalsByLevel = countByLevel(deprecations)
  const renderContent = getDeprecationRenderer(deprecations)
  const alertLevel = getDeprecationLevel(deprecations)

  // When no critical or warning issues are found, omit the Kibana message since it's confusing
  // to say "nothing to do" and yet also say "you might want to go do something".
  const kibanaMessage =
    alertLevel === `info` ? null : renderKibanaMessage(hasKibana, kibanaRoute, deployment)

  return (
    <Fragment>
      <EuiSpacer size='m' />

      <div className='deprecations' data-test-id='deprecations'>
        <CuiAlert type={alertLevel} details={<DeprecationDetails data={deprecations} />}>
          {renderContent(totalsByLevel)}

          {` `}

          {kibanaMessage}

          {` `}

          <ExternalLink
            className='learn-more-link'
            href='https://www.elastic.co/guide/en/kibana/6.7/upgrade-assistant.html'
          >
            <FormattedMessage {...messages.learnMore} />
          </ExternalLink>
        </CuiAlert>
      </div>
    </Fragment>
  )
}

export default Deprecations

function buildDeprecationRenderer({
  type,
  testID,
  messageWithoutOthers,
  messageWithOthers,
}: {
  type?: keyof DeprecationCounts
  testID: string
  messageWithoutOthers: { id; defaultMessage }
  messageWithOthers?: { id; defaultMessage }
}): (counts: DeprecationCounts) => JSX.Element {
  return (counts: DeprecationCounts) => {
    const hasOtherIssues =
      type && Object.entries(counts).filter(([key, value]) => key !== type && value).length
    const message = hasOtherIssues ? messageWithOthers : messageWithoutOthers

    return (
      <span data-test-id={testID}>
        <FormattedMessage {...message} />
      </span>
    )
  }
}

function getDeprecationRenderer(
  deprecations: DeprecationsResponse,
): (counts: DeprecationCounts) => JSX.Element {
  const level = getDeprecationLevel(deprecations)

  if (level === `error`) {
    return buildDeprecationRenderer({
      type: 'critical',
      testID: 'cannot-upgrade',
      messageWithoutOthers: messages.criticalIssues,
      messageWithOthers: messages.criticalAndOtherIssues,
    })
  }

  if (level === `warning`) {
    return buildDeprecationRenderer({
      type: 'warning',
      testID: 'deprecation-warnings',
      messageWithoutOthers: messages.warningIssues,
      messageWithOthers: messages.warningAndOtherIssues,
    })
  }

  return buildDeprecationRenderer({
    testID: 'other-deprecations',
    messageWithoutOthers: messages.otherIssues,
  })
}
