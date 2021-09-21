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

import React, { ChangeEventHandler, ReactNode, FunctionComponent, CSSProperties } from 'react'
import cx from 'classnames'

import { EuiFlexItem, EuiToolTip } from '@elastic/eui'
import { defineMessages, WrappedComponentProps, injectIntl } from 'react-intl'

interface Props extends WrappedComponentProps {
  name: string
  value: string
  tabIndex: number
  option: {
    disabled: boolean
    value: string
    text: ReactNode
  }
  isActive: boolean
  isMet: boolean
  onChange: ChangeEventHandler<HTMLInputElement>
  children: ReactNode
  isPastTrialThreshold?: boolean
  style?: CSSProperties
}

const messages = defineMessages({
  requireAccount: {
    id: 'edit-deployment-slider.require-account',
    defaultMessage: 'Requires subscription',
  },
})

const SliderLabel: FunctionComponent<Props> = ({
  name,
  value,
  tabIndex,
  option,
  isActive,
  isMet,
  onChange,
  isPastTrialThreshold,
  intl: { formatMessage },
  children,
  style,
}: Props) => {
  const classes = {
    'discreteSlider-label-button': true,
    'discreteSlider-label-button-active': isActive,
    'discreteSlider-label-button-met': isMet,
    'discreteSlider-label-button-isTrial': isPastTrialThreshold,
  }

  const id = `${name}-${value}`

  const label = isPastTrialThreshold ? (
    <EuiToolTip position='bottom' content={formatMessage(messages.requireAccount)}>
      <label htmlFor={id} className={cx(classes)} data-value={option.value}>
        <span>{option.text}</span>
      </label>
    </EuiToolTip>
  ) : (
    <label htmlFor={id} className={cx(classes)} data-value={option.value}>
      <span>{option.text}</span>
    </label>
  )

  return (
    <EuiFlexItem className='discreteSlider-label' style={style}>
      <input
        type='radio'
        role='radio'
        tabIndex={tabIndex}
        id={id}
        value={value}
        checked={isActive}
        disabled={option.disabled === true}
        aria-checked={isActive}
        aria-disabled={option.disabled === true}
        onChange={onChange}
      />

      {label}

      {children}
    </EuiFlexItem>
  )
}

export default injectIntl(SliderLabel)
