import { is } from 'immutable'
import { createSelector } from 'reselect'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { CuratedPost } from '../components/editorials/EditorialRenderables'
import { selectIsLoggedIn } from '../selectors/authentication'
import { selectDPI } from '../selectors/gui'
import {
  selectPost,
  selectPostAuthor,
  selectPostAuthorUsername,
  selectPostDetailPath,
  selectPostFirstImage,
  selectPostId,
  selectPostIsEmpty,
  selectPostLoved,
} from '../selectors/post'

const selectEditorialTrackOptions = (state, props) => props.editorialTrackOptions || {}

const selectTrackOptions = createSelector(
  [selectEditorialTrackOptions, selectPostId], (editorialTrackOptions, postId) => ({
    ...(editorialTrackOptions || {}),
    ...(postId ? { postId } : {}),
  }),
)

const makeMapStateToProps = () => (
  (state, props) => ({
    detailPath: selectPostDetailPath(state, props),
    dpi: selectDPI(state),
    isLoggedIn: selectIsLoggedIn(state),
    isPostEmpty: selectPostIsEmpty(state, props),
    isPostLoved: selectPostLoved(state, props),
    post: selectPost(state, props),
    postAuthor: selectPostAuthor(state, props),
    sources: selectPostFirstImage(state, props),
    trackOptions: selectTrackOptions(state, props),
    username: selectPostAuthorUsername(state, props),
  })
)

class PostStreamContainer extends Component {
  static propTypes = {
    dpi: PropTypes.string.isRequired,
    detailPath: PropTypes.string.isRequired,
    fallbackSources: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]).isRequired,
    onClickEditorial: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isPostEmpty: PropTypes.bool,
    isPostLoved: PropTypes.bool.isRequired,
    post: PropTypes.object.isRequired,
    postAuthor: PropTypes.object.isRequired,
    sources: PropTypes.object,
    title: PropTypes.string.isRequired,
    trackOptions: PropTypes.object.isRequired,
    username: PropTypes.string.isRequired,
  }

  static defaultProps = {
    sources: null,
  }

  static contextTypes = {
    onClickOpenSignupModal: PropTypes.func,
    openShareDialog: PropTypes.func.isRequired,
    toggleLovePost: PropTypes.func.isRequired,
  }

  static childContextTypes = {
    onClickLovePost: PropTypes.func,
    onClickSharePost: PropTypes.func.isRequired,
  }

  getChildContext() {
    const { isLoggedIn } = this.props
    const { onClickOpenSignupModal } = this.context
    return {
      onClickLovePost: isLoggedIn ? this.onClickLovePost : onClickOpenSignupModal,
      onClickSharePost: this.onClickSharePost,
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.isPostEmpty) { return false }
    return !is(nextProps.post, this.props.post)
  }

  onClickSharePost = () => {
    const { post, postAuthor, trackOptions } = this.props
    const { openShareDialog } = this.context
    openShareDialog({ post, postAuthor, trackOptions })
  }

  onClickLovePost = () => {
    const { isPostLoved, post, trackOptions } = this.props
    const { toggleLovePost } = this.context
    const trackLabel = 'editorial-module-loved'
    toggleLovePost({ isLoved: isPostLoved, post, trackLabel, trackOptions })
  }

  render() {
    const props = {
      dpi: this.props.dpi,
      detailPath: this.props.detailPath,
      fallbackSources: this.props.fallbackSources,
      isPostLoved: this.props.isPostLoved,
      onClickEditorial: this.props.onClickEditorial,
      sources: this.props.sources,
      title: this.props.title,
      username: this.props.username,
    }
    return <CuratedPost {...props} />
  }
}

export default connect(makeMapStateToProps)(PostStreamContainer)

