import { Map } from 'immutable'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import classNames from 'classnames'
import { trackEvent, trackInitialPage } from '../actions/analytics'
import { loadBadges } from '../actions/badges'
import { getNavCategories } from '../actions/discover'
import { setSignupModalLaunched } from '../actions/gui'
import { openModal } from '../actions/modals'
import { loadAnnouncements, loadNotifications } from '../actions/notifications'
import { lovePost, unlovePost } from '../actions/posts'
import { loadProfile } from '../actions/profile'
import { loadPageHeaders } from '../actions/page_headers'
import DevTools from '../components/devtools/DevTools'
import RegistrationRequestDialog from '../components/dialogs/RegistrationRequestDialog'
import ShareDialog from '../components/dialogs/ShareDialog'
import CreatorTypesModal from '../components/modals/CreatorTypesModal'
import { addGlobalDrag, removeGlobalDrag } from '../components/viewport/GlobalDragComponent'
import AnalyticsContainer from '../containers/AnalyticsContainer'
import FooterContainer from '../containers/FooterContainer'
import HeroDispatchContainer from '../containers/HeroDispatchContainer'
import InputContainer from '../containers/InputContainer'
import KeyboardContainer from '../containers/KeyboardContainer'
import MetaContainer from '../containers/MetaContainer'
import ModalContainer from '../containers/ModalContainer'
import NavbarContainer from '../containers/NavbarContainer'
import OmnibarContainer from '../containers/OmnibarContainer'
import DataPolicy from '../containers/DataPolicy'
import PromoAlert from '../containers/PromoAlert'
import ViewportContainer from '../containers/ViewportContainer'
import { scrollToPosition, isLink } from '../lib/jello'
import * as ElloAndroidInterface from '../lib/android_interface'
import { selectIsLoggedIn } from '../selectors/authentication'
import { selectIsGridMode, selectShouldShowDataPolicy, selectShouldShowPromoAlert } from '../selectors/gui'
import { selectIsStaff, selectShowCreatorTypeModal } from '../selectors/profile'
import { selectIsAuthenticationView } from '../selectors/routing'
import { selectRandomAuthPageHeader } from '../selectors/page_headers'
import { selectUser } from '../selectors/user'

function mapStateToProps(state) {
  const authPromo = selectRandomAuthPageHeader(state)
  return {
    authPromo,
    authPromoUser: authPromo ? selectUser(state, { userId: authPromo.get('userId') }) : Map(),
    shouldShowDataPolicy: selectShouldShowDataPolicy(state),
    shouldShowPromoAlert: selectShouldShowPromoAlert(state),
    isAuthenticationView: selectIsAuthenticationView(state),
    isLoggedIn: selectIsLoggedIn(state),
    isStaff: selectIsStaff(state),
    isGridMode: selectIsGridMode(state),
    showCreatorTypeModal: selectShowCreatorTypeModal(state),
  }
}

class AppContainer extends Component {
  static propTypes = {
    authPromo: PropTypes.object,
    authPromoUser: PropTypes.object,
    children: PropTypes.node.isRequired,
    shouldShowDataPolicy: PropTypes.bool.isRequired,
    shouldShowPromoAlert: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    isAuthenticationView: PropTypes.bool.isRequired,
    isGridMode: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isStaff: PropTypes.bool.isRequired,
    params: PropTypes.object.isRequired,
    showCreatorTypeModal: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    authPromo: null,
    authPromoUser: null,
  }

  static childContextTypes = {
    onClickOpenRegistrationRequestDialog: PropTypes.func,
    onClickScrollToContent: PropTypes.func,
    onClickRenderedContent: PropTypes.func,
    onClickTrackCredits: PropTypes.func,
    onClickTrackCTA: PropTypes.func,
    onLaunchNativeEditor: PropTypes.func,
    openShareDialog: PropTypes.func,
    toggleLovePost: PropTypes.func,
  }

  getChildContext() {
    return {
      onClickOpenRegistrationRequestDialog: this.onClickOpenRegistrationRequestDialog,
      onClickScrollToContent: this.onClickScrollToContent,
      onClickTrackCredits: this.onClickTrackCredits,
      onClickTrackCTA: this.onClickTrackCTA,
      onClickRenderedContent: this.onClickRenderedContent,
      onLaunchNativeEditor: this.onLaunchNativeEditor,
      openShareDialog: this.openShareDialog,
      toggleLovePost: this.toggleLovePost,
    }
  }

  componentDidMount() {
    addGlobalDrag()
    const { dispatch, isLoggedIn, isStaff } = this.props
    dispatch(trackInitialPage())
    if (isLoggedIn) {
      dispatch(loadProfile())
      dispatch(loadNotifications({ category: 'all' }))
      dispatch(loadAnnouncements())
    } else {
      dispatch(loadPageHeaders({ kind: 'AUTHENTICATION' }))
    }
    dispatch(getNavCategories())
    dispatch(loadBadges())
    ElloAndroidInterface.initialize(dispatch, isStaff)
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch } = nextProps
    if (!this.props.isLoggedIn && nextProps.isLoggedIn) {
      dispatch(loadProfile())
      dispatch(getNavCategories())
      dispatch(loadBadges())
      dispatch(loadAnnouncements())
    } else if (this.props.isLoggedIn && !nextProps.isLoggedIn) {
      dispatch(loadPageHeaders({ kind: 'AUTHENTICATION' }))
      dispatch(getNavCategories())
      dispatch(loadBadges())
    }

