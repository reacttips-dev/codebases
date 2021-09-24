import Immutable from 'immutable'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { openModal, closeModal } from '../../actions/modals'
import {
  createComment,
  toggleEditing as toggleCommentEditing,
  updateComment,
} from '../../actions/comments'
import {
  createPost,
  toggleEditing,
  toggleReposting,
  updatePost,
} from '../../actions/posts'
import { resetEditor, initializeEditor, fetchEditorCategories } from '../../actions/editor'
import { closeOmnibar } from '../../actions/omnibar'
import BlockCollection from './BlockCollection'
import ConfirmDialog from '../dialogs/ConfirmDialog'
import { selectIsLoggedIn } from '../../selectors/authentication'
import {
  selectPost,
  selectPostCommentsCount,
  selectPostIsEditing,
  selectPostIsEmpty,
  selectPostIsOwn,
  selectPostIsReposting,
} from '../../selectors/post'
import { selectHasAutoWatchEnabled, selectIsOwnPage } from '../../selectors/profile'

const editorUniqueIdentifiers = {}
export function getEditorId(post, comment, isComment, isZero) {
  const prefix = isComment ? 'commentEditor' : 'postEditor'
  let modelId = ''
  if (post && post.size) {
    modelId = post.get('id')
  } else if (comment && comment.size) {
    modelId = `${comment.get('postId')}_${comment.get('id')}`
  } else if (isZero) {
    modelId = 'Zero'
  } else {
    modelId = '0'
  }
  const fullPrefix = `${prefix}${modelId}`
  if ({}.hasOwnProperty.call(editorUniqueIdentifiers, fullPrefix)) {
    return editorUniqueIdentifiers[fullPrefix]
  }
  return fullPrefix
}

function mapStateToProps(state, props) {
  return {
    allowsAutoWatch: selectHasAutoWatchEnabled(state),
    hasComments: selectPostCommentsCount(state, props) > 0,
    isLoggedIn: selectIsLoggedIn(state),
    isOwnPage: selectIsOwnPage(state),
    isOwnPost: selectPostIsOwn(state, props),
    isPostEditing: selectPostIsEditing(state, props),
    isPostEmpty: selectPostIsEmpty(state, props),
    isPostReposting: selectPostIsReposting(state, props),
    post: selectPost(state, props),
  }
}

class Editor extends Component {

  static propTypes = {
    allowsAutoWatch: PropTypes.bool,
    autoPopulate: PropTypes.string,
    comment: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    hasComments: PropTypes.bool,
    inline: PropTypes.bool,
    isComment: PropTypes.bool,
    isLoggedIn: PropTypes.bool,
    isOwnPage: PropTypes.bool,
    isOwnPost: PropTypes.bool,
    isPostEditing: PropTypes.bool.isRequired,
    isPostEmpty: PropTypes.bool.isRequired,
    isPostReposting: PropTypes.bool.isRequired,
    isEditing: PropTypes.bool,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func,
    post: PropTypes.object,
    shouldPersist: PropTypes.bool,
  }

  static defaultProps = {
    allowsAutoWatch: false,
    autoPopulate: null,
    comment: null,
    hasComments: false,
    inline: false,
    isComment: false,
    isLoggedIn: false,
    isOwnPage: false,
    isOwnPost: false,
    isEditing: false,
    onCancel: null,
    onSubmit: null,
    post: null,
    shouldPersist: false,
  }

  static contextTypes = {
    onClickScrollToContent: PropTypes.func,
  }

  static childContextTypes = {
    onClickDismissAISuccess: PropTypes.func,
  }

  getChildContext() {
    return {
      onClickDismissAISuccess: this.onClickDismissAISuccess,
    }
  }

  componentWillMount() {
    const { dispatch, shouldPersist, isEditing, post } = this.props
    if (post && !isEditing) {
      dispatch(fetchEditorCategories())
    }
    dispatch(initializeEditor(this.getEditorIdentifier(), shouldPersist))
    this.state = { showArtistInviteSuccess: false }
  }

  onClickDismissAISuccess = () => {
    const { dispatch } = this.props
    clearTimeout(this.timeout)
    this.setState({ showArtistInviteSuccess: false })
    dispatch(closeOmnibar())
  }

  getEditorIdentifier() {
    const { autoPopulate, comment, isComment, post, shouldPersist } = this.props
    return getEditorId(post, comment, isComment, autoPopulate && !shouldPersist)
  }

