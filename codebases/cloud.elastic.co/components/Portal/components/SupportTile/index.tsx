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
import { EuiFlexGroup, EuiFlexItem, EuiSpacer, EuiText, EuiTitle } from '@elastic/eui'

import PortalTile from '../PortalTile'

import { CuiBeveledIcon } from '../../../../cui/BeveledIcon'
import { CuiLink, CuiRouterLinkButton } from '../../../../cui'

import { supportUrl } from '../../../../lib/urlBuilder'

const SupportTile: FunctionComponent = () => (
  <PortalTile className='cloud-portal-support-tile'>
    <EuiFlexGroup responsive={false} alignItems='center' gutterSize='s'>
      <EuiFlexItem grow={false}>
        <CuiBeveledIcon type='help' />
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiTitle size='xs'>
          <h2>
            <CuiLink color='text' to={supportUrl()}>
              <FormattedMessage id='cloud-portal.support-tile.title' defaultMessage='Support' />
            </CuiLink>
          </h2>
        </EuiTitle>
      </EuiFlexItem>
    </EuiFlexGroup>

    <EuiSpacer size='m' />

    <EuiText size='s'>
      <FormattedMessage
        id='cloud-portal.support-tile.content.no-cases'
        defaultMessage='Having some trouble? Reach out to us.'
      />
    </EuiText>

    <EuiSpacer size='m' />

    <CuiRouterLinkButton to={supportUrl()}>
      <FormattedMessage
        id='cloud-portal.support-tile.contact-support'
        defaultMessage='Contact support'
      />
    </CuiRouterLinkButton>
  </PortalTile>
)

export default SupportTile
