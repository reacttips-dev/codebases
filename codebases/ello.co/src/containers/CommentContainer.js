import Immutable from 'immutable'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { EDITOR } from '../constants/action_types'
import { deleteComment, flagComment, loadEditableComment, toggleEditing } from '../actions/comments'
import { openModal, closeModal } from '../actions/modals'
import Editor, { getEditorId } from '../components/editor/Editor'
import { CommentBody, CommentHeader } from '../components/comments/CommentRenderables'
import CommentTools from '../components/comments/CommentTools'
import ConfirmDialog from '../components/dialogs/ConfirmDialog'
import FlagDialog from '../components/dialogs/FlagDialog'
import { isElloAndroid, scrollToLastTextBlock } from '../lib/jello'
import * as ElloAndroidInterface from '../lib/android_interface'
import { selectIsLoggedIn } from '../selectors/authentication'
import {
  selectComment,
  selectCommentAuthor,
  selectCommentBody,
  selectCommentCanBeDeleted,
  selectCommentContent,
  selectCommentCreatedAt,
  selectCommentIsEditing,
  selectCommentIsOwn,
  selectCommentPost,
  selectCommentPostDetailPath,
  selectPropsCommentId,
} from '../selectors/comment'
import {
  selectColumnWidth,
  selectCommentOffset,
  selectContentWidth,
  selectDeviceSize,
  selectInnerHeight,
  selectIsGridMode,
  selectIsNavbarHidden,
} from '../selectors/gui'
import { selectIsPostDetail } from '../selectors/routing'

export function makeMapStateToProps() {
  return (state, props) => {
    const isPostDetail = selectIsPostDetail(state, props)
    const isGridMode = selectIsGridMode(state)
    return {
      author: selectCommentAuthor(state, props),
      canDeleteComment: selectCommentCanBeDeleted(state, props),
      columnWidth: selectColumnWidth(state),
      comment: selectComment(state, props),
      commentBody: selectCommentBody(state, props),
      commentCreatedAt: selectCommentCreatedAt(state, props),
      commentId: selectPropsCommentId(state, props),
      commentOffset: selectCommentOffset(state),
      content: selectCommentContent(state, props),
      contentWidth: isPostDetail || !isGridMode ? 650 : selectContentWidth(state),
      detailPath: selectCommentPostDetailPath(state, props),
      deviceSize: selectDeviceSize(state),
      innerHeight: selectInnerHeight(state),
      isEditing: selectCommentIsEditing(state, props),
      isGridMode: isPostDetail ? false : isGridMode,
      isLoggedIn: selectIsLoggedIn(state),
      isNavbarHidden: selectIsNavbarHidden(state),
      isOwnComment: selectCommentIsOwn(state, props),
      isPostDetail,
      post: selectCommentPost(state, props),
    }
  }
}

class CommentContainer extends Component {

  static propTypes = {
    author: PropTypes.object.isRequired,
    canDeleteComment: PropTypes.bool.isRequired,
    columnWidth: PropTypes.number.isRequired,
    comment: PropTypes.object.isRequired,
    commentBody: PropTypes.object,
    commentCreatedAt: PropTypes.string.isRequired,
    commentId: PropTypes.string.isRequired,
    commentOffset: PropTypes.number.isRequired,
    content: PropTypes.object.isRequired,
    contentWidth: PropTypes.number.isRequired,
    detailPath: PropTypes.string.isRequired,
    deviceSize: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    innerHeight: PropTypes.number.isRequired,
    isEditing: PropTypes.bool.isRequired,
    isGridMode: PropTypes.bool.isRequired,
    isLightBox: PropTypes.bool,
    isLoggedIn: PropTypes.bool.isRequired,
    isNavbarHidden: PropTypes.bool.isRequired,
    isOwnComment: PropTypes.bool.isRequired,
    isPostDetail: PropTypes.bool.isRequired,
    lightBoxSelectedIdPair: PropTypes.object,
    post: PropTypes.object.isRequired,
    resizeLightBox: PropTypes.bool,
    toggleLightBox: PropTypes.func.isRequired,
  }

  static contextTypes = {
    onLaunchNativeEditor: PropTypes.func.isRequired,
  }

  static childContextTypes = {
    onClickDeleteComment: PropTypes.func.isRequired,
    onClickEditComment: PropTypes.func.isRequired,
    onClickFlagComment: PropTypes.func.isRequired,
    onClickMoreTool: PropTypes.func.isRequired,
    onClickReplyToComment: PropTypes.func.isRequired,
  }

