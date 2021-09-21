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

import React, { ReactNode, FunctionComponent } from 'react'
import cx from 'classnames'

import { EuiAccordion } from '@elastic/eui'

import CuiAccordionButton from './AccordionButton'

import './accordion.scss'

interface Props {
  id: string
  hideButtonWhenOpen?: boolean
  className?: string
  buttonContent?: ReactNode
  title?: any
  initialIsOpen: boolean
  isOpen: boolean
  onToggle: () => void
}

export const CuiAccordion: FunctionComponent<Props> = ({
  id,
  children,
  className,
  buttonContent,
  title,
  initialIsOpen,
  isOpen,
  onToggle,
  ...rest
}) => (
  <div data-test-id={className}>
    <EuiAccordion
      id={id}
      onToggle={() => onToggle()}
      className={cx(`cuiAccordion`, className)}
      initialIsOpen={initialIsOpen}
      buttonContent={
        <CuiAccordionButton isOpen={isOpen} title={title}>
          {buttonContent}
        </CuiAccordionButton>
      }
      {...rest}
    >
      {children}
    </EuiAccordion>
  </div>
)
