import Immutable from 'immutable'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import Mousetrap from 'mousetrap'
import { trackEvent } from '../actions/analytics'
import { setIsLightBoxActive } from '../actions/gui'
import { openModal, closeModal } from '../actions/modals'
import { sendCategoryPostAction } from '../actions/category_posts'
import { UserModal } from '../components/posts/PostRenderables'
import {
  loadEditablePost,
  toggleComments,
  toggleReposting,
} from '../actions/posts'
import { PostToolsLightBox } from '../components/posts/PostTools'
import { isElloAndroid } from '../lib/jello'
import { selectIsLoggedIn } from '../selectors/authentication'
import { selectDeviceSize } from '../selectors/gui'
import {
  selectPost,
  selectPostAuthor,
  selectPostCategoryPostStatusForPath,
  selectPostCategoryPostActionsForPath,
  selectPostCommentsCount,
  selectPostDetailPath,
  selectPostIsCommentsRequesting,
  selectPostIsOwn,
  selectPostIsOwnOriginal,
  selectPostLoved,
  selectPostLovesCount,
  selectPostReposted,
  selectPostRepostsCount,
  selectPostViewsCountRounded,
} from '../selectors/post'
import { SHORTCUT_KEYS } from '../constants/application_types'

function mapStateToProps(state, props) {
  return {
    author: selectPostAuthor(state, props),
    categoryPostStatus: selectPostCategoryPostStatusForPath(state, props),
    categoryPostActions: selectPostCategoryPostActionsForPath(state, props),
    detailPath: selectPostDetailPath(state, props),
    deviceSize: selectDeviceSize(state),
    isCommentsRequesting: selectPostIsCommentsRequesting(state, props),
    isLoggedIn: selectIsLoggedIn(state),
    isOwnOriginalPost: selectPostIsOwnOriginal(state, props),
    isOwnPost: selectPostIsOwn(state, props),
    post: selectPost(state, props),
    postCommentsCount: selectPostCommentsCount(state, props),
    postLoved: selectPostLoved(state, props),
    postLovesCount: selectPostLovesCount(state, props),
    postReposted: selectPostReposted(state, props),
    postRepostsCount: selectPostRepostsCount(state, props),
    postViewsCountRounded: selectPostViewsCountRounded(state, props),
  }
}

class PostLightBoxContainer extends Component {
  static propTypes = {
    author: PropTypes.object.isRequired,
    categoryPostStatus: PropTypes.string,
    categoryPostActions: PropTypes.object,
    detailPath: PropTypes.string.isRequired,
    deviceSize: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    isCommentsRequesting: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
    isOwnOriginalPost: PropTypes.bool.isRequired,
    isOwnPost: PropTypes.bool.isRequired,
    isRelatedPost: PropTypes.bool,
    post: PropTypes.object.isRequired,
    postCommentsCount: PropTypes.number,
    postId: PropTypes.string.isRequired,
    postLoved: PropTypes.bool,
    postLovesCount: PropTypes.number,
    postReposted: PropTypes.bool,
    postRepostsCount: PropTypes.number,
    postViewsCountRounded: PropTypes.string,
  }

  static defaultProps = {
    categoryPostStatus: null,
    categoryPostActions: null,
    isRelatedPost: false,
    postCommentsCount: null,
    postLoved: false,
    postLovesCount: null,
    postReposted: false,
    postRepostsCount: null,
    postViewsCountRounded: null,
  }

  static childContextTypes = {
    onClickLovePost: PropTypes.func.isRequired,
    onClickRepostPost: PropTypes.func.isRequired,
    onClickSharePost: PropTypes.func.isRequired,
    onClickToggleComments: PropTypes.func.isRequired,
    onClickToggleLovers: PropTypes.func.isRequired,
    onClickToggleReposters: PropTypes.func.isRequired,
    onTrackRelatedPostClick: PropTypes.func.isRequired,
  }

  static contextTypes = {
    onClickOpenRegistrationRequestDialog: PropTypes.func.isRequired,
    onLaunchNativeEditor: PropTypes.func.isRequired,
    openShareDialog: PropTypes.func.isRequired,
    toggleLovePost: PropTypes.func.isRequired,
  }

  getChildContext() {
    const { isLoggedIn } = this.props
    return {
      onClickLovePost: isLoggedIn ? this.onClickLovePost : this.onOpenSignupModal,
      onClickRepostPost: isLoggedIn ? this.onClickRepostPost : this.onOpenSignupModal,
      onClickSharePost: this.onClickSharePost,
      onClickToggleComments: this.onClickToggleComments,
      onClickToggleLovers: this.onClickToggleLovers,
      onClickToggleReposters: this.onClickToggleReposters,
      onTrackRelatedPostClick: this.onTrackRelatedPostClick,
    }
  }

  componentWillMount() {
    this.bindKeys()
  }

