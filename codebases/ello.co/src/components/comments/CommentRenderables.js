/* eslint-disable react/no-multi-comp */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { RegionItems } from '../regions/RegionRenderables'
import Avatar from '../assets/Avatar'

export class CommentHeader extends PureComponent {
  static propTypes = {
    author: PropTypes.object.isRequired,
    commentId: PropTypes.string.isRequired,
  }
  render() {
    const { author, commentId } = this.props
    return (
      <header className="CommentHeader" key={`CommentHeader_${commentId}`}>
        <div className="CommentHeaderAuthor">
          <Link className="CommentHeaderLink" to={`/${author.get('username')}`}>
            <Avatar
              priority={author.get('relationshipPriority')}
              sources={author.get('avatar')}
              userId={`${author.get('id')}`}
              username={author.get('username')}
            />
            <span
              className="CommentUsername DraggableUsername"
              data-priority={author.get('relationshipPriority', 'inactive')}
              data-userid={author.get('id')}
              data-username={author.get('username')}
              draggable
            >
              {`@${author.get('username')}`}
            </span>
          </Link>
        </div>
      </header>
    )
  }
}

export class CommentBody extends PureComponent {
  static propTypes = {
    columnWidth: PropTypes.number.isRequired,
    commentId: PropTypes.string.isRequired,
    commentOffset: PropTypes.number.isRequired,
    content: PropTypes.object.isRequired,
    contentWidth: PropTypes.number.isRequired,
    detailPath: PropTypes.string.isRequired,
    innerHeight: PropTypes.number.isRequired,
    isGridMode: PropTypes.bool.isRequired,
    isPostDetail: PropTypes.bool.isRequired,
    isLightBox: PropTypes.bool.isRequired,
    resizeLightBox: PropTypes.bool.isRequired,
    toggleLightBox: PropTypes.func.isRequired,
    lightBoxSelectedIdPair: PropTypes.object,
  }

  static defaultProps = {
    lightBoxSelectedIdPair: null,
  }

  render() {
    const {
      columnWidth,
      commentId,
      commentOffset,
      content,
      contentWidth,
      detailPath,
      innerHeight,
      isGridMode,
      isPostDetail,
      isLightBox,
      resizeLightBox,
      toggleLightBox,
      lightBoxSelectedIdPair,
    } = this.props
    return (
      <div className="CommentBody" key={`CommentBody${commentId}`} >
        <RegionItems
          postId={commentId}
          columnWidth={columnWidth}
          commentOffset={commentOffset}
          content={content}
          contentWidth={contentWidth}
          detailPath={detailPath}
          innerHeight={innerHeight}
          isComment
          isGridMode={isGridMode}
          isPostDetail={isPostDetail}
          isLightBox={isLightBox}
          resizeLightBox={resizeLightBox}
          toggleLightBox={toggleLightBox}
          lightBoxSelectedIdPair={lightBoxSelectedIdPair}
        />
      </div>
    )
  }
}
