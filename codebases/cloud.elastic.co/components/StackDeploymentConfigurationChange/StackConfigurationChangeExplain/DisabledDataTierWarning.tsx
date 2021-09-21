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
import { EuiCallOut, EuiSpacer } from '@elastic/eui'
import { FormattedMessage } from 'react-intl'

import { ElasticsearchClusterPlan, InstanceConfiguration } from '../../../lib/api/v1/types'
import DocLink from '../../DocLink'
import { hasDisabledDataTier } from '../../../lib/stackDeployments/dataTiers'

export type Props = {
  current?: ElasticsearchClusterPlan | null
  next?: ElasticsearchClusterPlan | null
  instanceConfigurations: InstanceConfiguration[]
  isPastHistory: boolean
  pruneOrphans?: boolean
}

export const DisabledDataTierWarning: FunctionComponent<Props> = ({
  instanceConfigurations,
  isPastHistory,
  current,
  next,
  pruneOrphans,
}) => {
  if (isPastHistory) {
    return null
  }

  const disabledDataTierInDiff = hasDisabledDataTier({
    current,
    next,
    pruneOrphans: pruneOrphans || false,
    instanceConfigurations,
  })

  if (!disabledDataTierInDiff) {
    return null
  }

  return (
    <Fragment>
      <EuiCallOut color='warning' data-test-id='disable-data-tier-warning'>
        <FormattedMessage
          id='explain-changes.disable-instance-configuration.reallocation-warning'
          defaultMessage='Disabling a data tier may require manual shard reallocation. {readMore}'
          values={{
            readMore: (
              <DocLink link='removingADataTier'>
                <FormattedMessage
                  id='explain-changes.disable-instance-configuration.with-warning.learn-more'
                  defaultMessage='Learn more'
                />
              </DocLink>
            ),
          }}
        />
      </EuiCallOut>
      <EuiSpacer size='m' />
    </Fragment>
  )
}
