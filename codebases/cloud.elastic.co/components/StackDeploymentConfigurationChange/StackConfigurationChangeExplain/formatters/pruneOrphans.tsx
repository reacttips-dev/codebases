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

import { EuiTextColor } from '@elastic/eui'

import { getSliderPrettyName } from '../../../../lib/sliders'

import { DifferenceFormatter } from '../types'
import { Difference } from '../../../../lib/stackDeployments/planDiffs/types'

export const pruneOrphansFormatter: DifferenceFormatter = {
  formatter: ({ difference, isPastHistory }) => {
    const { meta } = difference as Difference<{ currentVersion: string }>
    const { currentVersion } = meta!
    return {
      id: `${difference.target}-pruned-out`,
      type: difference.target,
      message: (
        <EuiTextColor color={isPastHistory ? 'default' : 'danger'}>
          <FormattedMessage
            id='explain-changes.deployment-resource-pruned-out'
            defaultMessage='Delete {sliderPrettyName} resource'
            values={{
              sliderPrettyName: (
                <FormattedMessage
                  {...getSliderPrettyName({
                    sliderInstanceType: difference.target,
                    version: currentVersion,
                  })}
                />
              ),
            }}
          />
        </EuiTextColor>
      ),
    }
  },
  handles: `resource-pruned-out`,
}
