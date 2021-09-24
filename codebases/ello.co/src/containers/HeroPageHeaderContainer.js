import { Map } from 'immutable'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selectUser } from '../selectors/user'
import {
  HeroPromotionCategory,
  HeroPromotionPage,
  HeroPromotionAuth,
} from '../components/heros/HeroRenderables'
import {
  selectHeroDPI,
  selectIsCategoryDrawerOpen,
  selectIsMobile,
} from '../selectors/gui'
import { selectIsLoggedIn } from '../selectors/authentication'
import { selectSubscribedCategoryIds } from '../selectors/profile'
import { selectCategoryForPath } from '../selectors/categories'
import { selectRandomPageHeader } from '../selectors/page_headers'
import { trackPostViews } from '../actions/posts'

function mapStateToProps(state, props) {
  const pageHeader = selectRandomPageHeader(state)
  const user = pageHeader ? selectUser(state, { userId: pageHeader.get('userId') }) : Map()
  const dpi = selectHeroDPI(state)
  const isMobile = selectIsMobile(state)
  const isLoggedIn = selectIsLoggedIn(state)
  const categoryId = pageHeader ? pageHeader.get('categoryId') : null
  const category = categoryId ? selectCategoryForPath(state, props) : null
  const isInfoCollapsed = !selectIsCategoryDrawerOpen(state)
  const subscribedIds = selectSubscribedCategoryIds(state, props)
  const isSubscribed = !!categoryId && !!isLoggedIn && subscribedIds.includes(categoryId)
  const isPromo = category ? category.get('level') === 'promo' : false

  return {
    pageHeader,
    user,
    dpi,
    isMobile,
    isInfoCollapsed,
    isSubscribed,
    isPromo,
    categoryId,
  }
}

class HeroPageHeaderContainer extends Component {
  static propTypes = {
    pageHeader: PropTypes.object,
    user: PropTypes.object,
    dpi: PropTypes.string.isRequired,
    isMobile: PropTypes.bool.isRequired,
    isInfoCollapsed: PropTypes.bool.isRequired,
    isSubscribed: PropTypes.bool.isRequired,
    isPromo: PropTypes.bool.isRequired,
    categoryId: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    pageHeader: null,
    user: null,
    categoryId: null,
  }

  static contextTypes = {
    onClickOpenRegistrationRequestDialog: PropTypes.func.isRequired,
  }

  componentDidUpdate() {
    const { dispatch, pageHeader } = this.props
    if (pageHeader && pageHeader.get('postToken')) {
      dispatch(trackPostViews([], [pageHeader.get('postToken')], 'promo'))
    }
  }

  render() {
    const {
      categoryId,
      dpi,
      isMobile,
      isInfoCollapsed,
      isSubscribed,
      isPromo,
      pageHeader,
      user,
    } = this.props
    if (!pageHeader) { return null }
    switch (pageHeader.get('kind')) {
      case 'CATEGORY':
        return (
          <HeroPromotionCategory
            categoryId={categoryId}
            name={pageHeader.get('header', '')}
            sources={pageHeader.get('image')}
            creditSources={user.get('avatar', null)}
            creditUsername={user.get('username', null)}
            creditLabel="Posted by"
            creditTrackingLabel={pageHeader.get('slug')}
            dpi={dpi}
            isMobile={isMobile}
            isInfoCollapsed={isInfoCollapsed}
            isSubscribed={isSubscribed}
            isPromo={isPromo}
          />
        )
      case 'GENERIC':
        return (
          <HeroPromotionPage
            header={pageHeader.get('header', '')}
            subheader={pageHeader.get('subheader', '')}
            ctaCaption={pageHeader.getIn(['ctaLink', 'text'])}
            ctaHref={pageHeader.getIn(['ctaLink', 'url'])}
            sources={pageHeader.get('image')}
            creditSources={user.get('avatar', null)}
            creditUsername={user.get('username', null)}
            dpi={dpi}
            isMobile={isMobile}
          />
        )
      case 'AUTHENTICATION':
        return (
          <HeroPromotionAuth
            dpi={dpi}
            sources={pageHeader.get('image')}
            creditSources={user.get('avatar', null)}
            creditUsername={user.get('username', null)}
          />
        )
      default:
        return null
    }
  }
}

export default connect(mapStateToProps)(HeroPageHeaderContainer)
