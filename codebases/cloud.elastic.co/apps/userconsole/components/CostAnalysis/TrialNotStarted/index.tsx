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
import { EuiFlexGroup, EuiFlexItem, EuiPanel, EuiSpacer, EuiText, EuiTitle } from '@elastic/eui'

import { CuiRouterLinkButton } from '../../../../../cui'

import CurrentHourlyRate from '../RatePanel/CurrentHourlyRate'
import { createDeploymentUrl } from '../../../../../lib/urlBuilder'

import './trialNotStarted.scss'

const TrialNotStarted: FunctionComponent = () => (
  <div className='cost-analysis-trial-not-started' data-test-id='cost-analysis-trial-not-started'>
    <EuiFlexGroup gutterSize='l'>
      <EuiFlexItem>
        <EuiPanel paddingSize='m' className='cost-analysis-get-started-panel'>
          <EuiTitle size='xs'>
            <h2>
              <FormattedMessage
                id='cost-analysis.trial-not-started.no-deployments'
                defaultMessage='Get started with Elastic'
              />
            </h2>
          </EuiTitle>

          <EuiSpacer size='m' />

          <EuiText color='subdued' size='s'>
            <FormattedMessage
              id='cost-analysis.start-trial-info'
              defaultMessage='Start your 14-day trial by creating your first deployment.'
            />
          </EuiText>

          <EuiSpacer size='m' />

          <CuiRouterLinkButton
            to={createDeploymentUrl()}
            data-test-id='cost-analysis.trial-not-started.create-a-deployment'
          >
            <FormattedMessage
              id='cost-analysis.trial-not-started.create-a-deployment'
              defaultMessage='Create a deployment'
            />
          </CuiRouterLinkButton>
        </EuiPanel>
      </EuiFlexItem>

      <EuiFlexItem>
        <CurrentHourlyRate
          info={[
            {
              text: (
                <EuiText color='subdued' size='s'>
                  <FormattedMessage
                    id='cost-analysis.trial-not-started.free-during-trial'
                    defaultMessage='FREE during trial'
                  />
                </EuiText>
              ),
            },
          ]}
          rate={0}
        />
      </EuiFlexItem>
    </EuiFlexGroup>
  </div>
)

export default TrialNotStarted
