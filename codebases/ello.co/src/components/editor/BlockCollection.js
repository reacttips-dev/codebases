import Immutable from 'immutable'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'
import Block from './Block'
import EmbedBlock from './EmbedBlock'
import ImageBlock from './ImageBlock'
import { addInputObject, removeInputObject } from './InputComponent'
import QuickEmoji from './QuickEmoji'
import PostActionBar from './PostActionBar'
import RepostBlock from './RepostBlock'
import TextBlock from './TextBlock'
import { XIcon } from '../assets/Icons'
import {
  addBlock,
  addDragBlock,
  addEmptyTextBlock,
  loadReplyAll,
  removeBlock,
  removeDragBlock,
  reorderBlocks,
  saveAsset,
  updateBlock,
} from '../../actions/editor'
import { closeOmnibar } from '../../actions/omnibar'
import * as ACTION_TYPES from '../../constants/action_types'
import { addDragObject, removeDragObject } from '../../interactions/Drag'
import { scrollToLastTextBlock } from '../../lib/jello'
import { selectIsMobileGridStream, selectIsNavbarHidden, selectIsGridMode } from '../../selectors/gui'
import { selectEditorCategoryIds } from '../../selectors/editor'
import { selectPropsPostId } from '../../selectors/post'
import { selectIsPostDetail, selectPathname } from '../../selectors/routing'
import { css, hover, media, parent, select } from '../../styles/jss'
import * as s from '../../styles/jso'

const editorWrapperStyle = css(
  s.mxAuto,
  s.maxViewWidth,
  parent('.Omnibar',
    s.p10,
    s.mxAuto,
    media(s.minBreak2, s.p20, s.mt40),
    media(s.minBreak4, s.p40),
  ),
)

const inviteTitleStyle = css(
  s.colorBlack,
  s.fontSize24,
  s.my5,
  s.sansBlack,
  s.truncate,
  media(s.minBreak3, s.fontSize38, s.my10),
  select('& span', s.colorA),
)

const successWrapperStyle = css(
  s.mxAuto,
  s.relative,
  { maxWidth: 450 },
)

const successTitleStyle = css(
  s.colorGreen,
  s.fontSize24,
  s.mb10,
  s.sansBlack,
  s.truncate,
)

const successBodyStyle = css(
  s.colorA,
  s.fontSize24,
  s.sansLight,
)

const dismissStyle = css(s.absolute, { top: -3, right: -20 }, s.colorA, hover(s.colorBlack))

function mapStateToProps(state, props) {
  const editor = state.editor.get(props.editorId, Immutable.Map())
  const collection = editor.get('collection')
  const order = editor.get('order')
  let buyLink
  const firstBlock = collection && order ? collection.get(`${order.first()}`) : null
  if (firstBlock) {
    buyLink = firstBlock.get('linkUrl')
  }
  const artistInvite = editor.get('artistInvite')
  return {
    artistInvite,
    artistInviteId: artistInvite ? artistInvite.get('id') : props.post.get('artistInviteId'),
    categoryIds: selectEditorCategoryIds(state, props),
    buyLink,
    collection,
    dragBlock: editor.get('dragBlock'),
    firstBlock,
    hasContent: editor.get('hasContent'),
    hasMedia: editor.get('hasMedia'),
    hasMention: editor.get('hasMention'),
    isLoading: editor.get('isLoading'),
    isPostDetail: selectIsPostDetail(state, props),
    isPosting: editor.get('isPosting'),
    isMobileGridStream: selectIsMobileGridStream(state),
    isNavbarHidden: selectIsNavbarHidden(state),
    isGridMode: selectIsGridMode(state),
    order,
    orderLength: order ? order.size : 0,
    pathname: selectPathname(state),
    postId: selectPropsPostId(state, props),
  }
}

class BlockCollection extends PureComponent {
  static propTypes = {
    artistInvite: PropTypes.object,
    artistInviteId: PropTypes.string,
    categoryIds: PropTypes.array.isRequired,
    blocks: PropTypes.object,
    buyLink: PropTypes.string,
    cancelAction: PropTypes.func.isRequired,
    collection: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    dragBlock: PropTypes.object,
    editorId: PropTypes.string.isRequired,
    firstBlock: PropTypes.object,
    hasComments: PropTypes.bool,
    hasContent: PropTypes.bool,
    hasMedia: PropTypes.bool,
    hasMention: PropTypes.bool,
    inlineEditor: PropTypes.bool,
    isComment: PropTypes.bool,
    isLoading: PropTypes.bool,
    isMobileGridStream: PropTypes.bool,
    isNavbarHidden: PropTypes.bool,
    isOwnPost: PropTypes.bool,
    isPostDetail: PropTypes.bool.isRequired,
    isPostEditing: PropTypes.bool.isRequired,
    isPostReposting: PropTypes.bool.isRequired,
    isPosting: PropTypes.bool,
    isGridMode: PropTypes.bool,
    order: PropTypes.object.isRequired,
    orderLength: PropTypes.number.isRequired,
    pathname: PropTypes.string.isRequired,
    post: PropTypes.object,
    postId: PropTypes.string,
    repostContent: PropTypes.object,
    showArtistInviteSuccess: PropTypes.bool.isRequired,
    submitAction: PropTypes.func.isRequired,
    submitText: PropTypes.string,
  }

