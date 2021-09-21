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

import React, { ReactNode } from 'react'
import { FormattedMessage, defineMessages } from 'react-intl'
import cx from 'classnames'

import { EuiRadioGroup, EuiTextColor, EuiToolTip, EuiText } from '@elastic/eui'

import { getSliderTrialLimit } from '../../../../../../../lib/sliders'

import { SliderInstanceType, SliderNodeType } from '../../../../../../../types'
import { isHeroku } from '../../../../../../../lib/heroku'

const messages = defineMessages({
  zonesLabel: {
    id: `deploymentInfrastructure-topologyElement-zoneCount-optionLabel`,
    defaultMessage: `{ zones } { zones, plural, one {zone} other {zones} }`,
  },
  requiresPaid: {
    id: `deploymentInfrastructure-topologyElement-zoneCount-requiresPaid`,
    defaultMessage: `Requires subscription`,
  },
})

export type Props = {
  id: string
  zoneCount: number
  maxZoneCount: number
  onChange: (value: number) => void
  inTrial: boolean
  showTrialThreshold: boolean
  disabled?: boolean
  sliderInstanceType: SliderInstanceType
  sliderNodeTypes?: SliderNodeType[]
  isDedicatedMaster: boolean
  dedicatedMastersFixedZoneCount: number | null
}

const ZoneCount: React.FunctionComponent<Props> = ({
  id,
  zoneCount = 1,
  maxZoneCount,
  onChange,
  inTrial,
  showTrialThreshold,
  disabled,
  sliderInstanceType,
  sliderNodeTypes,
  isDedicatedMaster,
  dedicatedMastersFixedZoneCount,
}) => {
  const options: Array<{
    id: string
    value: string
    label: ReactNode
    disabled: boolean
  }> = []

  const trialThreshold = getSliderTrialLimit({
    inTrial,
    sliderInstanceType,
    sliderNodeTypes,
  })

  for (let i = 1; i <= maxZoneCount; i++) {
    const showTrialConversion = shouldShowTrialConversion(trialThreshold, i)

    const label = showTrialConversion ? (
      <EuiTextColor color='secondary'>
        <EuiToolTip
          position='top'
          content={<FormattedMessage {...messages.requiresPaid} values={{ zones: i }} />}
        >
          <EuiText size='s'>
            <FormattedMessage {...messages.zonesLabel} values={{ zones: i }} />
          </EuiText>
        </EuiToolTip>
      </EuiTextColor>
    ) : (
      <EuiText size='s'>
        <FormattedMessage {...messages.zonesLabel} values={{ zones: i }} />
      </EuiText>
    )
    const zone = {
      id: `fault-tolerance-for-${id}:${i}`,
      value: i.toString(),
      label,
      disabled: Boolean(
        disabled ||
          (trialThreshold && i > trialThreshold.zoneCount && !showTrialThreshold) ||
          (isDedicatedMaster && typeof dedicatedMastersFixedZoneCount === `number`),
      ),
      className: cx({
        'zoneCountOption--overTrialThreshold': trialThreshold && i > trialThreshold.zoneCount,
      }),
    }
    options.push(zone)
  }

  return (
    <EuiRadioGroup
      className='deploymentInfrastructure-topologyElement-zoneCount'
      data-test-subj='topologyElement-zoneCount'
      name={`fault-tolerance-for-${id}`}
      idSelected={`fault-tolerance-for-${id}:${zoneCount}`}
      options={options}
      onChange={(_, value) => onChange(parseInt(value!, 10))}
      disabled={disabled || isHeroku()}
    />
  )

  function shouldShowTrialConversion(trialThreshold, i) {
    if (!showTrialThreshold) {
      return false
    }

    if (!trialThreshold) {
      return false
    }

    return i > trialThreshold.zoneCount
  }
}

export default ZoneCount
