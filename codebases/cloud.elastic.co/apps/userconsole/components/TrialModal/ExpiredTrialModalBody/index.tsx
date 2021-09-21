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

import React, { Fragment, FunctionComponent } from 'react'
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl'

import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiLink,
  EuiModalBody,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiText,
  EuiModalFooter,
} from '@elastic/eui'

import messages from './messages'

import ProvideBillingDetailsButton from '../ProvideBillingDetailsButton'

import ExternalLink from '../../../../../components/ExternalLink'

import hourglassIllustration from '../../../../../files/illustration-hour-glass-128-white-bg.svg'
import hourglassIllustrationDark from '../../../../../files/illustration-hour-glass-128-ink-bg.svg'

import { Theme } from '../../../../../types'

interface Props extends WrappedComponentProps {
  canExtendTrial: boolean
  theme: Theme
  onClick: () => void
  showExtendTrialModal: boolean
  close: () => void
}

const ExpiredTrialModalBody: FunctionComponent<Props> = ({
  onClick,
  theme,
  intl: { formatMessage },
  canExtendTrial,
  close,
}) => (
  <Fragment>
    <EuiModalHeader>
      <EuiFlexGroup direction='column' alignItems='center' className='trialModalHeader'>
        <EuiFlexItem>
          <img
            src={theme === 'light' ? hourglassIllustration : hourglassIllustrationDark}
            alt={formatMessage(messages.hourglassAlt)}
            width='100px'
          />
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiModalHeaderTitle>
            <FormattedMessage
              data-test-id='expired-trial-modal'
              {...messages.expiredTrialModalTitle}
            />
          </EuiModalHeaderTitle>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiModalHeader>

    <EuiModalBody className='trialModalBody'>
      <EuiFlexGroup direction='column' alignItems='center'>
        <EuiFlexItem style={{ maxWidth: '600px' }}>
          <EuiText size='m' color='subdued'>
            <FormattedMessage
              id='expired-trial-modal.description'
              defaultMessage='We hope you enjoyed your free trial. If you want to continue with Elasticsearch Service and unlock more features, provide your credit card details. {needMoreTime}'
              values={{
                needMoreTime: canExtendTrial ? (
                  <EuiLink
                    onClick={() => {
                      onClick()
                    }}
                  >
                    <FormattedMessage data-test-id='extendTrial' {...messages.needMoreTime} />
                  </EuiLink>
                ) : (
                  <ExternalLink href='https://info.elastic.co/cloud-trial-extension.html'>
                    <FormattedMessage data-test-id='requestExtension' {...messages.needMoreTime} />
                  </ExternalLink>
                ),
              }}
            />
          </EuiText>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiModalBody>
    <EuiModalFooter>
      <EuiFlexGroup justifyContent='center'>
        <ProvideBillingDetailsButton grow={false} fill={true} close={close} />
      </EuiFlexGroup>
    </EuiModalFooter>
  </Fragment>
)

export default injectIntl(ExpiredTrialModalBody)
