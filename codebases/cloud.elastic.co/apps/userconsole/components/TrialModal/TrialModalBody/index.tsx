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

import React, { FunctionComponent, Fragment } from 'react'
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl'

import {
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiModalBody,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiModalFooter,
} from '@elastic/eui'

import ProvideBillingDetailsButton from '../ProvideBillingDetailsButton'
import TrialBillingMoreFeatures from './TrialBillingMoreFeatures'

import messages from './messages'
import unpackFeaturesIllustration from '../../../../../files/illustration-feature-packed.svg'
import unpackFeaturesIllustrationDark from '../../../../../files/illustration-feature-packed-dark.svg'

import { Theme } from '../../../../../types'

import '../trialModal.scss'

interface Props extends WrappedComponentProps {
  theme: Theme
  close: () => void
}

const TrialModalBody: FunctionComponent<Props> = ({ close, intl: { formatMessage }, theme }) => (
  <Fragment>
    <EuiModalHeader className='trialModalHeader'>
      <EuiFlexGroup direction='column' alignItems='center'>
        <EuiFlexItem>
          <img
            src={theme === 'light' ? unpackFeaturesIllustration : unpackFeaturesIllustrationDark}
            alt={formatMessage(messages.unlockAlt)}
            width='100px'
          />
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiModalHeaderTitle>
            <FormattedMessage data-test-id='trial-modal' {...messages.unlockTitle} />
          </EuiModalHeaderTitle>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiModalHeader>

    <EuiModalBody className='trialModalBody unlockFeatures'>
      <EuiFlexItem style={{ maxWidth: '400px' }}>
        <TrialBillingMoreFeatures />
      </EuiFlexItem>
    </EuiModalBody>
    <EuiModalFooter className='trialModalFooter'>
      <EuiFlexGroup justifyContent='center'>
        <ProvideBillingDetailsButton grow={false} close={close} fill={true} />
        <EuiFlexItem grow={false}>
          <EuiButtonEmpty onClick={close}>
            <FormattedMessage {...messages.maybeLater} />
          </EuiButtonEmpty>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiModalFooter>
  </Fragment>
)

export default injectIntl(TrialModalBody)
