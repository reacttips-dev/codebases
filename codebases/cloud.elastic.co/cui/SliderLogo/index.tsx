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
import { injectIntl, WrappedComponentProps } from 'react-intl'

import { EuiIcon, IconSize, EuiToolTip } from '@elastic/eui'

import { getSliderPrettyName, getSliderIconType } from '../../lib/sliders'

import { SliderInstanceType, SliderNodeType, VersionNumber } from '../../types'

interface Props extends WrappedComponentProps {
  sliderInstanceType: SliderInstanceType
  sliderNodeType?: SliderNodeType
  version?: VersionNumber | null
  showTooltip?: boolean
  size?: IconSize
  className?: string
}

const CuiSliderLogo: FunctionComponent<Props> = ({
  sliderInstanceType,
  sliderNodeType,
  version,
  showTooltip = false,
  size = `m`,
  className,
  intl,
}) => {
  const iconType = getSliderIconType({ sliderInstanceType, sliderNodeType })

  const label = intl.formatMessage(
    getSliderPrettyName({ sliderInstanceType, sliderNodeType, version }),
  )
  const icon = <EuiIcon type={iconType} size={size} aria-label={label} className={className} />

  if (!showTooltip) {
    return icon
  }

  return <EuiToolTip content={label}>{icon}</EuiToolTip>
}

const CuiSliderLogoWithIntl = injectIntl(CuiSliderLogo)

export { CuiSliderLogoWithIntl as CuiSliderLogo }
