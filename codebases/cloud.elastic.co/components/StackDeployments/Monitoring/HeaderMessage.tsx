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

import React from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiTitle, EuiSpacer, EuiText } from '@elastic/eui'

import DocLink from '../../../components/DocLink'

const HeaderMessage = () => (
  <div>
    <EuiTitle size='s'>
      <h2>
        <FormattedMessage
          id='deployment-monitoring-enable.ship-to-deployment'
          defaultMessage='Ship to a deployment'
        />
      </h2>
    </EuiTitle>
    <EuiSpacer size='s' />
    <EuiText color='subdued' grow={false}>
      <FormattedMessage
        id='deployment-monitoring-enable.ship-to-deployment-desc'
        defaultMessage='Ship logs and monitoring metrics to a deployment where they are stored separately. Then, you can enable additional log types, search the logs, configure retention periods, and use Kibana to view monitoring visualizations. {learnMore}'
        values={{
          learnMore: (
            <DocLink link='enableMonitoringDocLink'>
              <FormattedMessage
                id='deployment-configure.logs-and-metrics.learn-more'
                defaultMessage='Learn more'
              />
            </DocLink>
          ),
        }}
      />
    </EuiText>
  </div>
)

export default HeaderMessage
