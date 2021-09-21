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

import moment from 'moment'

import React, { PureComponent, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiDescriptionList,
  EuiDescriptionListTitle,
  EuiDescriptionListDescription,
  EuiLoadingContent,
  EuiSpacer,
  EuiTitle,
  EuiText,
  EuiTextColor,
} from '@elastic/eui'

import { CuiBeveledIcon } from '../../../../cui'

import ExternalLink from '../../../ExternalLink'

import PortalTile from '../PortalTile'

import LocalStorageKey from '../../../../constants/localStorageKeys'

import { Post } from '../../../../lib/api/v1/types'
import { AsyncRequestState } from '../../../../types'

import './blogsTile.scss'

export interface BlogsCategory {
  category: string
}

export interface Props {
  blogs: Post[]
  fetchBlogs: (category: BlogsCategory) => Promise<any>
  fetchBlogsRequest: AsyncRequestState
}

interface State {
  visitedLinks: string[]
}

class BlogsTile extends PureComponent<Props, State> {
  category = 'portal'

  state: State = { visitedLinks: [] as string[] }

  componentDidMount(): void {
    const { fetchBlogs } = this.props
    fetchBlogs({ category: this.category })
  }

  componentDidUpdate(prevProps) {
    const { blogs } = this.props

    if (blogs !== prevProps.blogs) {
      this.resetVisitedBlogItems(blogs)
    }
  }

  render() {
    const { blogs, fetchBlogsRequest } = this.props
    return (
      <PortalTile className='cloud-portal-blogs-tile'>
        <EuiFlexGroup responsive={false} alignItems='center' gutterSize='s'>
          <EuiFlexItem grow={false}>
            <CuiBeveledIcon type='documentEdit' />
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiTitle size='xs'>
              <h2>
                <ExternalLink
                  showExternalLinkIcon={false}
                  color='text'
                  data-test-id='portal-news-title'
                  href='https://www.elastic.co/blog/'
                  className='cloud-portal-tile-title'
                >
                  <FormattedMessage id='cloud-portal.blogs-tile-title' defaultMessage='News' />
                </ExternalLink>
              </h2>
            </EuiTitle>
          </EuiFlexItem>
        </EuiFlexGroup>

        {!blogs.length && fetchBlogsRequest.inProgress ? (
          <Fragment>
            <EuiSpacer size='m' />
            <EuiLoadingContent lines={2} />
            <EuiSpacer size='m' />
            <EuiLoadingContent lines={2} />
            <EuiSpacer size='m' />
            <EuiLoadingContent lines={2} />
          </Fragment>
        ) : (
          this.getBlogItems()
        )}
      </PortalTile>
    )
  }

  getBlogItems() {
    const { blogs } = this.props

    return blogs.map((blog, index) => {
      const isNew = !this.isVisitedLink(blog.title)

      return (
        <Fragment key={index}>
          <EuiSpacer size='m' />

          <EuiDescriptionList>
            <EuiDescriptionListTitle className='cloud-portal-blogs-tile-item-title'>
              <EuiText size='s'>
                <ExternalLink
                  href={blog.url}
                  onClick={this.onClickBlogItem}
                  data-test-id={`portal-news-item-${index}`}
                >
                  {blog.title}
                </ExternalLink>
              </EuiText>
            </EuiDescriptionListTitle>

            <EuiSpacer size='xs' />

            <EuiDescriptionListDescription>
              <EuiFlexGroup gutterSize='m' alignItems='center' responsive={false}>
                <EuiFlexItem grow={false}>
                  <EuiTextColor className='cloud-portal-blogs-tile-item-date' color='default'>
                    {this.parseDate(blog.publish_date).toUpperCase()}
                  </EuiTextColor>
                </EuiFlexItem>
                {isNew && (
                  <EuiFlexItem grow={false}>
                    <EuiTextColor className='cloud-portal-blogs-tile-item-new' color='accent'>
                      <FormattedMessage
                        id='cloud-portal.blogs-title-item-new'
                        defaultMessage='New!'
                      />
                    </EuiTextColor>
                  </EuiFlexItem>
                )}
              </EuiFlexGroup>
            </EuiDescriptionListDescription>
          </EuiDescriptionList>
        </Fragment>
      )
    })
  }

  setVisitedLinks(visitedLinkItems) {
    this.setState((prevState) => {
      const visitedLinks = prevState.visitedLinks.concat(visitedLinkItems)
      localStorage.setItem(
        LocalStorageKey.cloudPortalBlogLinksVisited,
        JSON.stringify(visitedLinks),
      )
      return { visitedLinks }
    })
  }

  resetVisitedBlogItems(blogs) {
    const visitedItemStr = localStorage.getItem(LocalStorageKey.cloudPortalBlogLinksVisited)

    if (visitedItemStr) {
      const visitedLinkItem = JSON.parse(visitedItemStr).filter(
        (linkItem) => blogs.filter((blog) => linkItem === blog.title).length > 0,
      )
      this.setVisitedLinks(visitedLinkItem)
    }
  }

  onClickBlogItem = (e) => {
    this.setVisitedLinks([e.target.innerText])
  }

  isVisitedLink(linkName) {
    return this.state.visitedLinks.includes(linkName)
  }

  parseDate(date) {
    return moment.utc(date).format('LL')
  }
}

export default BlogsTile
