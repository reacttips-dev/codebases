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

import { EuiIcon, EuiIconProps } from '@elastic/eui'

import { StrictOmit } from '../../lib/ts-essentials'
import { Theme } from '../../types'

type Props = {
  theme: Theme
  darkType: EuiIconProps['type']
  lightType: EuiIconProps['type']
} & StrictOmit<EuiIconProps, 'type'>

export const CuiThemedIcon: FunctionComponent<Props> = ({
  theme,
  darkType,
  lightType,
  ...rest
}) => <EuiIcon type={theme === 'dark' ? darkType : lightType} {...rest} />
