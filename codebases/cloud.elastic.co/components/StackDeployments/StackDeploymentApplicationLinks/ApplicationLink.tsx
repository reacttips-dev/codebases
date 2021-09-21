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

import React, { FunctionComponent, Fragment, ReactNode } from 'react'

import { FormattedMessage, MessageDescriptor, WrappedComponentProps, injectIntl } from 'react-intl'

import { EuiFlexGroup, EuiFlexItem, EuiText } from '@elastic/eui'

import CopyButton from '../../CopyButton'
import ExternalLink from '../../ExternalLink'

interface ApplicationLinkProps {
  id: string
  label: MessageDescriptor
  uiUri: string
  apiUri: string | undefined
  appID: string
  helpPopover?: ReactNode
  available: boolean
  showLaunchLink: boolean
}

type Props = ApplicationLinkProps & WrappedComponentProps

const ApplicationLink: FunctionComponent<Props> = ({
  intl: { formatMessage },
  label,
  uiUri,
  apiUri,
  appID,
  available,
  showLaunchLink,
  helpPopover,
}) => {
  const formattedLabel = formatMessage(label)

  return (
    <Fragment>
      <div>
        <EuiFlexGroup gutterSize='xs' alignItems='center' responsive={false}>
          <EuiFlexItem grow={false}>
            <EuiText size='s'>
              <strong>{formattedLabel}</strong>
            </EuiText>
          </EuiFlexItem>

          {helpPopover && <EuiFlexItem grow={false}>{helpPopover}</EuiFlexItem>}
        </EuiFlexGroup>
      </div>

      <div data-test-id={`application-link-launch-${formattedLabel}`}>
        {available && showLaunchLink && (
          <ExternalLink href={uiUri} showExternalLinkIcon={true}>
            <FormattedMessage id='application-link.launch' defaultMessage='Open' />
          </ExternalLink>
        )}
      </div>

      <div data-test-id={`application-link-copy-${formattedLabel}`}>
        {available && apiUri && (
          <CopyButton asLink={true} value={apiUri}>
            <FormattedMessage id='application-link.copy-endpoint' defaultMessage='Copy endpoint' />
          </CopyButton>
        )}
      </div>

      <div data-test-id={`application-link-copy-id-${formattedLabel}`}>
        <CopyButton asLink={true} value={appID}>
          <FormattedMessage id='application-link.copy-id' defaultMessage='Copy cluster ID' />
        </CopyButton>
      </div>
    </Fragment>
  )
}

export default injectIntl(ApplicationLink)
