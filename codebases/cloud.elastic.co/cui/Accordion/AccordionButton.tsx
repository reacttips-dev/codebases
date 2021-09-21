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
import { FormattedMessage } from 'react-intl'

import { EuiTitle, EuiFlexGroup, EuiFlexItem, EuiText } from '@elastic/eui'

import './accordion.scss'

interface ButtonProps {
  title?: any
  isOpen: boolean
}

const CuiAccordionButton: FunctionComponent<ButtonProps> = ({ title, isOpen, children }) => (
  <EuiFlexGroup gutterSize='s' className='cuiAccordion-button'>
    {!isOpen && (
      <EuiFlexItem className='accordion-content' grow={false}>
        <div>{children}</div>
      </EuiFlexItem>
    )}

    <EuiFlexItem grow={false} className='cuiAccordion-expand'>
      <EuiText size='s'>
        <FormattedMessage id='accordion-button.expand' defaultMessage='Edit settings' />
      </EuiText>
    </EuiFlexItem>

    <EuiFlexItem grow={false} className='cuiAccordion-collapse'>
      <EuiFlexGroup responsive={false} alignItems='center' gutterSize='s'>
        {title && (
          <EuiFlexItem>
            <EuiTitle size='s'>
              <h2>{title}</h2>
            </EuiTitle>
          </EuiFlexItem>
        )}
        <EuiFlexItem>
          <EuiText size='s'>
            <FormattedMessage id='accordion-button.collapse' defaultMessage='Hide' />
          </EuiText>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiFlexItem>
  </EuiFlexGroup>
)

export default CuiAccordionButton