  static defaultProps = {
    artistInvite: null,
    artistInviteId: null,
    buyLink: null,
    blocks: Immutable.List(),
    dragBlock: null,
    firstBlock: null,
    hasComments: false,
    hasContent: false,
    hasMedia: false,
    hasMention: false,
    inlineEditor: false,
    isComment: false,
    isLoading: false,
    isMobileGridStream: false,
    isNavbarHidden: false,
    isOwnPost: false,
    isPosting: false,
    isGridMode: false,
    post: null,
    postId: null,
    repostContent: Immutable.List(),
    submitText: 'Post',
  }

  static contextTypes = {
    onClickDismissAISuccess: PropTypes.func.isRequired,
  }

  componentWillMount() {
    const { blocks, dispatch, editorId, repostContent } = this.props
    this.state = { hasDragOver: false }
    if (repostContent.size) {
      dispatch(addBlock({ kind: 'repost', data: repostContent }, editorId))
    }
    if (blocks.size) {
      blocks.forEach((block) => {
        dispatch(addBlock(block.toJS(), editorId, false))
      })
    }
  }

  componentDidMount() {
    const { dispatch, editorId } = this.props
    this.dragObject = { component: this, dragId: editorId }
    dispatch(addEmptyTextBlock(editorId))
    addDragObject(this.dragObject)
    addInputObject(this)
  }

  componentDidUpdate(prevProps) {
    const { editorId, isNavbarHidden, isPostDetail,
      isPostEditing, isPostReposting, order } = this.props
    const isDragging = document.body.classList.contains('isDragging')
    const switchedToEditing = prevProps.isPostEditing !== isPostEditing ||
      prevProps.isPostReposting !== isPostReposting
    const orderWasModified = prevProps.order && order && prevProps.order.size !== order.size
    if (switchedToEditing || (!isPostDetail && !isDragging && orderWasModified)) {
      scrollToLastTextBlock(editorId, isNavbarHidden)
    }
  }

  componentWillUnmount() {
    if (this.dragObject) {
      removeDragObject(this.dragObject)
    }
    removeInputObject(this)
  }

  onCloseOmnibar() {
    const { dispatch, isComment } = this.props
    if (!isComment) {
      dispatch(closeOmnibar())
    }
  }

  onDragStart(props) {
    const { collection, dispatch, editorId } = this.props
    this.blockNode = props.target.parentNode.parentNode
    this.startOffset = this.blockNode.offsetTop
    this.startHeight = this.blockNode.offsetHeight
    this.prevBlock = this.blockNode.previousSibling
    this.nextBlock = this.blockNode.nextSibling
    const dragUid = this.blockNode.dataset.collectionId
    dispatch(addDragBlock(collection.get(`${dragUid}`), editorId))
    // swap the dragging block for a
    // normal block and set the height/width
    const block = {
      data: {
        width: this.blockNode.offsetWidth,
        height: this.blockNode.offsetHeight,
      },
      kind: 'block',
      uid: collection.getIn([`${dragUid}`, 'uid']),
    }
    dispatch(updateBlock(block, dragUid, editorId, true))
    this.onDragMove(props)
    document.body.classList.add('isDragging')
  }

  onDragMove(props) {
    // move the block we are currently dragging
    this.setState({ dragBlockTop: props.dragY + this.startOffset })
    // determine if we should change order
    if (props.dragY < props.lastDragY) {
      this.onDragUp(props)
    } else if (props.dragY > props.lastDragY) {
      this.onDragDown(props)
    }
  }

  onDragUp(props) {
    if (this.prevBlock &&
        !this.prevBlock.classList.contains('readonly') &&
        (props.dragY + this.startOffset) <
        (this.prevBlock.offsetTop + (this.prevBlock.offsetHeight * 0.5))) {
      this.onMoveBlock(-1)
    }
  }

