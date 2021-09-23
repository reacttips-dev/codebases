import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { FeatureCategoryPostTool } from '../posts/PostTools'
import { css, select } from '../../styles/jss'
import * as s from '../../styles/jso'

const categoryPostHistoryRecordStyle = css(
  s.block,
  s.m0,
  s.fontSize12,
  s.lh20,
  s.colorA,
  select('& span', s.inlineBlock),
  select('& .featured-toggle',
    s.relative,
    s.inlineBlock,
    s.mr10,
    {
      width: 16,
      height: 16,
    },
    select('& .BadgeFeaturedIcon',
      s.absolute,
      {
        top: -4,
        right: -17,
        transform: 'scale(0.64)',
      },
    ),
  ),
  select('& button.featured-toggle',
    {
      marginTop: -2,
      overflow: 'hidden',
    },
    select('& .BadgeFeaturedIcon',
      s.absolute,
      { top: -7 },
    ),
  ),
)

export class CategoryPostHistoryRecord extends Component {
  static propTypes = {
    status: PropTypes.string.isRequired,
    authorUsername: PropTypes.string.isRequired,
    categorySlug: PropTypes.string.isRequired,
    categoryName: PropTypes.string.isRequired,
    submittedByUsername: PropTypes.string,
    featuredByUsername: PropTypes.string,
    actions: PropTypes.object,
    fireAction: PropTypes.func.isRequired,
  }

  static defaultProps = {
    submittedByUsername: null,
    featuredByUsername: null,
    actions: null,
  }

  statusIcon() {
    const { status, actions, fireAction } = this.props
    return (
      <FeatureCategoryPostTool
        status={status}
        actions={actions}
        fireAction={fireAction}
      />
    )
  }

  featuredElement() {
    const {
      status,
      featuredByUsername,
      submittedByUsername,
      categoryName,
      categorySlug,
    } = this.props
    const featuredBy = status === 'featured' ? featuredByUsername || 'ello' : null
    if (status === 'featured' && featuredBy === submittedByUsername) {
      return (
        <span>
          Featured by <Link to={`/${featuredBy}`}>@{featuredBy}</Link> in&nbsp;
          <Link to={`/discover/${categorySlug}`}>{categoryName}</Link>.
        </span>
      )
    } else if (status === 'featured') {
      return (
        <span>
          Featured by <Link to={`/${featuredBy}`}>@{featuredBy}</Link>.
        </span>
      )
    }
    return null
  }

  submittedElement() {
    const {
      submittedByUsername,
      featuredByUsername,
      authorUsername,
      categorySlug,
      categoryName,
    } = this.props
    if (submittedByUsername === authorUsername) {
      return (
        <span>
          Posted into&nbsp;
          <Link to={`/discover/${categorySlug}`}>{categoryName}</Link>.
        </span>
      )
    } else if (submittedByUsername !== featuredByUsername) {
      return (
        <span>
          Added to&nbsp;
          <Link to={`/discover/${categorySlug}`}>{categoryName}</Link> by&nbsp;
          <Link to={`/${submittedByUsername}`}>{submittedByUsername}</Link>.
        </span>
      )
    }
    return null
  }

  render() {
    const { status } = this.props
    if (status === 'removed') { return null }
    return (
      <p className={categoryPostHistoryRecordStyle}>
        {this.statusIcon()}
        {this.featuredElement()}&nbsp;
        {this.submittedElement()}
      </p>
    )
  }
}

export default CategoryPostHistoryRecord