  getChildContext() {
    return {
      onClickDeleteComment: this.onClickDeleteComment,
      onClickEditComment: this.onClickEditComment,
      onClickFlagComment: this.onClickFlagComment,
      onClickMoreTool: this.onClickMoreTool,
      onClickReplyToComment: this.onClickReplyToComment,
    }
  }

  componentWillMount() {
    this.state = {
      isMoreToolActive: false,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !Immutable.is(nextProps.comment, this.props.comment) ||
      !Immutable.is(nextProps.post, this.props.post) ||
      [
        'lightBoxSelectedIdPair',
        'resizeLightBox',
        'isGridMode',
      ].some(prop =>
        nextProps[prop] !== this.props[prop],
      ) ||
      ['isMoreToolActive'].some(prop => nextState[prop] !== this.state[prop])
  }

  onClickDeleteComment = () => {
    const { dispatch } = this.props
    dispatch(openModal(
      <ConfirmDialog
        title="Delete Comment?"
        onConfirm={this.onConfirmDeleteComment}
        onDismiss={this.onCloseModal}
      />))
  }

  onConfirmDeleteComment = () => {
    const { comment, dispatch } = this.props
    this.onCloseModal()
    dispatch(deleteComment(comment))
  }

  onClickEditComment = () => {
    const { comment, dispatch } = this.props
    dispatch(toggleEditing(comment, true))
    dispatch(loadEditableComment(comment))
  }

  onClickFlagComment = () => {
    const { deviceSize, dispatch } = this.props
    dispatch(openModal(
      <FlagDialog
        deviceSize={deviceSize}
        onResponse={this.onCommentWasFlagged}
        onConfirm={this.onCloseModal}
      />))
  }

  onCommentWasFlagged = ({ flag }) => {
    const { dispatch, comment } = this.props
    dispatch(flagComment(comment, flag))
  }

  onClickMoreTool = () => {
    this.setState({ isMoreToolActive: !this.state.isMoreToolActive })
  }

  onClickReplyToComment = () => {
    const { author, dispatch, isNavbarHidden, post } = this.props
    const editorId = getEditorId(post, null, true, false)
    const replyUsername = `@${author.get('username')} `
    if (isElloAndroid()) {
      this.context.onLaunchNativeEditor(post, true, null, replyUsername)
    } else {
      dispatch({
        type: EDITOR.APPEND_TEXT,
        payload: {
          editorId,
          text: replyUsername,
        },
      })
      scrollToLastTextBlock(editorId, isNavbarHidden)
    }
  }

  onCloseModal = () => {
    const { dispatch } = this.props
    dispatch(closeModal())
  }

  render() {
    const {
      author,
      canDeleteComment,
      columnWidth,
      comment,
      commentBody,
      commentCreatedAt,
      commentId,
      commentOffset,
      content,
      contentWidth,
      detailPath,
      innerHeight,
      isEditing,
      isGridMode,
      isLoggedIn,
      isOwnComment,
      isPostDetail,
      isLightBox,
      resizeLightBox,
      toggleLightBox,
      lightBoxSelectedIdPair,
    } = this.props
    if (!comment || !comment.get('id') || !author || !author.get('id')) { return null }
    if (isEditing && commentBody && ElloAndroidInterface.supportsNativeEditor()) {
      this.context.onLaunchNativeEditor(null, true, comment)
    }
    return (
      <div className="Comment">
        {!isEditing && !isLightBox ?
          <CommentHeader author={author} commentId={commentId} /> :
          null
        }
        {isEditing && commentBody && !ElloAndroidInterface.supportsNativeEditor() ?
          <Editor isComment comment={comment} /> :
          <CommentBody
            columnWidth={columnWidth}
            commentId={commentId}
            commentOffset={commentOffset}
            content={content}
            contentWidth={contentWidth}
            detailPath={detailPath}
            innerHeight={innerHeight}
            isGridMode={isGridMode}
            isPostDetail={isPostDetail}
            isLightBox={isLightBox}
            resizeLightBox={resizeLightBox}
            toggleLightBox={toggleLightBox}
            lightBoxSelectedIdPair={lightBoxSelectedIdPair}
          />
        }
        {!isEditing && !isLightBox &&
          <CommentTools
            canDeleteComment={canDeleteComment}
            commentCreatedAt={commentCreatedAt}
            commentId={commentId}
            isLoggedIn={isLoggedIn}
            isMoreToolActive={this.state.isMoreToolActive}
            isOwnComment={isOwnComment}
            key={`CommentTools_${commentId}`}
          />
        }
      </div>
    )
  }
}

export default connect(makeMapStateToProps)(CommentContainer)