  onDragDown(props) {
    if (this.nextBlock &&
        (props.dragY + this.startOffset + this.startHeight) >
        (this.nextBlock.offsetTop + (this.nextBlock.offsetHeight * 0.5))) {
      this.onMoveBlock(1)
    }
  }

  onMoveBlock(delta) {
    if (!this.blockPlaceholder) return
    const { dispatch, dragBlock, editorId } = this.props
    dispatch(reorderBlocks(dragBlock.get('uid'), delta, editorId))
    const placeholder = this.blockPlaceholder.editorBlock
    this.prevBlock = placeholder.previousSibling
    this.nextBlock = placeholder.nextSibling
  }

  onDragEnd() {
    const { dispatch, dragBlock, editorId } = this.props
    // swap the normal block out for
    // the one that was removed initially
    const dragUid = dragBlock.get('uid')
    dispatch(updateBlock(dragBlock, dragUid, editorId))
    dispatch(removeDragBlock(editorId))
    document.body.classList.remove('isDragging')
    this.setState({ dragBlockTop: null })
    dispatch(addEmptyTextBlock(editorId))
  }

  onDragOver = (e) => {
    e.preventDefault()
    if (!this.state.hasDragOver) {
      this.setState({ hasDragOver: true })
    }
  }

  onDragLeave = () => {
    if (this.state.hasDragOver) {
      this.setState({ hasDragOver: false })
    }
  }

  onDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({ hasDragOver: false })
    if (e.dataTransfer.files.length) { this.acceptFiles(e.dataTransfer.files) }
    if (e.dataTransfer.types.indexOf('application/json') > -1) {
      const data = JSON.parse(e.dataTransfer.getData('application/json'))
      if (data.username) {
        this.appendText(`@${data.username} `)
      }
      if (data.emojiCode) {
        this.appendText(`${data.emojiCode} `)
      }
      if (data.imgSrc) {
        this.appendText(`![img-drop](${data.imgSrc})\n\n`)
      }
      if (data.href) {
        if (data.href === data.linkText) {
          this.appendText(`${data.href}`)
        } else {
          this.appendText(`[${data.linkText}](${data.href}) `)
        }
      }
    }
  }

  onSubmitPost() {
    const { collection, editorId, hasContent } = this.props
    if (document.activeElement.parentNode.dataset.editorId === editorId &&
        collection.every(block => !block.get('isLoading')) && hasContent) {
      this.submit()
    }
  }

  onInsertEmoji = ({ value }) => {
    this.appendText(value)
  }

  getBlockElement(block) {
    const { editorId, isGridMode } = this.props
    const blockProps = {
      data: block.get('data'),
      editorId,
      key: block.get('uid'),
      kind: block.get('kind'),
      linkURL: block.get('linkUrl'),
      onRemoveBlock: this.remove,
      uid: block.get('uid'),
      isGridMode,
    }
    switch (block.get('kind')) {
      case 'block':
        return (
          <Block
            {...blockProps}
            className={classNames('BlockPlaceholder', { isUploading: block.get('isLoading') })}
            ref={(comp) => { this.blockPlaceholder = comp }}
          >
            <div style={{ width: block.getIn(['data', 'width']), height: block.getIn(['data', 'height']) }} />
          </Block>
        )
      case 'embed':
        return (
          <EmbedBlock {...blockProps} />
        )
      case 'image':
        return (
          <ImageBlock blob={block.get('blob')} {...blockProps} isUploading={block.get('isLoading')} />
        )
      case 'repost':
        return (
          <RepostBlock {...blockProps} onRemoveBlock={null} />
        )
      case 'text':
        return (
          <TextBlock
            {...blockProps}
            onInput={this.handleTextBlockInput}
            shouldAutofocus={this.shouldAutofocus()}
          />
        )
      default:
        return null
    }
  }

  shouldAutofocus() {
    const { pathname, isComment } = this.props
    const postRegex = /^\/[\w-]+\/post\/.+/
    return !(isComment && postRegex.test(pathname))
  }

  appendText = (content) => {
    const { dispatch, editorId, isNavbarHidden } = this.props
    dispatch({ type: ACTION_TYPES.EDITOR.APPEND_TEXT, payload: { editorId, text: content } })
    scrollToLastTextBlock(editorId, isNavbarHidden)
  }

  remove = (uid) => {
    const { dispatch, editorId } = this.props
    dispatch(removeBlock(uid, editorId))
  }

  handleTextBlockInput = (vo) => {
    const { dragBlock, collection, dispatch, editorId } = this.props
    if (!dragBlock && collection.getIn([`${vo.uid}`, 'data']) !== vo.data) {
      dispatch(updateBlock(vo, vo.uid, editorId))
    }
  }

  replyAll = () => {
    const { dispatch, postId, editorId } = this.props
    dispatch(loadReplyAll(postId, editorId))
  }

  submit = () => {
    const { artistInviteId, submitAction, categoryIds } = this.props
    submitAction(this.serialize(), artistInviteId, categoryIds)
  }

  serialize() {
    const { collection, order } = this.props
    const results = []
    order.forEach((uid) => {
      const block = collection.get(`${uid}`)
      const kind = block.get('kind')
      const data = block.get('data')
      const linkUrl = block.get('linkUrl')
      switch (kind) {
        case 'text':
          if (data && data.length) {
            if (linkUrl && linkUrl.length) {
              results.push({ kind, data, link_url: linkUrl })
            } else {
              results.push({ kind, data })
            }
          }
          break
        case 'repost':
          break
        default:
          if (linkUrl && linkUrl.length) {
            results.push({ kind, data, link_url: linkUrl })
          } else {
            results.push({ kind, data })
          }
          break
      }
    })
    return results
  }

  handleFiles = (e) => {
    if (e.target.files.length) { this.acceptFiles(e.target.files) }
  }

  acceptFiles(files) {
    const { dispatch, editorId } = this.props
    for (let index = 0, len = files.length; index < len; index += 1) {
      if (files.item(index)) {
        dispatch(saveAsset(files[index], editorId))
      }
    }
  }

  render() {
    const {
      artistInvite, buyLink, cancelAction, collection, dragBlock, editorId, firstBlock, categoryIds,
      hasContent, hasMedia, hasMention, inlineEditor, isComment, isLoading, isPosting, order,
      orderLength, showArtistInviteSuccess, submitText, hasComments, isOwnPost, isMobileGridStream,
      isGridMode, isPostEditing, isPostReposting, post,
    } = this.props

    const postCategories = post ? post.getIn(['links', 'categories']) : null
    const { dragBlockTop, hasDragOver } = this.state
    const firstBlockIsText = firstBlock ? /text/.test(firstBlock.get('kind')) : true
    const showQuickEmoji = isComment && firstBlockIsText
    const editorClassNames = classNames('editor', {
      withQuickEmoji: showQuickEmoji,
      hasDragOver,
      hasContent,
      hasMedia,
      hasMention,
      isComment,
      isLoading,
      isPosting,
      isPostReposting,
    })
    if (showArtistInviteSuccess) {
      return (
        <div className={editorWrapperStyle}>
          <div className={successWrapperStyle}>
            <h2 className={successTitleStyle}>Submission received!</h2>
            <div className={successBodyStyle}>
              Nice moves. Our curatorial team will review your submission.
              You’ll receive a notification when it’s approved.
            </div>
            <button className={dismissStyle} onClick={this.context.onClickDismissAISuccess}>
              <XIcon />
            </button>
          </div>
        </div>
      )
    }
    const showReplyAll = hasComments && isComment && isOwnPost && !isMobileGridStream
    const postIntoCategory = !isComment

    return (
      <div className={editorWrapperStyle}>
        {artistInvite &&
          <h2 className={inviteTitleStyle}><span>Submit to:</span>{` ${artistInvite.get('title')}`}</h2>
        }
        <div
          className={editorClassNames}
          data-placeholder={isComment ? 'Comment...' : 'Drag & drop images, paste embeds, enter text and links.'}
          onDragLeave={this.onDragLeave}
          onDragOver={this.onDragOver}
          onDrop={this.onDrop}
        >
          <div
            className="editor-region"
            data-num-blocks={orderLength}
          >
            {order && order.map(uid => this.getBlockElement(collection.get(`${uid}`)))}
            {dragBlock &&
              <div className="DragBlock" style={{ top: dragBlockTop }}>
                {this.getBlockElement(dragBlock)}
              </div>
            }
          </div>
          {showQuickEmoji && <QuickEmoji onAddEmoji={this.onInsertEmoji} />}
          <PostActionBar
            buyLink={buyLink}
            cancelAction={cancelAction}
            categoryIds={categoryIds}
            disableSubmitAction={isPosting || isLoading || !hasContent}
            editorId={editorId}
            handleFileAction={this.handleFiles}
            hasMedia={hasMedia}
            inlineEditor={inlineEditor}
            isGridMode={isGridMode}
            isPostEditing={isPostEditing}
            isPostReposting={isPostReposting}
            isComment={isComment}
            postCategories={postCategories}
            postIntoCategory={postIntoCategory}
            replyAllAction={showReplyAll ? this.replyAll : null}
            submitAction={this.submit}
            submitText={submitText}
          />
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps)(BlockCollection)

