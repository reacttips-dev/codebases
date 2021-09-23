import { is } from 'immutable'
import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { trackEvent } from '../actions/analytics'
import {
  ErrorEditorial,
  InviteEditorial,
  JoinEditorial,
  LinkEditorial,
  PostStream,
  PostEditorial,
} from '../components/editorials/EditorialRenderables'
import { selectIsLoggedIn } from '../selectors/authentication'
import {
  selectEditorial,
  selectEditorialAnalyticsOptions,
  selectEditorialImageSource,
  selectEditorialKind,
  selectEditorialPath,
  selectEditorialPostId,
  selectEditorialPostStreamVariables,
  selectEditorialUrl,
} from '../selectors/editorial'
import { selectDPI } from '../selectors/gui'
import { selectPost, selectPostAuthor, selectPostDetailPath, selectPostLoved } from '../selectors/post'

const makeMapStateToProps = () => (
  (state: any, props) => {
    const editorial = selectEditorial(state, props)
    const postId = selectEditorialPostId(state, props)
    const dpi = selectDPI(state)
    return {
      dpi,
      editorial,
      isLoggedIn: selectIsLoggedIn(state),
      isPostLoved: selectPostLoved(state, { postId }),
      kind: selectEditorialKind(state, props),
      path: selectEditorialPath(state, props),
      post: selectPost(state, { postId }),
      postAuthor: selectPostAuthor(state, { postId }),
      postPath: selectPostDetailPath(state, { postId }),
      postStreamVariables: selectEditorialPostStreamVariables(state, props),
      sources: selectEditorialImageSource(state, props),
      url: selectEditorialUrl(state, props),
      trackOptions: selectEditorialAnalyticsOptions(state, props),
    }
  }
)

class EditorialContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    trackOptions: PropTypes.object.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    editorialId: PropTypes.string.isRequired,
    editorial: PropTypes.object.isRequired,
    isPostLoved: PropTypes.bool,
    sources: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired,
    postAuthor: PropTypes.object.isRequired,
    url: PropTypes.string,
    kind: PropTypes.string.isRequired,
  }

  static defaultProps = {
    isPostLoved: false,
    url: null,
  }

  static contextTypes = {
    onClickOpenRegistrationRequestDialog: PropTypes.func.isRequired,
    openShareDialog: PropTypes.func.isRequired,
    toggleLovePost: PropTypes.func.isRequired,
  }

  static childContextTypes = {
    onClickLovePost: PropTypes.func,
    onClickRepostEditorialPost: PropTypes.func,
    onClickOpenSignupModal: PropTypes.func,
    onClickSharePost: PropTypes.func.isRequired,
    onClickShareExternal: PropTypes.func.isRequired,
  }

  getChildContext() {
    const { isLoggedIn } = this.props
    return {
      onClickLovePost: isLoggedIn ? this.onClickLovePost : this.onClickOpenSignupModal,
      onClickRepostEditorialPost: isLoggedIn ? this.onClickRepostEditorialPost : this.onClickOpenSignupModal, // eslint-disable-line
      onClickOpenSignupModal: isLoggedIn ? null : this.onClickOpenSignupModal,
      onClickSharePost: this.onClickSharePost,
      onClickShareExternal: this.onClickShareExternal,
    }
  }

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.editorialId !== this.props.editorialId ||
      !is(nextProps.editorial, this.props.editorial) ||
      !is(nextProps.sources, this.props.sources) ||
      !is(nextProps.post, this.props.post)
    )
  }

  onClickLovePost = () => {
    const { isPostLoved, post, trackOptions } = this.props
    const { toggleLovePost } = this.context
    const trackLabel = 'editorial-module-loved'
    toggleLovePost({ isLoved: isPostLoved, post, trackLabel, trackOptions })
  }

  onClickRepostEditorialPost = (postPath) => {
    const { dispatch, trackOptions } = this.props
    dispatch(trackEvent('editorial-module-repost-clicked', trackOptions))
    browserHistory.push(postPath)
  }

  onClickOpenSignupModal = () => {
    const { onClickOpenRegistrationRequestDialog } = this.context
    onClickOpenRegistrationRequestDialog('editorial')
  }

  onClickSharePost = () => {
    const { post, postAuthor, trackOptions } = this.props
    const { openShareDialog } = this.context
    openShareDialog({ post, postAuthor, trackOptions })
  }

  onClickShareExternal = () => {
    const { url, trackOptions } = this.props
    const { openShareDialog } = this.context
    openShareDialog({ externalUrl: url, trackOptions })
  }

  onClickEditorial = () => {
    const { dispatch, trackOptions } = this.props
    dispatch(trackEvent('editorial-module-clicked', trackOptions))
  }

  render() {
    const props = {
      ...this.props,
      onClickEditorial: this.onClickEditorial,
    }
    switch (this.props.kind) {
      case 'external':
      case 'sponsored':
      case 'internal':
        return <LinkEditorial {...props} />
      case 'invite':
        return <InviteEditorial {...props} />
      case 'join':
        return <JoinEditorial {...props} />
      case 'post':
        return <PostEditorial {...props} />
      case 'post_stream':
        return <PostStream {...props} />
      default:
        return <ErrorEditorial {...props} />
    }
  }
}

export default connect(makeMapStateToProps)(EditorialContainer)

