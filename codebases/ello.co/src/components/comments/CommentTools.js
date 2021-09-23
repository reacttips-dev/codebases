/* eslint-disable react/no-multi-comp */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Hint from '../hints/Hint'
import { ChevronIcon, FlagIcon, PencilIcon, ReplyIcon, XBoxIcon } from '../assets/Icons'

class TimeAgoTool extends PureComponent {
  static propTypes = {
    createdAt: PropTypes.string.isRequired,
  }
  render() {
    const { createdAt } = this.props
    return (
      <span className="PostTool TimeAgoTool">
        <span className="PostToolValue">{new Date(createdAt).timeAgoInWords()}</span>
      </span>
    )
  }
}

class EditTool extends PureComponent {
  static contextTypes = {
    onClickEditComment: PropTypes.func.isRequired,
  }
  render() {
    return (
      <span className="PostTool EditTool ShyTool">
        <button onClick={this.context.onClickEditComment}>
          <PencilIcon />
          <Hint>Edit</Hint>
        </button>
      </span>
    )
  }
}

class DeleteTool extends PureComponent {
  static contextTypes = {
    onClickDeleteComment: PropTypes.func.isRequired,
  }
  render() {
    return (
      <span className="PostTool DeleteTool ShyTool">
        <button onClick={this.context.onClickDeleteComment}>
          <XBoxIcon />
          <Hint>Delete</Hint>
        </button>
      </span>
    )
  }
}

class ReplyTool extends PureComponent {
  static contextTypes = {
    onClickReplyToComment: PropTypes.func.isRequired,
  }
  render() {
    return (
      <span className="PostTool ReplyTool">
        <button onClick={this.context.onClickReplyToComment}>
          <ReplyIcon />
          <Hint>Reply</Hint>
        </button>
      </span>
    )
  }
}

class FlagTool extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
  }
  static defaultProps = {
    className: null,
  }
  static contextTypes = {
    onClickFlagComment: PropTypes.func.isRequired,
  }
  render() {
    return (
      <span className={classNames('PostTool FlagTool ShyTool', this.props.className)}>
        <button onClick={this.context.onClickFlagComment}>
          <FlagIcon />
          <Hint>Flag</Hint>
        </button>
      </span>
    )
  }
}

class MoreTool extends PureComponent {
  static contextTypes = {
    onClickMoreTool: PropTypes.func.isRequired,
  }
  render() {
    return (
      <span className="PostTool MoreTool">
        <button onClick={this.context.onClickMoreTool}>
          <ChevronIcon />
          <Hint>More</Hint>
        </button>
      </span>
    )
  }
}

export default class CommentTools extends PureComponent {
  static propTypes = {
    canDeleteComment: PropTypes.bool.isRequired,
    commentCreatedAt: PropTypes.string.isRequired,
    commentId: PropTypes.string.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isMoreToolActive: PropTypes.bool,
    isOwnComment: PropTypes.bool.isRequired,
  }
  static defaultProps = {
    isMoreToolActive: false,
  }
  render() {
    const {
      canDeleteComment,
      commentCreatedAt,
      commentId,
      isLoggedIn,
      isMoreToolActive,
      isOwnComment,
    } = this.props
    const isShyToolSolo = isLoggedIn && !(isOwnComment || canDeleteComment)
    const cells = []
    const innerCells = []

    if (isLoggedIn && !isOwnComment) {
      cells.push(<ReplyTool key={`ReplyTool_${commentId}`} />)
    }
    cells.push(<TimeAgoTool key={`TimeAgoTool_${commentId}`} createdAt={commentCreatedAt} />)
    if (isLoggedIn) {
      innerCells.push(<MoreTool key={`MoreTool_${commentId}`} />)
      if (!isOwnComment) {
        innerCells.push(<FlagTool key={`FlagTool_${commentId}`} />)
      }
      if (isOwnComment) {
        innerCells.push(<EditTool key={`EditTool_${commentId}`} />)
      }
      if (isOwnComment || canDeleteComment) {
        innerCells.push(<DeleteTool key={`DeleteTool_${commentId}`} />)
      }
      cells.push(<div className="ShyTools" key={`ShyTools_${commentId}`}>{innerCells}</div>)
    }
    return (
      <footer className={classNames('PostTools CommentTools', { isMoreToolActive }, { isShyToolSolo })}>
        {cells}
      </footer>
    )
  }
}

