import Immutable from 'immutable'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push, replace } from 'react-router-redux'
import set from 'lodash/set'
import { trackEvent } from '../actions/analytics'
import { openModal, closeModal } from '../actions/modals'
import {
  deletePost,
  flagPost,
  loadEditablePost,
  toggleComments,
  toggleEditing,
  toggleReposting,
  unwatchPost,
  watchPost,
} from '../actions/posts'
import { sendAdminAction } from '../actions/artist_invites'
import { sendCategoryPostAction } from '../actions/category_posts'
import ConfirmDialog from '../components/dialogs/ConfirmDialog'
import FlagDialog from '../components/dialogs/FlagDialog'
import {
  ArtistInviteSubmissionHeader,
  CategoryHeader,
  Post,
  PostDetailAsideBottom,
  PostDetailAsideTop,
  PostBody,
  PostBodyWithLightBox,
  PostHeader,
  PostDetailHeader,
  UserModal,
} from '../components/posts/PostRenderables'
import { isElloAndroid } from '../lib/jello'
import * as ElloAndroidInterface from '../lib/android_interface'
import { selectIsLoggedIn } from '../selectors/authentication'
import {
  selectColumnWidth,
  selectCommentOffset,
  selectContentWidth,
  selectDeviceSize,
  selectInnerHeight,
  selectInnerWidth,
  selectIsMobile,
} from '../selectors/gui'
import {
  selectPost,
  selectPostAuthor,
  selectPostArtistInvite,
  selectPostArtistInviteSubmission,
  selectPostArtistInviteSubmissionStatus,
  selectPostBody,
  selectPostCategoryName,
  selectPostCategorySlug,
  selectPostCategoryPostStatusForPath,
  selectPostCategoryPostActionsForPath,
  selectPostCommentsCount,
  selectPostContent,
  selectPostContentWarning,
  selectPostCreatedAt,
  selectPostDetailPath,
  selectPostIsArtistInviteSubmission,
  selectPostIsCommentsRequesting,
  selectPostIsEmpty,
  selectPostIsGridMode,
  selectPostIsOwn,
  selectPostIsOwnOriginal,
  selectPostIsRepost,
  selectPostIsReposting,
  selectPostIsWatching,
  selectPostLoved,
  selectPostLovesCount,
  selectPostRepostAuthorWithFallback,
  selectPostRepostContent,
  selectPostReposted,
  selectPostRepostsCount,
  selectPostShowCommentEditor,
  selectPostShowEditor,
  selectPostSummary,
  selectPostViewsCountRounded,
  selectOriginalPostArtistInvite,
  selectOriginalPostArtistInviteSubmission,
  selectPropsPostId,
} from '../selectors/post'
import { selectAvatar } from '../selectors/profile'
import {
  selectShowCategoryHeader,
  selectIsPostDetail,
  selectPathname,
  selectPreviousPath,
} from '../selectors/routing'

