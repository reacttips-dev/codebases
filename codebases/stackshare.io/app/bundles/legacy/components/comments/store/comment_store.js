import {observable} from 'mobx';

class CommentStore {
  @observable comments = [];
  @observable isLoading = false;
  @observable signInModalVisible = false;
  @observable newCommentFormVisible = false;
  @observable defaultVisibleCommentCount = 5;
  @observable viewMoreCommentsVisible = false;
  @observable showCommentVisibilityToggle;
  @observable showCommentsList;

  constructor(props) {
    this.commentableId = props.commentableId;
    this.commentableType = props.commentableType;
    this.showCommentVisibilityToggle = props.showCommentVisibilityToggle;
    this.showCommentsList = props.showCommentsList;
    this.markdownConverter = null;
    this.loadComments();
  }

  toggleShowCommentsList = () => {
    this.showCommentsList = !this.showCommentsList;
  };

  toggleShowNewCommentForm = () => {
    if (window.app_data.current_user.id === undefined) {
      this.showSignInModal();
    } else {
      this.newCommentFormVisible = !this.newCommentFormVisible;
      if (this.newCommentFormVisible) {
        this.showCommentsList = true;
      }
    }
  };

  toggleViewMoreCommentsVisible = () => {
    this.viewMoreCommentsVisible = !this.viewMoreCommentsVisible;
  };

  showSignInModal() {
    this.signInModalVisible = true;
  }

  hideSignInModal = () => {
    this.signInModalVisible = false;
  };

  toggleUpvote(id) {
    return new Promise((resolve, reject) => {
      let url = `/api/v1/comments/${id}/toggle_upvote`;
      $.post(url)
        .done(response => {
          if (response.parentId === null) {
            // The comment is top level so find the comment and set the new vote count
            let comment = this.comments.find(comment => comment.id === response.id);
            comment.votes = response.votes;
          } else {
            // The comment is a child, so find the parent comment and then the child and set the new vote count
            let parentComment = this.comments.find(comment => comment.id === response.parentId);
            let childComment = parentComment.children.find(child => child.id === response.id);
            childComment.votes = response.votes;
          }
          resolve();
        })
        .fail(e => {
          reject(e);
        });
    });
  }

  toggleFlagged(id) {
    return new Promise((resolve, reject) => {
      let url = `/api/v1/comments/${id}/toggle_flagged`;
      $.post(url)
        .done(response => {
          if (response.parentId === null) {
            // The comment is top level so find the comment and set the new vote count
            let comment = this.comments.find(comment => comment.id === response.id);
            comment.flagged = response.flagged;
          } else {
            // The comment is a child, so find the parent comment and then the child and set the new vote count
            let parentComment = this.comments.find(comment => comment.id === response.parentId);
            let childComment = parentComment.children.find(child => child.id === response.id);
            childComment.flagged = response.flagged;
          }
          resolve();
        })
        .fail(e => {
          reject(e);
        });
    });
  }

  loadComments() {
    this.isLoading = true;
    let url = `/api/v1/comments?commentable_id=${this.commentableId}&commentable_type=${
      this.commentableType
    }`;
    get(url).then(response => {
      import(/* webpackChunkName: "showdown" */ 'showdown').then(module => {
        const Showdown = module.default;
        this.markdownConverter = new Showdown.Converter();
        this.comments = response.data;
        this.isLoading = false;
      });
    });
  }

  replyComment(parentId, commentBody) {
    return new Promise((resolve, reject) => {
      let commentData = {
        comment: {
          parent_id: parentId,
          body: commentBody,
          user_id: window.app_data.current_user.id,
          commentable_id: this.commentableId,
          commentable_type: this.commentableType
        }
      };
      let url = '/api/v1/comments/reply';
      $.post(url, commentData)
        .done(response => {
          let parentComment = this.comments.find(comment => comment.id === parentId);
          parentComment.children.push(response);
          resolve();
        })
        .fail(e => {
          reject(e);
        });
    });
  }

  createComment(commentBody) {
    return new Promise((resolve, reject) => {
      let commentData = {
        comment: {
          body: commentBody,
          user_id: window.app_data.current_user.id,
          commentable_id: this.commentableId,
          commentable_type: this.commentableType
        }
      };
      let url = '/api/v1/comments';
      $.post(url, commentData)
        .done(response => {
          this.comments.push(response);
          resolve();
        })
        .fail(e => {
          reject(e);
        });
    });
  }

  updateComment(commentId, commentBody) {
    return new Promise((resolve, reject) => {
      let commentData = {comment: {body: commentBody}};
      let url = `/api/v1/comments/${commentId}`;
      $.ajax({
        method: 'PUT',
        url: url,
        data: commentData
      })
        .done(response => {
          if (response.parentId === null) {
            // The comment is top level so find the comment and set the new body
            let comment = this.comments.find(comment => comment.id === response.id);
            comment.body = response.body;
          } else {
            // The comment is a child, so find the parent comment and then the child and set the new body
            let parentComment = this.comments.find(comment => comment.id === response.parentId);
            let childComment = parentComment.children.find(child => child.id === response.id);
            childComment.body = response.body;
          }
          resolve();
        })
        .fail(e => {
          reject(e);
        });
    });
  }

  deleteComment(commentId) {
    return new Promise((resolve, reject) => {
      let url = `/api/v1/comments/${commentId}`;
      $.ajax({
        method: 'DELETE',
        url: url
      })
        .done(response => {
          if (response.parentId === null) {
            // The comment is top level so return all top level comments except for the deleted one
            let comment = this.comments.find(comment => comment.id === response.id);
            this.comments.remove(comment);
          } else {
            // The comment is a child, so find the parent comment and remove the child
            let parentComment = this.comments.find(comment => comment.id === response.parentId);
            let childComment = parentComment.children.find(child => child.id === response.id);
            parentComment.children.remove(childComment);
          }
          resolve();
        })
        .fail(e => {
          reject(e);
        });
    });
  }
}

export default CommentStore;
