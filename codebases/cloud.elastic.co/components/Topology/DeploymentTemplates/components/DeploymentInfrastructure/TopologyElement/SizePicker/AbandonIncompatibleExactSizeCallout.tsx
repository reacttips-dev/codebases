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
import { min } from 'lodash'
import { defineMessages, FormattedMessage } from 'react-intl'

import { EuiButton, EuiCallOut, EuiSpacer, EuiText } from '@elastic/eui'

import prettySize from '../../../../../../../lib/prettySize'

import { Props as SizePickerProps } from './SizePicker'

const messages = defineMessages({
  exactSizeWarning: {
    id: 'create-deployment-configure.exact-size-warning-title',
    defaultMessage: 'The way we handle sizing has changed',
  },
  exactSizeDescription: {
    id: 'create-deployment-configure.exact-size-description',
    defaultMessage:
      'This configuration currently has { instanceCount } { instanceCount, plural, one {instance} other {instances} } with { size } memory capacity. We now handle sizing a bit differently, so be careful if you want to change the size of this configuration.',
  },
  abandonExactSize: {
    id: 'create-deployment-configure.abandon-exact-size',
    defaultMessage: 'I understand. Let me change the size.',
  },
})

const AbandonIncompatibleExactSizeCallout: React.FunctionComponent<SizePickerProps> = ({
  exactSize,
  exactInstanceCount,
  onChangeSize,
  sizes,
}) => {
  return (
    <div data-test-id='exact-size-interstitial'>
      <EuiCallOut iconType='alert' title={<FormattedMessage {...messages.exactSizeWarning} />}>
        <EuiText>
          <FormattedMessage
            {...messages.exactSizeDescription}
            values={{
              size: prettySize(exactSize),
              instanceCount: exactInstanceCount,
            }}
          />
        </EuiText>

        <EuiSpacer size='s' />

        <EuiButton onClick={() => abandonExactSizing()}>
          <FormattedMessage {...messages.abandonExactSize} />
        </EuiButton>
      </EuiCallOut>
    </div>
  )

  function abandonExactSizing() {
    onChangeSize(min(sizes)!)
  }
}

export default AbandonIncompatibleExactSizeCallout
