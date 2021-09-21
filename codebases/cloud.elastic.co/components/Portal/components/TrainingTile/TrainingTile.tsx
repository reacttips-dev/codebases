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

import React, { Component, Fragment } from 'react'
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl'

import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiButton,
  EuiSpacer,
  EuiLink,
  EuiText,
  EuiTitle,
  EuiLoadingContent,
} from '@elastic/eui'

import { CuiBeveledIcon } from '../../../../cui/BeveledIcon'

import ExternalLink from '../../../../components/ExternalLink'

import PortalTile from '../PortalTile'

import { Feeds as FeedsType } from '../../../../reducers/feeds'
import { AsyncRequestState } from '../../../../types'

import './trainingTile.scss'

export type StateProps = {
  feeds: FeedsType
  fetchFeedRequest: AsyncRequestState
}

export type DispatchProps = {
  fetchFeed: (args: { feed: string; version: string }) => void
}

export interface ConsumerProps {
  inTrial?: boolean
}

type Props = StateProps & DispatchProps & ConsumerProps & WrappedComponentProps

const trainingLink = 'https://www.elastic.co/training/certification'

class TrainingTile extends Component<Props> {
  componentDidMount() {
    const { fetchFeed, inTrial } = this.props
    const feed = inTrial ? `ess-training-trial` : `ess-training-paying`
    fetchFeed({ feed, version: `1.0.0` })
  }

  render() {
    return (
      <PortalTile data-test-id='cloud-portal-training-tile' className='cloud-portal-training-tile'>
        <EuiFlexGroup
          responsive={false}
          alignItems='center'
          justifyContent='spaceBetween'
          className='cloud-portal-training-tile-title'
        >
          <EuiFlexItem grow={false}>
            <EuiFlexGroup responsive={false} alignItems='center' gutterSize='s'>
              <EuiFlexItem grow={false}>
                <CuiBeveledIcon type='training' />
              </EuiFlexItem>

              <EuiFlexItem grow={false}>
                <EuiTitle size='xs'>
                  <h2>
                    <ExternalLink
                      showExternalLinkIcon={false}
                      color='text'
                      data-test-id='portal-training-tile-title-link'
                      href={trainingLink}
                      className='cloud-portal-tile-title'
                    >
                      <FormattedMessage
                        id='cloud-portal.training-title'
                        defaultMessage='Training'
                      />
                    </ExternalLink>
                  </h2>
                </EuiTitle>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiSpacer size='l' />

        {this.renderFeeds()}
      </PortalTile>
    )
  }

  renderFeeds() {
    const {
      intl: { locale },
      feeds,
      fetchFeedRequest,
    } = this.props

    if (fetchFeedRequest.inProgress) {
      return <EuiLoadingContent />
    }

    if (!feeds || feeds.length < 1) {
      return null
    }

    return (
      <Fragment>
        {feeds.map(
          (
            { title, description, link_text, link_url, secondary_link_text, secondary_link_url },
            index,
          ) => (
            <Fragment key={index}>
              <EuiFlexGroup direction='column'>
                <EuiFlexItem>
                  <EuiText>
                    <h5>{getLang(title, locale)}</h5>
                  </EuiText>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiText size='s'>
                    <p>{getLang(description, locale)}</p>
                  </EuiText>
                </EuiFlexItem>
              </EuiFlexGroup>
              <EuiSpacer size='m' />

              <EuiButton
                target='_blank'
                data-test-id='training-tile-primary-link'
                href={getLang(link_url, locale)}
              >
                {getLang(link_text, locale)}
              </EuiButton>

              <EuiSpacer size='m' />

              {secondary_link_url && secondary_link_text && (
                <EuiLink
                  target='_blank'
                  data-test-id='training-tile-secondary-link'
                  href={getLang(secondary_link_url, locale)}
                >
                  <EuiText size='s'>{getLang(secondary_link_text, locale)}</EuiText>
                </EuiLink>
              )}
            </Fragment>
          ),
        )}
      </Fragment>
    )
  }
}

export default injectIntl(TrainingTile)

function getLang(obj, lang) {
  return obj[lang] ? obj[lang] : obj.en
}