  shouldComponentUpdate(nextProps) {
    return !Immutable.is(nextProps.post, this.props.post) ||
      [
        'categoryPostStatus',
        'isLoggedIn',
        'postId',
      ].some(prop =>
        nextProps[prop] !== this.props[prop],
      )
  }

  componentWillUnmount() {
    this.bindKeys(true)
  }

  onClickLovePost = () => {
    const { postLoved, post } = this.props
    const { toggleLovePost } = this.context
    const trackLabel = 'web_production.post_actions_love'
    toggleLovePost({ isLoved: postLoved, post, trackLabel })
  }

  onClickRepostPost = () => {
    const {
      detailPath,
      deviceSize,
      dispatch,
      isRelatedPost,
      post,
      postReposted,
    } = this.props

    dispatch(setIsLightBoxActive({ isActive: false }))
    if (!postReposted && !isRelatedPost) {
      dispatch(toggleReposting(post, true))
      dispatch(loadEditablePost(post.get('id')))
      if (deviceSize === 'mobile') {
        dispatch(push(detailPath))
      }
    } else {
      dispatch(push(detailPath))
      this.onTrackRelatedPostClick()
    }
  }

  onClickSharePost = () => {
    const { post, author } = this.props
    const { openShareDialog } = this.context
    openShareDialog({ post, postAuthor: author })
  }

  onClickToggleComments = () => {
    const {
      detailPath,
      deviceSize,
      dispatch,
      isLoggedIn,
      isRelatedPost,
      post,
    } = this.props

    dispatch(setIsLightBoxActive({ isActive: false }))
    if (isLoggedIn && !isRelatedPost) {
      if ((deviceSize === 'mobile') || isElloAndroid()) {
        dispatch(push(detailPath))
      } else {
        const nextShowComments = true
        dispatch(toggleComments(post, nextShowComments))
      }
    } else {
      dispatch(push(detailPath))
    }
  }

  onClickToggleLovers = () => {
    const { dispatch, postId } = this.props
    dispatch(openModal(
      <UserModal activeType="loves" postId={postId} tabs={this.getUserModalTabs()} />,
    ))
  }

  onClickToggleReposters = () => {
    const { dispatch, postId } = this.props
    dispatch(openModal(
      <UserModal activeType="reposts" postId={postId} tabs={this.getUserModalTabs()} />,
    ))
  }

  onCloseModal = () => {
    const { dispatch } = this.props
    dispatch(closeModal())
  }

  onFireCategoryPostAction = (action) => {
    const { dispatch } = this.props
    dispatch(sendCategoryPostAction(action))
  }

  onTrackRelatedPostClick = () => {
    const { dispatch, isRelatedPost } = this.props
    if (isRelatedPost) { dispatch(trackEvent('related_post_clicked')) }
  }

  onOpenSignupModal = () => {
    const { onClickOpenRegistrationRequestDialog } = this.context
    onClickOpenRegistrationRequestDialog('post-tools')
  }

  getUserModalTabs() {
    const { postLovesCount, postRepostsCount } = this.props
    const tabs = []
    if (postLovesCount > 0) {
      tabs.push({ type: 'loves', children: 'Lovers' })
    }
    if (postRepostsCount > 0) {
      tabs.push({ type: 'reposts', children: 'Reposters' })
    }
    return tabs
  }

  bindKeys(unbind) {
    Mousetrap.unbind(SHORTCUT_KEYS.LOVE)

    if (!unbind) {
      Mousetrap.bind(SHORTCUT_KEYS.LOVE, () => { this.onClickLovePost() })
    }
  }

  render() {
    const {
      author,
      categoryPostStatus,
      categoryPostActions,
      detailPath,
      isCommentsRequesting,
      isLoggedIn,
      isMobile,
      isOwnOriginalPost,
      isOwnPost,
      postCommentsCount,
      postId,
      postLoved,
      postLovesCount,
      postReposted,
      postRepostsCount,
      postViewsCountRounded,
    } = this.props

    return (
      <PostToolsLightBox
        author={author}
        categoryPostStatus={categoryPostStatus}
        categoryPostActions={categoryPostActions}
        categoryPostFireAction={this.onFireCategoryPostAction}
        detailPath={detailPath}
        isCommentsRequesting={isCommentsRequesting}
        isLoggedIn={isLoggedIn}
        isMobile={isMobile}
        isOwnOriginalPost={isOwnOriginalPost}
        isOwnPost={isOwnPost}
        postCommentsCount={postCommentsCount}
        postId={postId}
        postLoved={postLoved}
        postLovesCount={postLovesCount}
        postReposted={postReposted}
        postRepostsCount={postRepostsCount}
        postViewsCountRounded={postViewsCountRounded}
      />
    )
  }
}

export default connect(mapStateToProps)(PostLightBoxContainer)
