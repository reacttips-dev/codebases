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

import React, { Fragment, FunctionComponent, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import {
  EuiBadge,
  EuiCheckbox,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormHelpText,
  EuiSpacer,
  htmlIdGenerator,
} from '@elastic/eui'

type Props = {
  name: ReactNode
  description: ReactNode
  checked: boolean
  indeterminate: boolean
  onChange: () => void
  ['data-test-id']?: string
}

const makeId = htmlIdGenerator()

const VacateOption: FunctionComponent<Props> = ({
  name,
  description,
  checked,
  indeterminate,
  onChange,
  children,
  'data-test-id': dataTestId,
}) => (
  <div data-test-id={dataTestId}>
    <EuiCheckbox
      id={makeId()}
      label={
        <Fragment>
          <EuiFlexGroup gutterSize='none' alignItems='center' justifyContent='spaceBetween'>
            <EuiFlexItem grow={false}>{name}</EuiFlexItem>

            {indeterminate && (
              <EuiFlexItem grow={false}>
                <div>
                  <span className='vacateOption-indeterminateSeparator'>{` `}</span>

                  <EuiBadge color='warning'>
                    <FormattedMessage
                      id='allocator-vacate-options.indeterminate-vacate-option'
                      defaultMessage='Clusters have different values for this option'
                    />
                  </EuiBadge>
                </div>
              </EuiFlexItem>
            )}
          </EuiFlexGroup>

          <EuiFormHelpText>{description}</EuiFormHelpText>
        </Fragment>
      }
      checked={checked}
      indeterminate={indeterminate}
      onChange={onChange}
    />

    {checked && !indeterminate && children ? (
      <Fragment>
        <EuiSpacer size='s' />

        {children}
      </Fragment>
    ) : null}
  </div>
)

export default VacateOption
