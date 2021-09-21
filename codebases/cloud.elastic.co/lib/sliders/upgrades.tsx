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

import DocLink from '../../components/DocLink'

import { getSliderPrettyName } from './messages'
import { isSliderEnabledInStackDeployment } from './stackDeployments'

import { SliderInstanceType, StackDeployment } from '../../types'
import { getVersion } from '../stackDeployments/selectors/fundamentals'

const slidersRequiringReadOnlyUpgrades: SliderInstanceType[] = [`appsearch`, `enterprise_search`]

export const getReadOnlyMessage = ({ deployment }: { deployment: StackDeployment }) => {
  for (const sliderInstanceType of slidersRequiringReadOnlyUpgrades) {
    const hasSlider = isSliderEnabledInStackDeployment(deployment, sliderInstanceType)

    if (!hasSlider) {
      continue
    }

    const version = getVersion({ deployment })

    return (
      <FormattedMessage
        id='upgradable-deployment-version.readonly-mode'
        defaultMessage='Performing this upgrade will set {sliderPrettyName} into read-only mode. This will cause any request trying to modify data on the system to fail for the duration of the upgrade. {docLink}'
        values={{
          sliderPrettyName: (
            <FormattedMessage {...getSliderPrettyName({ sliderInstanceType, version })} />
          ),
          docLink: (
            <DocLink link='readonlyAppSearchEnterpriseSearch'>
              <FormattedMessage
                id='upgradable-deployment-version.readonly.learnmore'
                defaultMessage='Learn more'
              />
            </DocLink>
          ),
        }}
      />
    )
  }

  return null
}
