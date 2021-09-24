import Immutable from 'immutable'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { loadUserDrawer } from '../actions/user'
import { loadComments, loadPostDetail } from '../actions/posts'
import { ErrorState4xx } from '../components/errors/Errors'
import { Paginator } from '../components/streams/Paginator'
import { PostDetail, PostDetailError } from '../components/views/PostDetail'
import { POST } from '../constants/action_types'
import { scrollToPosition, scrollToSelector } from '../lib/jello'
import { postLovers, postReposters } from '../networking/api'
import { selectIsLoggedIn } from '../selectors/authentication'
import { selectColumnCount, selectInnerHeight, selectInnerWidth } from '../selectors/gui'
import { selectParamsToken, selectParamsUsername } from '../selectors/params'
import {
  selectPost,
  selectPostAuthor,
  selectPostDetailTabs,
  selectPostHasRelatedButton,
  selectPostIsEmpty,
  selectPropsLocationStateFrom,
} from '../selectors/post'
import { selectAvatar } from '../selectors/profile'
import { selectPropsLocationKey } from '../selectors/routing'
import { selectStreamType } from '../selectors/stream'

function mapStateToProps(state, props) {
  return {
    author: selectPostAuthor(state, props),
    avatar: selectAvatar(state),
    columnCount: selectColumnCount(state, props),
    hasRelatedPostsButton: selectPostHasRelatedButton(state, props),
    innerHeight: selectInnerHeight(state, props),
    innerWidth: selectInnerWidth(state, props),
    isLoggedIn: selectIsLoggedIn(state),
    isPostEmpty: selectPostIsEmpty(state, props),
    locationKey: selectPropsLocationKey(state, props),
    locationStateFrom: selectPropsLocationStateFrom(state, props),
    paramsToken: selectParamsToken(state, props),
    paramsUsername: selectParamsUsername(state, props),
    post: selectPost(state, props),
    tabs: selectPostDetailTabs(state, props),
    streamType: selectStreamType(state),
  }
}

function getShouldInlineComments(innerWidth) {
  return innerWidth < 960
}

class PostDetailContainer extends Component {

  static propTypes = {
    author: PropTypes.object,
    avatar: PropTypes.object,
    columnCount: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired,
    hasRelatedPostsButton: PropTypes.bool.isRequired,
    innerHeight: PropTypes.number.isRequired,
    innerWidth: PropTypes.number.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isPostEmpty: PropTypes.bool.isRequired,
    locationKey: PropTypes.string,
    locationStateFrom: PropTypes.string,
    post: PropTypes.object,
    paramsToken: PropTypes.string.isRequired,
    paramsUsername: PropTypes.string.isRequired,
    streamType: PropTypes.string, // eslint-disable-line
    tabs: PropTypes.array.isRequired,
  }

  static defaultProps = {
    author: null,
    avatar: null,
    locationKey: null,
    locationStateFrom: null,
    post: null,
    streamType: null,
  }

  static childContextTypes = {
    onToggleInlineCommenting: PropTypes.func.isRequired,
    onClickScrollToRelatedPosts: PropTypes.func.isRequired,
  }

  getChildContext() {
    return {
      onToggleInlineCommenting: this.onToggleInlineCommenting,
      onClickScrollToRelatedPosts: this.onClickScrollToRelatedPosts,
    }
  }

  componentWillMount() {
    const { dispatch, paramsToken, paramsUsername } = this.props
    this.state = { activeType: 'comments', isInlineCommenting: false, renderType: POST.DETAIL_REQUEST }
    dispatch(loadPostDetail(paramsToken, paramsUsername))
  }

  componentDidMount() {
    if (this.props.locationStateFrom === 'PaginatorLink') {
      requestAnimationFrame(() => {
        scrollToSelector('.TabListStreamContainer', { boundary: 'bottom', offset: 200 })
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, locationKey, paramsToken, paramsUsername } = this.props
    // a click on the notification post link when we are already on the post
    // should trigger the loading of additional content if it exists
    if ((paramsToken !== nextProps.paramsToken || paramsUsername !== nextProps.paramsUsername) ||
        (paramsToken === nextProps.paramsToken && locationKey !== nextProps.locationKey)) {
      // load the new detail or trigger a reload of the current
      dispatch(loadPostDetail(nextProps.paramsToken, nextProps.paramsUsername))
      const action = this.getStreamAction()
      if (action) { dispatch(action) }
    }
    switch (nextProps.streamType) {
      case POST.DETAIL_FAILURE:
      case POST.DETAIL_REQUEST:
      case POST.DETAIL_SUCCESS:
        this.setState({ renderType: nextProps.streamType })
        break
      default:
        break
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!nextProps.author || !nextProps.post) { return false }
    // only allow innerWidth to allow a render if we cross the break 3
    // threshold on either side since innerWidth is calculated on resize
    if (getShouldInlineComments(nextProps.innerWidth) !==
      getShouldInlineComments(this.props.innerWidth)) {
      return true
    }
    return !Immutable.is(nextProps.post, this.props.post) ||
      ['hasRelatedPostsButton', 'paramsToken', 'paramsUsername'].some(prop =>
        nextProps[prop] !== this.props[prop],
      ) ||
      ['activeType', 'isInlineCommenting', 'renderType'].some(prop => nextState[prop] !== this.state[prop])
  }

  onToggleInlineCommenting = () => {
    this.setState({ isInlineCommenting: !this.state.isInlineCommenting })
  }

  onClickScrollToRelatedPosts = () => {
    const { innerHeight } = this.props
    const el = document.querySelector('.RelatedPostsStreamContainer')
    if (!el) { return }
    const rect = el.getBoundingClientRect()
    const dy = innerHeight < rect.height ? rect.height + (innerHeight - rect.height) : rect.height
    scrollToPosition(0, window.scrollY + dy + (rect.top - innerHeight))
  }

  getStreamAction() {
    const { author, post } = this.props
    const { activeType } = this.state
    const postId = post.get('id')
    switch (activeType) {
      case 'loves':
        return loadUserDrawer(postLovers(postId), postId, activeType)
      case 'reposts':
        return loadUserDrawer(postReposters(postId), postId, activeType)
      default:
        return author && author.get('hasCommentingEnabled') ? loadComments(post.get('id'), false) : null
    }
  }

  render() {
    const {
      author,
      avatar,
      columnCount,
      hasRelatedPostsButton,
      isLoggedIn,
      isPostEmpty,
      paramsToken,
      post,
      tabs,
    } = this.props
    const { activeType, isInlineCommenting, renderType } = this.state
    // render loading/failure if we don't have an initial post
    if (isPostEmpty) {
      if (renderType === POST.DETAIL_REQUEST) {
        return (
          <section className="StreamContainer">
            <Paginator className="isBusy" />
          </section>
        )
      } else if (renderType === POST.DETAIL_FAILURE) {
        return (
          <PostDetailError>
            <ErrorState4xx />
          </PostDetailError>
        )
      }
      return null
    }
    const props = {
      activeType,
      author,
      avatar,
      columnCount,
      hasEditor: author && author.get('hasCommentingEnabled') && !(post.get('isReposting') || post.get('isEditing')),
      hasRelatedPostsButton,
      isInlineCommenting,
      isLoggedIn,
      key: `postDetail_${paramsToken}`,
      post,
      shouldInlineComments: getShouldInlineComments(this.props.innerWidth),
      streamAction: this.getStreamAction(),
      tabs,
    }
    return <PostDetail {...props} />
  }
}

export default connect(mapStateToProps)(PostDetailContainer)

