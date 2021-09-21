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

import React, { Component } from 'react'
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl'

import { EuiFlexGroup, EuiFlexItem, EuiSpacer, EuiTitle } from '@elastic/eui'

import { CuiBeveledIcon } from '../../../../cui'

import PortalTile from '../PortalTile'
import PortalThumbnails from '../PortalThumbnails'

import ExternalLink from '../../../ExternalLink'

import { Feeds as FeedsType, getLang } from '../../../../reducers/feeds'
import { AsyncRequestState } from '../../../../types'

import kibanaBasics from '../../../../files/rtp-featured-video-kibana-basics-vega.png'

export type StateProps = {
  feeds?: FeedsType
  fetchFeedRequest: AsyncRequestState
  fetchProfileRequest: AsyncRequestState
}

export type DispatchProps = {
  fetchFeed: (args: { feed: string; version: string }) => void
}

export type ConsumerProps = {
  inTrial?: boolean
}

type Props = StateProps & DispatchProps & ConsumerProps & WrappedComponentProps

class WebinarsTile extends Component<Props> {
  componentDidMount() {
    this.fetchDeps()
  }

  componentDidUpdate(prevProps: Props) {
    const { inTrial } = this.props

    if (prevProps.inTrial !== inTrial) {
      this.fetchDeps()
    }
  }

  render() {
    return (
      <PortalTile data-test-id='cloud-portal-webinars-tile' className='cloud-portal-webinars-tile'>
        <EuiFlexGroup responsive={false} alignItems='center' gutterSize='s'>
          <EuiFlexItem grow={false}>
            <CuiBeveledIcon type='videoPlayer' />
          </EuiFlexItem>

          <EuiFlexItem grow={false}>
            <EuiTitle size='xs'>
              <h2>
                <ExternalLink
                  showExternalLinkIcon={false}
                  color='text'
                  data-test-id='portal-webinars-tile-title-link'
                  href=' https://www.elastic.co/videos/'
                  className='cloud-portal-tile-title'
                >
                  <FormattedMessage id='cloud-portal.webinars-title' defaultMessage='Webinars' />
                </ExternalLink>
              </h2>
            </EuiTitle>
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiSpacer size='m' />

        <PortalThumbnails thumbnails={this.getWebinars()} />
      </PortalTile>
    )
  }

  getWebinars() {
    const {
      intl: { locale },
      fetchFeedRequest,
      fetchProfileRequest,
      feeds,
    } = this.props

    if (fetchFeedRequest.inProgress || fetchProfileRequest.inProgress) {
      return undefined
    }

    if (!feeds) {
      return []
    }

    return feeds.map(({ link_url, title, hash, description, image_url }, index) => ({
      description: getLang(description, locale),
      title: getLang(title, locale),
      isExternalLink: true,
      src: image_url ? getLang(image_url, locale) : kibanaBasics,
      url: getLang(link_url, locale),
      'data-test-id': `portal-webinars-tile-${index}`,
      id: hash,
    }))
  }

  fetchDeps() {
    const { fetchFeed, inTrial } = this.props

    if (inTrial === undefined) {
      return
    }

    const feed = inTrial ? `ess-webinars-trial` : `ess-webinars-paying`
    fetchFeed({ feed, version: `1.0.0` })
  }
}

export default injectIntl(WebinarsTile)
