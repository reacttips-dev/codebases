import React, {Component} from 'react';
import {observer} from 'mobx-react';

import CommentForm from './comment_form.jsx';
import CommentActionModal from './comment_action_modal.jsx';

export default
@observer
class Comment extends Component {
  constructor(props) {
    super(props);
    this.store = this.props.store;
    this.state = {editing: false, replying: false, confirmFlag: false, confirmDelete: false};
  }

  toggleUpvote = () => {
    if (window.app_data.current_user.id === undefined) {
      this.store.showSignInModal();
    } else {
      this.store.toggleUpvote(this.props.id).catch(() => null);
    }
  };

  toggleFlagged = () => {
    this.store
      .toggleFlagged(this.props.id)
      .then(() => {
        this.toggleConfirmFlag();
      })
      .catch(() => null);
  };

  toggleConfirmFlag = () => {
    this.setState({confirmFlag: !this.state.confirmFlag});
  };

  toggleConfirmDelete = () => {
    this.setState({confirmDelete: !this.state.confirmDelete});
  };

  toggleEditing = () => {
    this.setState({editing: !this.state.editing});
  };

  toggleReplying = () => {
    this.setState({replying: !this.state.replying});
  };

  deleteComment = () => {
    this.store
      .deleteComment(this.props.id)
      .then(() => {
        this.toggleConfirmDelete();
      })
      .catch(() => null);
  };

  render() {
    let {
        id,
        reply,
        body,
        flagged,
        votes,
        user,
        createdAtReadable,
        flaggable,
        authenticated,
        commentVisible
      } = this.props,
      {userId, userImage, username} = user,
      commentOwner = window.app_data.current_user.id === userId ? true : false,
      commentBody = this.store.markdownConverter.makeHtml(body);

    return (
      <div
        className={`react_comments__comment react_comments__comment--${
          commentVisible ? 'visible' : 'hidden'
        }`}
      >
        <div className={`${reply ? 'written-reply' : 'written-comment'}`}>
          <div className="row">
            <div className="col-md-11 col-sm-11 col-xs-9" id={`comments-${id}`}>
              <h5>
                <span>
                  <a href={`/${username}`}>
                    <img className="comment-author" src={userImage} alt={username} />
                  </a>
                </span>
                <a className="comment-author-name" href={`/${username}`}>
                  {username}
                </a>
              </h5>
              <div className="comment-body">
                <div dangerouslySetInnerHTML={{__html: commentBody}} />
              </div>
            </div>
            <div className="span col-md-1 col-sm-1 col-xs-3 voting">
              <a onClick={this.toggleUpvote} className="voting-buttons upvote-comment">
                <span className="octicon octicon-triangle-up" style={{fontSize: '22px'}} />
              </a>
              <div className="voting-result">{votes}</div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 col-sm-4 col-xs-4">
              <div className="created">{createdAtReadable}</div>
            </div>
            <div className="col-md-8 col-sm-8 col-xs-8" style={{padding: '0', float: 'right'}}>
              <div style={{float: 'right'}}>
                {commentOwner && !this.state.editing && (
                  <a onClick={this.toggleEditing} className="comment-links">
                    Edit
                  </a>
                )}
                {/* { commentOwner && <a onClick={() => this.deleteComment(id)} className='delete-comment-link comment-links'>Delete</a> } */}
                {commentOwner && (
                  <a
                    onClick={this.toggleConfirmDelete}
                    className="delete-comment-link comment-links"
                  >
                    Delete
                  </a>
                )}
                {/* { flaggable && <a onClick={() => this.toggleFlagged(id)} className={`${flagged ? 'flagged-comment' : ''} btn flag-comment-link`}>Flag</a> } */}
                {flaggable && (
                  <a
                    onClick={this.toggleConfirmFlag}
                    className={`${flagged ? 'flagged-comment' : ''} btn flag-comment-link`}
                  >
                    Flag
                  </a>
                )}
                {!reply && authenticated && (
                  <a
                    onClick={this.toggleReplying}
                    className="btn btn-ss-g btn-xs comment-links"
                    style={{color: 'grey !important'}}
                  >
                    Reply
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        {this.state.editing && (
          <CommentForm
            type="edit"
            value={body}
            commentId={id}
            parentId={this.props.parentId}
            cancelFn={this.toggleEditing}
            successFn={this.toggleEditing}
            store={this.store}
          />
        )}
        {this.state.replying && (
          <CommentForm
            type="reply"
            parentId={id}
            cancelFn={this.toggleReplying}
            successFn={this.toggleReplying}
            store={this.store}
          />
        )}
        {this.state.confirmFlag && (
          <CommentActionModal
            cancelFn={this.toggleConfirmFlag}
            successFn={this.toggleFlagged}
            content="Are you sure you want to flag this comment?"
          />
        )}
        {this.state.confirmDelete && (
          <CommentActionModal
            cancelFn={this.toggleConfirmDelete}
            successFn={this.deleteComment}
            content="Are you sure you want to delete your comment?"
          />
        )}
      </div>
    );
  }
}