    if (nextProps.shouldShowPromoAlert) {
      dispatch(openModal(<PromoAlert url="http://tlnt.at/SparkAR" />))
    } else if (nextProps.showCreatorTypeModal) {
      setTimeout(() => {
        dispatch(openModal(<CreatorTypesModal />))
      }, 5000)
    }
  }

  shouldComponentUpdate(nextProps) {
    return [
      'isAuthenticationView',
      'isLoggedIn',
      'params',
      'children',
      'shouldShowDataPolicy',
      'shouldShowPromoAlert',
    ].some(prop =>
      nextProps[prop] !== this.props[prop],
    )
  }

  componentWillUnmount() {
    removeGlobalDrag()
  }

  // TODO: Rename this to openRegistrationRequestDialog since it's a method
  // call and not coming directly from an event.
  onClickOpenRegistrationRequestDialog = (trackPostfix = 'modal') => {
    const { authPromo, authPromoUser, dispatch, isAuthenticationView } = this.props
    if (isAuthenticationView || !authPromo) { return }
    dispatch(openModal(
      <RegistrationRequestDialog pageHeader={authPromo} user={authPromoUser} />,
      'asDecapitated',
      'RegistrationRequestDialog',
      `open-registration-request-${trackPostfix}`,
    ))
    dispatch(setSignupModalLaunched())
  }

  onClickScrollToContent = () => {
    scrollToPosition(0, document.querySelector('.Hero').offsetHeight)
  }

  onClickRenderedContent = (e, detailPath) => {
    const { dispatch, isGridMode } = this.props
    const { classList, dataset } = e.target
    // Get the raw value instead of the property value which is always absolute
    const href = e.target.getAttribute('href')
    // Relative links get sent to push (usernames, raw links, hashtags)
    if (href && href[0] === '/') {
      e.preventDefault()
      dispatch(push(href))
    // TODO: We have a special `span` based fake link at the moment we have to test
    // for. Once we change this back to an `<a> element we can rip this out.
    } else if (classList.contains('hashtag-link')) {
      e.preventDefault()
      dispatch(push(dataset.href))
    // Treat non links within grid layouts as a push to it's detail path
    } else if (isGridMode && detailPath && !isLink(e.target)) {
      e.preventDefault()

      // if it's a command / control click or middle mouse fake a link and
      // click it... I'm serious.
      if (e.metaKey || e.ctrlKey || e.which === 2) {
        const a = document.createElement('a')
        a.href = detailPath
        a.target = '_blank'
        a.click()
        this.onTrackRelatedPostClick()
        return
      }
      // ..otherwise just push it through..
      dispatch(push(detailPath))
      this.onTrackRelatedPostClick()
    }
    // The alternative is it's either in list and we ignore it or it's an
    // absolute link and we allow it's default behavior.
  }

  onClickTrackCredits = (label) => {
    const { dispatch } = this.props
    dispatch(trackEvent('promoByline_clicked', { name: label }))
  }

  onClickTrackCTA = (label) => {
    const { dispatch } = this.props
    dispatch(trackEvent('promoCTA_clicked', { name: label }))
  }

  onLaunchNativeEditor = (post = null, isComment = false, comment = null, text = null) => {
    ElloAndroidInterface.launchEditor(
      post ? JSON.stringify(post.toJS()) : null,
      `${isComment}`,
      comment ? JSON.stringify(comment.toJS()) : null,
      text,
    )
  }

  openShareDialog = ({ externalUrl, post, postAuthor, trackLabel, trackOptions }) => {
    const { dispatch } = this.props
    const action = bindActionCreators(trackEvent, dispatch)
    dispatch(openModal(
      <ShareDialog
        author={postAuthor}
        externalUrl={externalUrl}
        post={post}
        trackEvent={action}
        trackOptions={trackOptions}
      />,
      '',
      null,
      trackLabel || 'open-share-dialog',
      trackOptions || {},
    ))
  }

  toggleLovePost = ({ isLoved, post, trackLabel, trackOptions }) => {
    const { dispatch } = this.props
    if (isLoved) {
      dispatch(unlovePost({ post, trackLabel, trackOptions }))
    } else {
      dispatch(lovePost({ post, trackLabel, trackOptions }))
    }
  }

  render() {
    const {
      children, isAuthenticationView, isLoggedIn, params,
      shouldShowDataPolicy,
    } = this.props
    const appClasses = classNames(
      'AppContainer',
      { isLoggedIn },
      { isLoggedOut: !isLoggedIn },
    )
    return (
      <section className={appClasses}>
        <MetaContainer params={params} />
        <ViewportContainer params={params} />
        {isLoggedIn ? <OmnibarContainer /> : null}
        <HeroDispatchContainer params={params} />
        {children}
        <NavbarContainer params={params} />
        {shouldShowDataPolicy ? <DataPolicy /> : null}
        {!isAuthenticationView && <FooterContainer params={params} />}
        {isLoggedIn ? <InputContainer /> : null}
        <ModalContainer />
        <DevTools />
        <KeyboardContainer />
        <AnalyticsContainer />
      </section>
    )
  }
}

export default connect(mapStateToProps)(AppContainer)