export function makeMapStateToProps() {
  return (state, props) =>
    ({
      avatar: selectAvatar(state),
      author: selectPostAuthor(state, props),
      categoryName: selectPostCategoryName(state, props),
      categoryPath: selectPostCategorySlug(state, props),
      categoryPostStatus: selectPostCategoryPostStatusForPath(state, props),
      categoryPostActions: selectPostCategoryPostActionsForPath(state, props),
      columnWidth: selectColumnWidth(state),
      commentOffset: selectCommentOffset(state),
      content: selectPostContent(state, props),
      contentWarning: selectPostContentWarning(state, props),
      contentWidth: selectContentWidth(state),
      detailPath: selectPostDetailPath(state, props),
      deviceSize: selectDeviceSize(state),
      innerHeight: selectInnerHeight(state),
      innerWidth: selectInnerWidth(state),
      isArtistInviteSubmission: selectPostIsArtistInviteSubmission(state, props),
      artistInviteSubmission: selectPostArtistInviteSubmission(state, props),
      artistInvite: selectPostArtistInvite(state, props),
      submissionStatus: selectPostArtistInviteSubmissionStatus(state, props),
      originalPostArtistInviteSubmission: selectOriginalPostArtistInviteSubmission(state, props),
      originalPostArtistInvite: selectOriginalPostArtistInvite(state, props),
      isCommentsRequesting: selectPostIsCommentsRequesting(state, props),
      showCategoryHeader: selectShowCategoryHeader(state, props),
      isGridMode: !props.isLightBox && selectPostIsGridMode(state, props),
      isLoggedIn: selectIsLoggedIn(state),
      isMobile: selectIsMobile(state),
      isOwnOriginalPost: selectPostIsOwnOriginal(state, props),
      isOwnPost: selectPostIsOwn(state, props),
      isPostDetail: !props.isRelatedPost && selectIsPostDetail(state, props),
      isPostEmpty: selectPostIsEmpty(state, props),
      isRepost: selectPostIsRepost(state, props),
      isReposting: selectPostIsReposting(state, props),
      isWatchingPost: selectPostIsWatching(state, props),
      pathname: selectPathname(state),
      post: selectPost(state, props),
      postBody: selectPostBody(state, props),
      postCommentsCount: selectPostCommentsCount(state, props),
      postCreatedAt: selectPostCreatedAt(state, props),
      postId: selectPropsPostId(state, props),
      postLoved: selectPostLoved(state, props),
      postLovesCount: selectPostLovesCount(state, props),
      postReposted: selectPostReposted(state, props),
      postRepostsCount: selectPostRepostsCount(state, props),
      postViewsCountRounded: selectPostViewsCountRounded(state, props),
      previousPath: selectPreviousPath(state),
      repostAuthor: selectPostRepostAuthorWithFallback(state, props),
      repostContent: selectPostRepostContent(state, props),
      showCommentEditor: selectPostShowCommentEditor(state, props),
      showEditor: !props.isLightBox && selectPostShowEditor(state, props),
      summary: selectPostSummary(state, props),
    })
}

class PostContainer extends Component {

  static propTypes = {
    adminActions: PropTypes.object,
    author: PropTypes.object.isRequired,
    avatar: PropTypes.object,
    categoryName: PropTypes.string,
    categoryPath: PropTypes.string,
    categoryPostStatus: PropTypes.string,
    categoryPostActions: PropTypes.object,
    columnWidth: PropTypes.number.isRequired,
    commentOffset: PropTypes.number.isRequired,
    content: PropTypes.object,
    contentWarning: PropTypes.string,
    contentWidth: PropTypes.number.isRequired,
    detailPath: PropTypes.string.isRequired,
    deviceSize: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    innerHeight: PropTypes.number.isRequired,
    innerWidth: PropTypes.number.isRequired,
    artistInviteSubmission: PropTypes.object,
    artistInvite: PropTypes.object,
    originalPostArtistInviteSubmission: PropTypes.object,
    originalPostArtistInvite: PropTypes.object,
    isArtistInviteSubmission: PropTypes.bool.isRequired,
    isCommentsRequesting: PropTypes.bool.isRequired,
    showCategoryHeader: PropTypes.bool.isRequired,
    isGridMode: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
    isOwnOriginalPost: PropTypes.bool.isRequired,
    isOwnPost: PropTypes.bool.isRequired,
    isNarrowPostDetail: PropTypes.bool,
    isPostDetail: PropTypes.bool.isRequired,
    isPostEmpty: PropTypes.bool.isRequired,
    isPostHeaderHidden: PropTypes.bool,
    isRelatedPost: PropTypes.bool,
    isRepost: PropTypes.bool.isRequired,
    isReposting: PropTypes.bool.isRequired,
    isWatchingPost: PropTypes.bool.isRequired,
    isLightBox: PropTypes.bool,
    lightBoxSelectedIdPair: PropTypes.object,
    pathname: PropTypes.string.isRequired,
    post: PropTypes.object.isRequired,
    postBody: PropTypes.object,
    postCommentsCount: PropTypes.number,
    postCreatedAt: PropTypes.string,
    postId: PropTypes.string.isRequired,
    postLoved: PropTypes.bool,
    postLovesCount: PropTypes.number,
    postReposted: PropTypes.bool,
    postRepostsCount: PropTypes.number,
    postViewsCountRounded: PropTypes.string,
    previousPath: PropTypes.string,
    repostAuthor: PropTypes.object,
    repostContent: PropTypes.object,
    resizeLightBox: PropTypes.bool,
    showCommentEditor: PropTypes.bool.isRequired,
    showEditor: PropTypes.bool.isRequired,
    submissionStatus: PropTypes.string,
    summary: PropTypes.object,
    toggleLightBox: PropTypes.func,
    type: PropTypes.string,
  }

