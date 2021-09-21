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
import { FormattedMessage } from 'react-intl'

import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui'

import OtherLinks from './OtherLinks'
import HelpSupportArea from './HelpSupportArea'

import Header from '../../../../components/Header'

import { supportCrumbs } from '../../../../lib/crumbBuilder'

import { ProfileState } from '../../../../types'

import './help.scss'

interface Props {
  profile: NonNullable<ProfileState>
}

const Support: FunctionComponent<Props> = ({ profile }) => (
  <Fragment>
    <Header
      name={<FormattedMessage id='help.support-title' defaultMessage='Support' />}
      breadcrumbs={supportCrumbs()}
    />

    <EuiFlexGroup>
      <EuiFlexItem>
        <HelpSupportArea profile={profile} />
      </EuiFlexItem>

      <EuiFlexItem grow={false}>
        <OtherLinks showDoc={!profile.isPremium} />
      </EuiFlexItem>
    </EuiFlexGroup>
  </Fragment>
)

export default Support