  submit = (data, artistInviteId, categoryIds) => {
    const {
      allowsAutoWatch,
      comment,
      dispatch,
      isComment,
      isOwnPage,
      isPostEmpty,
      onSubmit,
      post,
    } = this.props
    if (isComment) {
      if (comment && comment.get('isEditing')) {
        dispatch(toggleCommentEditing(comment, false))
        dispatch(updateComment(comment, data, this.getEditorIdentifier()))
      } else {
        dispatch(createComment(allowsAutoWatch, data, this.getEditorIdentifier(), post.get('id')))
      }
    } else if (isPostEmpty) {
      if (artistInviteId) {
        this.setState({ showArtistInviteSuccess: true })
        this.timeout = setTimeout(this.onClickDismissAISuccess, 6660)
      } else {
        dispatch(closeOmnibar())
      }
      dispatch(createPost(data, this.getEditorIdentifier(), null, null,
        artistInviteId, categoryIds))
    } else if (post.get('isEditing')) {
      dispatch(toggleEditing(post, false))
      dispatch(updatePost(post, data, this.getEditorIdentifier()))
    } else if (post.get('isReposting')) {
      dispatch(toggleReposting(post, false))
      const repostId = post.get('repostId') || post.get('id')
      const repostedFromId = post.get('repostId') ? post.get('id') : null
      dispatch(createPost(data, this.getEditorIdentifier(),
        repostId, repostedFromId, artistInviteId, categoryIds),
      )
    }
    if (onSubmit) { onSubmit() }
    // if on own page scroll down to top of post content
    if (isOwnPage && !isComment) {
      const { onClickScrollToContent } = this.context
      onClickScrollToContent()
    }
  }

  cancel = () => {
    const { comment, isComment, isPostEmpty, post } = this.props
    if (isComment) {
      if (comment && comment.get('isEditing')) {
        this.launchCancelConfirm('edit')
      } else {
        this.launchCancelConfirm('comment')
      }
    } else if (isPostEmpty) {
      this.launchCancelConfirm('post')
    } else if (post.get('isEditing')) {
      this.launchCancelConfirm('edit')
    } else if (post.get('isReposting')) {
      this.launchCancelConfirm('repost')
    }
  }

  closeModal = () => {
    const { dispatch } = this.props
    dispatch(closeModal())
  }

  launchCancelConfirm = (label) => {
    const { dispatch } = this.props
    dispatch(openModal(
      <ConfirmDialog
        title={`Cancel ${label}?`}
        onConfirm={this.cancelConfirmed}
        onDismiss={this.closeModal}
      />))
  }

  cancelConfirmed = () => {
    const { comment, dispatch, isPostEmpty, onCancel, post } = this.props
    this.closeModal()
    dispatch(resetEditor(this.getEditorIdentifier()))
    dispatch(closeOmnibar())
    if (!isPostEmpty) {
      dispatch(toggleEditing(post, false))
      dispatch(toggleReposting(post, false))
    }
    if (comment) {
      dispatch(toggleCommentEditing(comment, false))
    }
    if (onCancel) { onCancel() }
  }

  render() {
    const {
      autoPopulate,
      comment,
      hasComments,
      inline,
      isComment,
      isLoggedIn,
      isOwnPost,
      isPostEditing,
      isPostEmpty,
      isPostReposting,
      post,
      shouldPersist,
    } = this.props
    if (!isLoggedIn) { return null }
    let blocks
    let repostContent
    let submitText
    if (autoPopulate && !shouldPersist) {
      blocks = Immutable.fromJS([{ kind: 'text', data: autoPopulate }])
      submitText = 'Publish'
    } else if (isComment) {
      if (comment && comment.get('isEditing')) {
        submitText = 'Update'
        blocks = comment.get('body')
      } else {
        submitText = 'Comment'
      }
    } else if (isPostEmpty) {
      submitText = 'Post'
    } else if (post.get('isReposting')) {
      submitText = 'Repost'
      if (post.get('repostId')) {
        repostContent = post.get('repostContent')
      } else {
        repostContent = post.get('content')
      }
    } else if (post.get('isEditing')) {
      submitText = 'Update'
      if (post.get('repostContent') && post.get('repostContent').size) {
        repostContent = post.get('repostContent')
      }
      if (post.get('body')) {
        blocks = post.get('body')
      }
    }
    const editorId = this.getEditorIdentifier()
    const key = `${editorId}_${(blocks ? blocks.size : '') + (repostContent ? repostContent.size : '')}`
    return (
      <BlockCollection
        blocks={blocks}
        cancelAction={this.cancel}
        editorId={editorId}
        hasComments={hasComments}
        inlineEditor={inline}
        isComment={isComment}
        isOwnPost={isOwnPost}
        isPostEditing={isPostEditing}
        isPostReposting={isPostReposting}
        key={key}
        post={post}
        repostContent={repostContent}
        showArtistInviteSuccess={this.state.showArtistInviteSuccess}
        submitAction={this.submit}
        submitText={submitText}
      />
    )
  }
}

export default connect(mapStateToProps)(Editor)

