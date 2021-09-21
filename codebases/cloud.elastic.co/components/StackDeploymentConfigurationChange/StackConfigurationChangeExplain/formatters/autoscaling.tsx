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

import { DifferenceFormatter } from '../types'

export const autoscalingEnabledFormatter: DifferenceFormatter = {
  formatter: () => ({
    id: `deployment-enable-autoscaling`,
    type: 'deployment',
    message: (
      <FormattedMessage
        id='explain-changes.deployment-autoscaling-enable'
        defaultMessage='Enable autoscaling'
      />
    ),
  }),
  handles: `autoscaling-enabled`,
}

export const autoscalingDisabledFormatter: DifferenceFormatter = {
  formatter: () => ({
    id: `deployment-disable-autoscaling`,
    type: 'deployment',
    message: (
      <FormattedMessage
        id='explain-changes.deployment-autoscaling-disable'
        defaultMessage='Disable autoscaling'
      />
    ),
  }),
  handles: `autoscaling-disabled`,
}
