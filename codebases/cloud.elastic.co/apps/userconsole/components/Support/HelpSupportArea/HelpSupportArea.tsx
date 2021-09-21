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

import React, { Fragment, Component } from 'react'
import { FormattedMessage } from 'react-intl'

import {
  EuiCard,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiSpacer,
  EuiText,
  EuiLoadingSpinner,
  EuiButton,
} from '@elastic/eui'

import SupportCaseForm from '../SupportCaseForm'
import SupportPortalTile from '../SupportPortalTile'
import { isSupportPortal } from '../../../../../lib/profile'

import { docLinkAsString } from '../../../../../components/DocLink'

import { ProfileState, AsyncRequestState } from '../../../../../types'

import '../help.scss'

interface Props {
  profile: NonNullable<ProfileState>
  fetchOktaApplications: () => void
  fetchOktaApplicationsRequest: AsyncRequestState
}

class HelpSupportArea extends Component<Props> {
  componentDidMount() {
    const { fetchOktaApplications } = this.props

    fetchOktaApplications()
  }

  render() {
    const { profile, fetchOktaApplicationsRequest } = this.props

    if (!profile.isPremium) {
      if (fetchOktaApplicationsRequest.inProgress) {
        return <EuiLoadingSpinner />
      }

      const isSupportPortalUser = isSupportPortal(profile)

      return isSupportPortalUser ? <SupportPortalTile /> : <SupportCaseForm />
    }

    return (
      <Fragment>
        <EuiText>
          <FormattedMessage
            id='help.intro'
            defaultMessage='There are three ways you can find the help that you need:'
          />
        </EuiText>

        <EuiSpacer size='xl' />

        <EuiFlexGroup>
          <EuiFlexItem>
            <EuiCard
              icon={<EuiIcon size='xxl' type='document' />}
              title={<FormattedMessage id='help.docs.title' defaultMessage='Documentation' />}
              description={
                <FormattedMessage
                  id='help.docs.description'
                  defaultMessage='Find regularly updated configuration, troubleshooting, RESTful API, and other helpful information.'
                />
              }
              footer={
                <EuiButton
                  href={docLinkAsString('helpDocLink')}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <FormattedMessage id='help.docs.button' defaultMessage='Open documentation' />
                </EuiButton>
              }
            />
          </EuiFlexItem>

          <SupportPortalTile />

          <EuiFlexItem>
            <EuiCard
              icon={<EuiIcon size='xxl' type='email' />}
              title={<FormattedMessage id='help.email.title' defaultMessage='Email' />}
              description={
                <FormattedMessage
                  id='help.email.description'
                  defaultMessage='Email us at support@elastic.co and you can expect an answer within the SLA timeline for your subscription level.'
                />
              }
              footer={
                <EuiButton href='mailto:support@elastic.co'>
                  <FormattedMessage id='help.email.button' defaultMessage='Send email' />
                </EuiButton>
              }
            />
          </EuiFlexItem>
        </EuiFlexGroup>
      </Fragment>
    )
  }
}

export default HelpSupportArea
