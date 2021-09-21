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
import { FormattedMessage } from 'react-intl'
import { isEmpty } from 'lodash'

import { EuiFlexGroup, EuiFlexItem, EuiFormLabel, EuiSpacer, EuiText } from '@elastic/eui'

import ApplicationLink from './ApplicationLink'
import ApplicationLinkHelpPopover from './ApplicationLinkHelpPopover'

import { getLinks } from '../../../lib/deployments/links'

import { securityUrl } from '../../../lib/urlBuilder'

import { SliderInstanceType, StackDeployment } from '../../../types'

import './applicationLinks.scss'

type Props = {
  title?: ReactNode
  deployment: StackDeployment
  show?: SliderInstanceType
}

const ApplicationLinks: FunctionComponent<Props> = ({ title, deployment, show }) => {
  const links = getLinks({ deployment, show })
  const resetPasswordUrl = securityUrl(deployment.id)
  const hasGlobalPopover = Boolean(title)

  return (
    <div className='applicationLinks'>
      {title && (
        <Fragment>
          <EuiFlexGroup gutterSize='xs' alignItems='center' responsive={false}>
            <EuiFlexItem grow={false}>
              <EuiFormLabel>{title}</EuiFormLabel>
            </EuiFlexItem>

            <EuiFlexItem grow={false}>
              <ApplicationLinkHelpPopover resetPasswordUrl={resetPasswordUrl} />
            </EuiFlexItem>
          </EuiFlexGroup>

          <EuiSpacer size='m' />
        </Fragment>
      )}

      {isEmpty(links) ? (
        <EuiText color='subdued' size='s' data-test-id='applicationLinks-unavailable'>
          <p>
            <FormattedMessage
              id='applicationLinks.unavailable'
              defaultMessage='Application links are not currently available'
            />
          </p>
        </EuiText>
      ) : (
        <ul data-test-id='applicationLinks.links'>
          {links.map((link) => (
            <li key={link.id}>
              <ApplicationLink
                {...link}
                helpPopover={
                  !hasGlobalPopover && (
                    <ApplicationLinkHelpPopover resetPasswordUrl={resetPasswordUrl} />
                  )
                }
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ApplicationLinks
