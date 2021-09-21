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

import React, { PureComponent } from 'react'
import { defineMessages, FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl'
import { stringify } from 'query-string'

import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiFieldSearch,
  EuiSpacer,
  EuiText,
  EuiTitle,
  EuiLoadingContent,
} from '@elastic/eui'

import { CuiBeveledIcon } from '../../../../cui'
import ExternalLink from '../../../ExternalLink'
import PortalTile from '../PortalTile'

import { Feeds as FeedsType, getLang } from '../../../../reducers/feeds'
import { AsyncRequestState } from '../../../../types'

import './documentationTile.scss'

export type DispatchProps = {
  fetchFeed: (args: { feed: string; version: string }) => void
}
export type StateProps = {
  feeds: FeedsType
  fetchDocsFeedRequest: AsyncRequestState
  fetchProfileRequest: AsyncRequestState
}
export type ConsumerProps = { inTrial?: boolean }

type Props = StateProps & DispatchProps & ConsumerProps & WrappedComponentProps

interface State {
  documentationQuery: string
}

const emptyString = /^\s*$/

const messages = defineMessages({
  searchlabel: {
    id: 'cloud-portal-documentation.search-label',
    defaultMessage: 'Documentation search',
  },
  placeholder: {
    id: 'cloud-portal-documentation.search-placeholder',
    defaultMessage: 'Help me find...',
  },
})

class DocumentationTile extends PureComponent<Props, State> {
  state: State = {
    documentationQuery: '',
  }

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
    const {
      intl: { formatMessage },
    } = this.props

    return (
      <PortalTile
        data-test-id='cloud-portal-documentation-tile'
        className='cloud-portal-documentation-tile'
      >
        <EuiFlexGroup responsive={false} alignItems='center' gutterSize='s'>
          <EuiFlexItem grow={false}>
            <CuiBeveledIcon type='documents' />
          </EuiFlexItem>

          <EuiFlexItem grow={false}>
            <EuiTitle size='xs'>
              <h2>
                <ExternalLink
                  showExternalLinkIcon={false}
                  color='text'
                  data-test-id='portal-documentation-tile-title-link'
                  href='https://www.elastic.co/guide/index.html'
                  className='cloud-portal-tile-title'
                >
                  <FormattedMessage
                    id='cloud-portal.documentation-title'
                    defaultMessage='Documentation'
                  />
                </ExternalLink>
              </h2>
            </EuiTitle>
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiSpacer size='m' />

        <EuiFieldSearch
          aria-label={formatMessage(messages.searchlabel)}
          value={this.state.documentationQuery}
          placeholder={formatMessage(messages.placeholder)}
          onKeyDown={this.onDocumentationSearchKeyDown}
          onChange={this.onSearchTextChange}
        />

        <EuiSpacer size='l' />

        <div className='cloud-portal-tile-inner-content'>{this.renderFeedsLinks()}</div>
      </PortalTile>
    )
  }

  renderFeedsLinks() {
    const {
      intl: { locale },
      fetchProfileRequest,
      feeds,
      fetchDocsFeedRequest,
    } = this.props

    if (fetchDocsFeedRequest.inProgress || fetchProfileRequest.inProgress) {
      return <EuiLoadingContent />
    }

    return (
      <ul>
        {feeds.map(({ link_url, title, hash }, index) => (
          <li key={hash || index}>
            {index > 0 && <EuiSpacer size='s' />}
            <EuiText size='s'>
              <ExternalLink
                data-test-id={`portal-documentation-tile-link-${index}`}
                href={getLang(link_url, locale)}
              >
                {getLang(title, locale)}
              </ExternalLink>
            </EuiText>
          </li>
        ))}
      </ul>
    )
  }

  onDocumentationSearchKeyDown = (e) => {
    if (e.key !== `Enter`) {
      return
    }

    const { documentationQuery } = this.state

    if (emptyString.test(documentationQuery)) {
      return
    }

    const query = {
      'fv-website_area': `documentation`,
      q: documentationQuery.trim(),
      size: 20,
    }

    const documentationUrl = `https://www.elastic.co/search?${stringify(query)}`
    window.open(documentationUrl)
  }

  onSearchTextChange = (e) => {
    this.setState({ documentationQuery: e.target.value })
  }

  fetchDeps() {
    const { fetchFeed, inTrial } = this.props

    if (inTrial === undefined) {
      return
    }

    if (inTrial) {
      fetchFeed({ feed: `ess-documentation-trial`, version: `1.0.0` })
    } else {
      fetchFeed({ feed: `ess-documentation-paying`, version: `1.0.0` })
    }
  }
}

export default injectIntl(DocumentationTile)
