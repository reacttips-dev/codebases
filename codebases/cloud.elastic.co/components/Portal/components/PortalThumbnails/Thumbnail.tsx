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

import React, { PureComponent, Fragment, ReactChild, ReactNode } from 'react'
import { defineMessages, WrappedComponentProps, injectIntl } from 'react-intl'
import TextTruncate from 'react-text-truncate'

import {
  EuiDescriptionList,
  EuiDescriptionListTitle,
  EuiDescriptionListDescription,
  EuiFlexGroup,
  EuiFlexItem,
  EuiLink,
  EuiPanel,
  EuiText,
} from '@elastic/eui'

import ExternalLink from '../../../ExternalLink'

import './thumbnail.scss'

import playButton from '../../../../files/video-play-btn.svg'

export interface ThumbnailProps {
  title: ReactNode
  description: ReactChild
  src: string
  url?: string
  alt?: string
  isExternalLink?: boolean
  ['data-test-id']: string
}

const messages = defineMessages({
  play: {
    id: `cloud-portal.webinars-play`,
    defaultMessage: `Play`,
  },
  externalLink: {
    id: `cloud-portal-thumbnails.external-link`,
    defaultMessage: `External link`,
  },
})

class Thumbnail extends PureComponent<ThumbnailProps & WrappedComponentProps> {
  render() {
    const {
      intl,
      title,
      description,
      src,
      url,
      alt = typeof title === 'string' ? title : undefined,
      isExternalLink,
      'data-test-id': dataTestId,
    } = this.props
    const { formatMessage } = intl

    return (
      <EuiFlexGroup
        className='cloud-portal-thumbnail'
        gutterSize='m'
        responsive={false}
        data-test-id={dataTestId}
      >
        <EuiFlexItem grow={false}>
          <EuiPanel className='cloud-portal-thumbnail-image-panel' paddingSize='none' grow={false}>
            {this.renderThumbnailLink({
              content: (
                <Fragment>
                  <img
                    className='cloud-portal-thumbnail-image'
                    src={src}
                    alt={alt}
                    data-test-id={`${dataTestId}-thumbnail-link`}
                  />

                  <img
                    className='cloud-portal-play-btn'
                    src={playButton}
                    alt={formatMessage(messages.play)}
                  />
                </Fragment>
              ),
              url,
              isExternalLink,
            })}
          </EuiPanel>
        </EuiFlexItem>

        <EuiFlexItem>
          <EuiDescriptionList titleProps={{ className: 'cloud-portal-thumbnail-title' }}>
            <EuiDescriptionListTitle>
              <h3
                className='cloud-portal-tile-inner-content-title'
                data-test-id={`${dataTestId}-regular-link`}
              >
                {this.renderThumbnailLink({ content: title, url, isExternalLink })}
              </h3>
            </EuiDescriptionListTitle>

            <EuiDescriptionListDescription>
              {typeof description === 'string' ? (
                <EuiText size='s'>
                  <TextTruncate text={description} line={2} />
                </EuiText>
              ) : (
                description
              )}
            </EuiDescriptionListDescription>
          </EuiDescriptionList>
        </EuiFlexItem>
      </EuiFlexGroup>
    )
  }

  renderThumbnailLink({ content, url, isExternalLink }) {
    const children =
      typeof content === 'string' ? <TextTruncate text={content} line={1} /> : content

    if (!url) {
      return children
    }

    if (isExternalLink) {
      return (
        <ExternalLink href={url} showExternalLinkIcon={false}>
          {children}
        </ExternalLink>
      )
    }

    return <EuiLink href={url}>{children}</EuiLink>
  }
}

export default injectIntl(Thumbnail)
