import React, {Component} from 'react';
import {observer} from 'mobx-react';

import Comment from './comment.jsx';
import CommentForm from './comment_form.jsx';

export default
@observer
class CommentsList extends Component {
  constructor(props) {
    super(props);
    this.store = this.props.store;
  }

  scrollToLastComment = () => {
    document.getElementsByClassName('react_comments__bottom_anchor')[0].scrollIntoView(false);
  };

  render() {
    let comments = this.store.comments,
      isLoading = this.store.isLoading,
      showCommentVisibilityToggle = this.store.showCommentVisibilityToggle,
      showCommentsList = this.store.showCommentsList,
      toggleShowCommentsList = this.store.toggleShowCommentsList,
      defaultVisibleCommentCount = this.store.defaultVisibleCommentCount,
      viewMoreCommentsVisible = this.store.viewMoreCommentsVisible,
      newCommentFormVisible = this.store.newCommentFormVisible,
      toggleShowNewCommentForm = this.store.toggleShowNewCommentForm,
      toggleViewMoreCommentsVisible = this.store.toggleViewMoreCommentsVisible,
      flaggable =
        window.app_data.current_user.id !== undefined &&
        (window.app_data.current_user.moderator || window.app_data.current_user.is_admin),
      authenticated = window.app_data.current_user.id !== undefined;
    let moreCommentsHidden = comments.length > defaultVisibleCommentCount;

    comments = comments.map((comment, index) => {
      let commentVisible = index < defaultVisibleCommentCount || viewMoreCommentsVisible;
      let replies;
      if (comment.hasOwnProperty('children')) {
        replies = comment.children.map(child => {
          if (!authenticated && child.flagged) {
            return;
          } else {
            return (
              <Comment
                key={child.id}
                {...child}
                authenticated={authenticated}
                commentVisible={commentVisible}
                flaggable={flaggable}
                reply={true}
                store={this.store}
              />
            );
          }
        });
      }
      if (!authenticated && comment.flagged) {
        return;
      } else {
        return (
          <div key={`parent-${comment.id}`}>
            <Comment
              key={comment.id}
              {...comment}
              authenticated={authenticated}
              commentVisible={commentVisible}
              flaggable={flaggable}
              reply={false}
              store={this.store}
            />
            <div className="comment-replies">{replies}</div>
          </div>
        );
      }
    });

    return (
      <div className="react_comments__comments_list">
        {isLoading && (
          <img
            style={{
              display: 'block',
              width: 70 + 'px',
              margin: '30px auto'
            }}
            src="https://img.stackshare.io/fe/spinner.svg"
          />
        )}
        {!isLoading && showCommentVisibilityToggle && comments.length > 0 && (
          <a
            className="btn btn-ss react_comments__comment_visibility_toggle"
            onClick={toggleShowCommentsList}
          >
            Comments ({comments.length})
          </a>
        )}
        {!isLoading && viewMoreCommentsVisible && showCommentsList && comments.length > 5 && (
          <div className="react_comments__scroll_to_bottom__wrapper">
            <button onClick={this.scrollToLastComment} className="btn btn-ss-alt">
              Scroll to Bottom
            </button>
          </div>
        )}
        {showCommentsList && comments}
        {!isLoading && !viewMoreCommentsVisible && moreCommentsHidden && showCommentsList && (
          <div className="react_comments__view_more__wrapper">
            <button onClick={toggleViewMoreCommentsVisible} className="btn btn-ss">
              View More Comments
            </button>
          </div>
        )}
        {!isLoading && !newCommentFormVisible && (showCommentsList || comments.length === 0) && (
          <div className="react_comments__add_new_comment">
            <button onClick={toggleShowNewCommentForm} className="btn btn-ss-alt">
              Add New Comment
            </button>
          </div>
        )}
        {!isLoading && authenticated && newCommentFormVisible && showCommentsList && (
          <CommentForm
            type="create"
            cancelFn={toggleShowNewCommentForm}
            successFn={toggleShowNewCommentForm}
            store={this.store}
          />
        )}
        {comments.length > 0 && showCommentsList && (
          <div className="react_comments__bottom_anchor" />
        )}
      </div>
    );
  }
}