  static defaultProps = {
    adminActions: null,
    artistInviteSubmission: null,
    artistInvite: null,
    originalPostArtistInviteSubmission: null,
    originalPostArtistInvite: null,
    avatar: null,
    categoryName: null,
    categoryPath: null,
    categoryPostStatus: null,
    categoryPostActions: null,
    content: null,
    contentWarning: null,
    isNarrowPostDetail: false,
    isPostHeaderHidden: false,
    isRelatedPost: false,
    isLightBox: false,
    lightBoxSelectedIdPair: null,
    postBody: null,
    postCommentsCount: null,
    postCreatedAt: null,
    postLoved: false,
    postLovesCount: null,
    postReposted: false,
    postRepostsCount: null,
    postViewsCountRounded: null,
    previousPath: null,
    repostAuthor: null,
    repostContent: null,
    resizeLightBox: false,
    submissionStatus: null,
    summary: null,
    toggleLightBox: null,
    type: null,
  }

  static childContextTypes = {
    onClickAction: PropTypes.func.isRequired,
    onClickDeletePost: PropTypes.func.isRequired,
    onClickEditPost: PropTypes.func.isRequired,
    onClickFlagPost: PropTypes.func.isRequired,
    onClickLovePost: PropTypes.func.isRequired,
    onClickRepostPost: PropTypes.func.isRequired,
    onClickSharePost: PropTypes.func.isRequired,
    onClickToggleComments: PropTypes.func.isRequired,
    onClickToggleLovers: PropTypes.func.isRequired,
    onClickToggleReposters: PropTypes.func.isRequired,
    onClickWatchPost: PropTypes.func.isRequired,
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
      onClickAction: this.onClickAction,
      onClickDeletePost: this.onClickDeletePost,
      onClickEditPost: this.onClickEditPost,
      onClickFlagPost: this.onClickFlagPost,
      onClickLovePost: isLoggedIn ? this.onClickLovePost : this.onOpenSignupModal,
      onClickRepostPost: isLoggedIn ? this.onClickRepostPost : this.onOpenSignupModal,
      onClickSharePost: this.onClickSharePost,
      onClickToggleComments: this.onClickToggleComments,
      onClickToggleLovers: this.onClickToggleLovers,
      onClickToggleReposters: this.onClickToggleReposters,
      onClickWatchPost: isLoggedIn ? this.onClickWatchPost : this.onOpenSignupModal,
      onTrackRelatedPostClick: this.onTrackRelatedPostClick,
    }
  }

  componentWillMount() {
    this.state = {
      isCommentsActive: false,
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.isPostEmpty) { return false }
    return !Immutable.is(nextProps.post, this.props.post) ||
      !Immutable.is(nextProps.adminActions, this.props.adminActions) ||
      [
        'columnWidth',
        'contentWidth',
        'innerHeight',
        'innerWidth',
        'isGridMode',
        'isLoggedIn',
        'isMobile',
        'submissionStatus',
        'lightBoxSelectedIdPair',
        'resizeLightBox',
        'categoryPostStatus',
      ].some(prop =>
        nextProps[prop] !== this.props[prop],
      )
  }

  onClickDeletePost = () => {
    const { dispatch } = this.props
    dispatch(openModal(
      <ConfirmDialog
        title="Delete Post?"
        onConfirm={this.onConfirmDeletePost}
        onDismiss={this.onCloseModal}
      />))
  }

  onConfirmDeletePost = () => {
    const { dispatch, pathname, post, previousPath } = this.props
    this.onCloseModal()
    const action = deletePost(post)
    if (pathname.match(post.get('token'))) {
      set(action, 'meta.successAction', replace(previousPath || '/'))
    }
    dispatch(action)
  }

  onClickEditPost = () => {
    const { dispatch, post } = this.props
    dispatch(toggleEditing(post, true))
    dispatch(loadEditablePost(post.get('id')))
  }

  onClickFlagPost = () => {
    const { deviceSize, dispatch } = this.props
    dispatch(openModal(
      <FlagDialog
        deviceSize={deviceSize}
        onResponse={this.onPostWasFlagged}
        onConfirm={this.onCloseModal}
      />))
  }

  onPostWasFlagged = ({ flag }) => {
    const { dispatch, post } = this.props
    dispatch(flagPost(post, flag))
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
      isGridMode,
      isRelatedPost,
      post,
      postReposted,
    } = this.props
    if (!postReposted && !isRelatedPost) {
      dispatch(toggleReposting(post, true))
      dispatch(loadEditablePost(post.get('id')))
      if (isGridMode && deviceSize === 'mobile') {
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
    const { detailPath, deviceSize, dispatch, isGridMode, isLoggedIn,
      isRelatedPost, post, showCommentEditor } = this.props
    if (isLoggedIn && !isRelatedPost) {
      if ((isGridMode && deviceSize === 'mobile') || isElloAndroid()) {
        dispatch(push(detailPath))
      } else {
        const nextShowComments = !showCommentEditor
        this.setState({ isCommentsActive: nextShowComments })
        dispatch(toggleComments(post, nextShowComments))
      }
    } else {
      dispatch(push(detailPath))
      if (isRelatedPost) { this.onTrackRelatedPostClick() }
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

  onClickWatchPost = () => {
    const { dispatch, post, isWatchingPost } = this.props
    if (isWatchingPost) {
      dispatch(unwatchPost(post))
    } else {
      dispatch(watchPost(post))
    }
  }

  onCloseModal = () => {
    const { dispatch } = this.props
    dispatch(closeModal())
  }

  onTrackRelatedPostClick = () => {
    const { dispatch, isRelatedPost } = this.props
    if (isRelatedPost) { dispatch(trackEvent('related_post_clicked')) }
  }

  onOpenSignupModal = () => {
    const { onClickOpenRegistrationRequestDialog } = this.context
    onClickOpenRegistrationRequestDialog('post-tools')
  }

  onClickAction = (action) => {
    const { dispatch } = this.props
    dispatch(sendAdminAction(action))
  }

  onFireCategoryPostAction = (action) => {
    const { dispatch } = this.props
    dispatch(sendCategoryPostAction(action))
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

  render() {
    const {
      adminActions,
      author,
      artistInvite,
      artistInviteSubmission,
      originalPostArtistInvite,
      originalPostArtistInviteSubmission,
      avatar,
      categoryName,
      categoryPath,
      categoryPostStatus,
      categoryPostActions,
      columnWidth,
      commentOffset,
      content,
      contentWarning,
      contentWidth,
      detailPath,
      innerHeight,
      innerWidth,
      isArtistInviteSubmission,
      isCommentsRequesting,
      showCategoryHeader,
      isGridMode,
      isLoggedIn,
      isMobile,
      isOwnOriginalPost,
      isOwnPost,
      isNarrowPostDetail,
      isPostDetail,
      isPostEmpty,
      isPostHeaderHidden,
      isRelatedPost,
      isRepost,
      isReposting,
      isWatchingPost,
      isLightBox,
      lightBoxSelectedIdPair,
      post,
      postBody,
      postCommentsCount,
      postCreatedAt,
      postId,
      postLoved,
      postLovesCount,
      postReposted,
      postRepostsCount,
      postViewsCountRounded,
      repostAuthor,
      repostContent,
      resizeLightBox,
      showCommentEditor,
      showEditor,
      submissionStatus,
      summary,
      toggleLightBox,
      type,
    } = this.props
    const { onLaunchNativeEditor } = this.context
    if (isPostEmpty || !author || !author.get('id')) { return null }
    let postHeader
    const headerProps = { detailPath, postCreatedAt, postId }
    if (isLightBox || (!isRepost && isPostHeaderHidden)) {
      postHeader = null
    } else if (!isRepost && showCategoryHeader && categoryName && categoryPath) {
      postHeader = (
        <CategoryHeader
          {...headerProps}
          author={author}
          categoryName={categoryName}
          categoryPath={categoryPath}
        />
      )
    } else if (!isRepost && showCategoryHeader && isArtistInviteSubmission) {
      postHeader = (
        <ArtistInviteSubmissionHeader
          {...headerProps}
          author={author}
        />
      )
    } else if (isPostDetail) {
      postHeader = (
        <PostDetailHeader
          {...headerProps}
          author={repostAuthor || author}
          repostedBy={repostAuthor ? author : null}
          artistInviteSubmission={artistInviteSubmission}
          artistInviteSubmissionStatus={submissionStatus}
          artistInvite={artistInvite}
          originalPostArtistInviteSubmission={originalPostArtistInviteSubmission}
          originalPostArtistInvite={originalPostArtistInvite}
          innerWidth={innerWidth}
          inUserDetail={repostAuthor ? isPostHeaderHidden : null}
          isArtistInviteSubmission={isArtistInviteSubmission}
          isRepost={isRepost}
          isOwnPost={isOwnPost}
        />
      )
    } else {
      postHeader = (
        <PostHeader
          {...headerProps}
          author={repostAuthor || author}
          repostedBy={repostAuthor ? author : null}
          inUserDetail={repostAuthor ? isPostHeaderHidden : null}
          isArtistInviteSubmission={isArtistInviteSubmission}
          isRepost={isRepost}
          isOwnPost={isOwnPost}
          categoryPostStatus={categoryPostStatus}
          categoryPostActions={categoryPostActions}
          categoryPostFireAction={this.onFireCategoryPostAction}
        />
      )
    }

    const isRepostAnimating = isReposting && !postBody
    const supportsNativeEditor = ElloAndroidInterface.supportsNativeEditor()
    if (supportsNativeEditor) {
      if (showEditor) {
        onLaunchNativeEditor(post, false, null)
      }
    }
    switch (type) {
      case 'PostDetailAsideBottom':
        return (
          <PostDetailAsideBottom
            {...{
              author,
              detailPath,
              innerWidth,
              isCommentsActive: this.state.isCommentsActive,
              isCommentsRequesting,
              isGridMode,
              isLoggedIn,
              isMobile,
              isOwnOriginalPost,
              isOwnPost,
              isPostDetail,
              isRelatedPost,
              isRepostAnimating,
              isWatchingPost,
              postCommentsCount,
              postCreatedAt,
              postId,
              postLoved,
              postLovesCount,
              postReposted,
              postRepostsCount,
              postViewsCountRounded,
              toggleLightBox,
            }}
          />
        )
      case 'PostDetailAsideTop':
        return (
          <PostDetailAsideTop
            {...{
              author,
              detailPath,
              isCommentsActive: this.state.isCommentsActive,
              isCommentsRequesting,
              isGridMode,
              isLoggedIn,
              isMobile,
              isOwnOriginalPost,
              isOwnPost,
              isPostDetail,
              isRelatedPost,
              isRepostAnimating,
              isWatchingPost,
              postCommentsCount,
              postCreatedAt,
              postHeader,
              postId,
              postLoved,
              postLovesCount,
              postReposted,
              postRepostsCount,
              postViewsCountRounded,
            }}
          />
        )
      case 'PostDetailBody':
        if (isPostDetail) {
          return (
            <PostBodyWithLightBox
              {...{
                author,
                columnWidth,
                commentOffset,
                content,
                contentWarning,
                contentWidth,
                detailPath,
                innerHeight,
                innerWidth,
                isGridMode,
                isPostDetail,
                isRepost,
                post,
                postId,
                repostContent,
                showEditor,
                summary,
                supportsNativeEditor,
              }}
            />
          )
        }
        return (
          <PostBody
            {...{
              author,
              columnWidth,
              commentOffset,
              content,
              contentWarning,
              contentWidth,
              detailPath,
              innerHeight,
              innerWidth,
              isGridMode,
              isPostDetail,
              isRepost,
              post,
              postId,
              repostContent,
              showEditor,
              summary,
              supportsNativeEditor,
            }}
          />
        )
      default:
        return (
          <Post
            {...{
              adminActions,
              author,
              avatar,
              columnWidth,
              commentOffset,
              content,
              contentWarning,
              contentWidth,
              detailPath,
              innerHeight,
              innerWidth,
              isCommentsActive: this.state.isCommentsActive,
              isCommentsRequesting,
              isGridMode,
              isLoggedIn,
              isMobile,
              isOwnOriginalPost,
              isOwnPost,
              isNarrowPostDetail,
              isPostDetail,
              isPostHeaderHidden,
              isRelatedPost,
              isRepost,
              isRepostAnimating,
              isWatchingPost,
              isLightBox,
              lightBoxSelectedIdPair,
              post,
              postCommentsCount,
              postCreatedAt,
              postHeader,
              postId,
              postLoved,
              postLovesCount,
              postReposted,
              postRepostsCount,
              postViewsCountRounded,
              repostContent,
              resizeLightBox,
              showCommentEditor,
              showEditor,
              submissionStatus,
              summary,
              supportsNativeEditor,
              toggleLightBox,
            }}
          />
        )
    }
  }
}

export default connect(makeMapStateToProps)(PostContainer)

