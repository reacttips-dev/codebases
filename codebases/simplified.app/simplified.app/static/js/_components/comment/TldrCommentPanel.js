import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import parse from "html-react-parser";
import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { Mention, MentionsInput } from "react-mentions";
import { connect } from "react-redux";
import { updateCommentCount } from "../../_actions/commentActions";
import {
  COMMENTS_ENDPOINT,
  SHOW_MY_TEAM_MEMBERS,
} from "../../_actions/endpoints";
import { analyticsTrackEvent } from "../../_utils/common";
import { ShowCenterSpinner } from "../common/statelessView";

const CommentInputBox = ({
  comment,
  parentId,
  members,
  onSetComment,
  onSetMember,
  onCreateComment,
  isSubmitting,
  onDiscardComment,
}) => {
  return (
    <div>
      <MentionsInput
        className="comment-text-input"
        value={comment}
        placeholder="Comment or tag others @"
        onChange={(event) => onSetComment(event)}
      >
        <Mention
          trigger="@"
          markup="@__display__"
          displayTransform={(email) => `@${email}`}
          data={members}
          renderSuggestion={(suggestion, search, highlightedDisplay) => {
            return (
              <div className="card-top">
                <div className="picture" key={"p" + suggestion.id}>
                  {suggestion.profile_picture ? (
                    <img src={suggestion.profile_picture} alt="profile"></img>
                  ) : (
                    <FontAwesomeIcon icon="user-circle"></FontAwesomeIcon>
                  )}
                </div>
                <div className="info ml-2">
                  <div className="title">{suggestion.display}</div>
                  <div className="desc">{suggestion.email}</div>
                </div>
              </div>
            );
          }}
          onAdd={(id, display) => onSetMember(id, display)}
        />
      </MentionsInput>
      {!parentId && (
        <div className="send-action-button">
          <Button
            size="sm"
            type="submit"
            disabled={!comment}
            onClick={() => onCreateComment(null)}
            variant={"tprimary"}
          >
            Comment
          </Button>
        </div>
      )}

      {parentId && (
        <div style={{ textAlign: "right" }}>
          <Button
            size="sm"
            variant="tsecondary"
            onClick={() => onDiscardComment()}
            className="mr-2"
          >
            Discard
          </Button>

          <Button
            size="sm"
            type="submit"
            disabled={!comment}
            onClick={() => onCreateComment(parentId)}
            variant={"tprimary"}
          >
            Reply
          </Button>
        </div>
      )}

      <ShowCenterSpinner loaded={!isSubmitting} />
    </div>
  );
};

const UpdateCommentInputBox = ({
  comment,
  commentObj,
  members,
  onDiscardComment,
  onSetComment,
  onSetMember,
  onUpdateComment,
}) => {
  return (
    <>
      <MentionsInput
        placeholder="Edit"
        className="comment-text-input"
        value={comment}
        onChange={(event) => onSetComment(event)}
      >
        <Mention
          trigger="@"
          displayTransform={(username) => `@${username}`}
          markup="@__display__"
          data={members}
          onAdd={(id, display) => onSetMember(id, display)}
        />
      </MentionsInput>
      <div className="mt-3 mb-3 submit-comment">
        <Button
          variant="tsecondary"
          onClick={() => onDiscardComment()}
          disabled={!comment}
          className="mr-2"
        >
          Discard
        </Button>

        <Button
          type="submit"
          onClick={() => onUpdateComment(commentObj)}
          className="btn btn-warning tldr-login-btn"
          disabled={!comment}
        >
          Send
        </Button>
      </div>
    </>
  );
};

const CommentActionDropdown = ({
  comment,
  reply,
  onAddReply,
  onResolvedComment,
  onEditComment,
  onDeleteComment,
}) => {
  return (
    <div className="action-dropdown">
      <div onClick={() => onAddReply(comment)}>
        <p>Reply</p>
      </div>

      <div
        className="border-item"
        onClick={() => onResolvedComment(reply ? reply : comment)}
      >
        <p>Resolve</p>
      </div>

      <div
        className="border-item"
        onClick={() => onEditComment(reply ? reply : comment)}
      >
        <p>Edit</p>
      </div>

      <div
        className="border-item"
        onClick={() => onDeleteComment(reply ? reply : comment)}
      >
        <p>Delete</p>
      </div>
    </div>
  );
};

export class TldrCommentPanel extends Component {
  signal = axios.CancelToken.source();

  constructor(props) {
    super(props);
    this.state = {
      comment: "",
      isEditing: false,
      isSubmitting: false,
      editCommentId: null,
      actionId: null,
      replyParentId: null,
      loadedMembers: false,
      members: [],
      mentions: [],
      comments: [],
      showResolved: false,
    };
  }

  getUpdatedCount = () => {
    return this.state.comments.reduce((acc, comment) => {
      if (comment.replies.length > 0) {
        const replies = comment.replies.filter((item) => item.status === 0);
        acc += replies.length;
      }

      if (comment.status === 0) {
        acc += 1;
      }
      return acc;
    }, 0);
  };

  createComment = (payload, signalToken, props) => {
    this.setState({ isSubmitting: true });
    axios
      .post(COMMENTS_ENDPOINT, payload, {
        cancelToken: signalToken,
      })
      .then((res) => {
        this.setState({
          isSubmitting: false,
          comments: res.data.parent
            ? this.state.comments.map((comment) =>
                comment.id === res.data.parent
                  ? {
                      ...comment,
                      replies: [res.data].concat(comment.replies),
                    }
                  : comment
              )
            : [res.data].concat(this.state.comments),
        });
        this.props.updateCommentCount(this.getUpdatedCount());
      })
      .catch((error) => this.setState({ isSubmitting: false }));
  };

  fetchComments = (objectPk, props, signalToken) => {
    this.setState({ isSubmitting: true });
    axios
      .get(`${COMMENTS_ENDPOINT}?object_pk=${objectPk}`, {
        cancelToken: signalToken.token,
      })
      .then((res) => {
        this.setState({
          isSubmitting: false,
          comments: res.data.results,
        });
        this.props.updateCommentCount(this.getUpdatedCount());
      })
      .catch((error) => {
        this.setState({ isSubmitting: false, comments: [] });
        this.props.updateCommentCount(this.getUpdatedCount());
      });
  };

  updateComment = (id, payload, signalToken, props) => {
    this.setState({ isSubmitting: true });
    axios
      .put(`${COMMENTS_ENDPOINT}/${id}`, payload, {
        cancelToken: signalToken,
      })
      .then((res) => {
        this.setState({
          isSubmitting: false,
          comments: res.data.parent
            ? this.state.comments.map((comment) =>
                comment.id === res.data.parent
                  ? {
                      ...comment,
                      replies: comment.replies.map((item) =>
                        item.id === res.data.id ? res.data : item
                      ),
                    }
                  : comment
              )
            : this.state.comments.map((item) =>
                item.id === res.data.id ? res.data : item
              ),
        });
        this.props.updateCommentCount(this.getUpdatedCount());
      })
      .catch((error) => this.setState({ isSubmitting: false }));
  };

  deleteComment = (id, payload, props) => {
    this.setState({ isSubmitting: true });
    axios
      .delete(`${COMMENTS_ENDPOINT}/${id}`)
      .then((res) => {
        this.setState({
          isSubmitting: false,
          comments: payload.parent
            ? this.state.comments.map((comment) =>
                comment.id === payload.parent
                  ? {
                      ...comment,
                      replies: comment.replies.filter(
                        (item) => payload.id !== item.id
                      ),
                    }
                  : comment
              )
            : this.state.comments.filter(
                (item, index) => payload.id !== item.id
              ),
        });

        this.props.updateCommentCount(this.getUpdatedCount());
      })
      .catch((error) => {
        this.setState({ isSubmitting: false });
      });
  };

  onSetMember = (id, display) => {
    const user = this.state.members.filter(
      (member) => member.display === display
    )[0];

    this.setState({
      mentions: [...this.state.mentions, user.user_id],
    });
  };

  onSetComment = (event) => {
    this.setState({ comment: event.target.value });
  };

  updateCommentInput = (e) => {
    this.setState({
      comment: e.target.value,
    });
  };

  onDiscardComment = () => {
    this.setState({
      isEditing: false,
      editCommentId: null,
      comment: "",
      actionId: null,
      replyParentId: null,
    });
  };

  onResolvedComment = (comment) => {
    comment["status"] = 2;
    this.onEditComment(comment);
    this.onUpdateComment(comment);
  };

  onCreateComment = (parentId) => {
    let objectPk = this.props.activeElement.id;
    let contentType = "stories.Layer";

    if (!this.props.activeElement.id) {
      objectPk = this.props.activePage.id;
      contentType = "stories.Page";
    }

    if (!objectPk) {
      return;
    }

    this.createComment(
      {
        user: this.props.auth.payload.user.pk,
        comment: this.state.comment,
        object_pk: objectPk,
        content_type: contentType,
        mentions: this.state.mentions,
        parent: parentId,
      },
      this.signal.token,
      this.props
    );

    this.onDiscardComment();

    analyticsTrackEvent("commented");
  };

  onDeleteComment = (comment) => {
    this.deleteComment(comment.id, comment, this.props);
  };

  onEditComment = (comment) => {
    this.setState({
      isEditing: true,
      editCommentId: comment.id,
      comment: comment.comment,
      actionId: null,
      replyParentId: null,
    });
  };

  onAddReply = (comment) => {
    this.setState({
      actionId: null,
      replyParentId: comment.id,
      isEditing: true,
    });
  };

  onUpdateComment = (comment) => {
    this.updateComment(
      comment.id,
      {
        ...comment,
        comment: this.state.comment ? this.state.comment : comment.comment,
        replies: [],
      },
      this.signal.token,
      this.props
    );
    this.onDiscardComment();
  };

  fetchCurrentMembers = () => {
    const { payload } = this.props.auth;
    axios
      .get(SHOW_MY_TEAM_MEMBERS + payload.selectedOrg + "/members")
      .then((res) => {
        this.setState({
          members: this.state.members.concat(res.data.results),
          loadedMembers: true,
        });
      })
      .catch((error) => {
        console.error("Failed to fetch current members");
      });
  };

  componentDidMount() {
    if (this.props.activeElement.id) {
      this.fetchComments(this.props.activeElement.id, this.props, this.signal);
    } else if (this.props.activePage.id) {
      this.fetchComments(this.props.activePage.id, this.props, this.signal);
    }

    this.fetchCurrentMembers();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.activeElement.id !== this.props.activeElement.id) {
      if (this.props.activeElement.id) {
        this.fetchComments(
          this.props.activeElement.id,
          this.props,
          this.signal
        );
      } else {
        this.fetchComments(this.props.activePage.id, this.props, this.signal);
      }
    }

    if (prevProps.activePage.id !== this.props.activePage.id) {
      this.fetchComments(this.props.activePage.id, this.props, this.signal);
    }
  }

  render() {
    const comments = this.state.comments.reduce((acc, comment) => {
      if (comment.replies.length > 0) {
        const commentWithReplies = {
          ...comment,
          replies: comment.replies.filter((item) =>
            this.state.showResolved ? true : item.status === 0
          ),
        };

        acc.push(commentWithReplies);
      } else if (this.state.showResolved || comment.status === 0) {
        acc.push(comment);
      }
      return acc;
    }, []);

    return (
      <div className="dropdown-comment">
        <label className="resolve-checkbox">
          Show Resolved
          <input
            type="checkbox"
            checked={this.state.showResolved}
            onChange={() =>
              this.setState({ showResolved: !this.state.showResolved })
            }
          />
          <span className="resolve-checkmark"></span>
        </label>

        {!this.state.isEditing && (
          <CommentInputBox
            members={this.state.members}
            onSetMember={this.onSetMember}
            onSetComment={this.onSetComment}
            onCreateComment={this.onCreateComment}
            comment={this.state.comment}
            isSubmitting={this.state.isSubmitting}
            parentId={null}
            onDiscardComment={this.onDiscardComment}
          />
        )}

        {comments.length > 0 &&
          comments.map((comment, index) => (
            <div key={comment.id} className="card mt-2">
              <div className="dropdown-comment-card">
                <div className="card-top">
                  {comment.user_profile &&
                  comment.user_profile.profile_picture ? (
                    <img
                      className="picture"
                      src={comment.user_profile.profile_picture}
                      alt="profile"
                    ></img>
                  ) : (
                    <FontAwesomeIcon icon="user-circle"></FontAwesomeIcon>
                  )}

                  <div className="info ml-2">
                    <div className="title">
                      {comment?.user_profile?.username}
                    </div>
                    <div className="desc">{comment?.last_updated} ago</div>
                  </div>

                  <div className="action-icon">
                    <div
                      onClick={() =>
                        this.setState({
                          actionId: this.state.actionId ? null : comment.id,
                        })
                      }
                    >
                      <FontAwesomeIcon icon="ellipsis-v"></FontAwesomeIcon>
                    </div>

                    {this.state.actionId === comment.id && (
                      <CommentActionDropdown
                        comment={comment}
                        reply={null}
                        onAddReply={this.onAddReply}
                        onResolvedComment={this.onResolvedComment}
                        onEditComment={this.onEditComment}
                        onDeleteComment={this.onDeleteComment}
                      />
                    )}
                  </div>
                </div>
                <div className="card-content mt-3">
                  {this.state.isEditing &&
                  this.state.editCommentId === comment.id ? (
                    <UpdateCommentInputBox
                      comment={this.state.comment}
                      commentObj={comment}
                      onDiscardComment={this.onDiscardComment}
                      members={this.state.members}
                      onSetMember={this.onSetMember}
                      onSetComment={this.onSetComment}
                      onUpdateComment={this.onUpdateComment}
                    />
                  ) : (
                    <div>{parse(comment.comment)}</div>
                  )}
                </div>
              </div>

              {/* Reply starts here */}
              {comment.replies.map((reply, index) => (
                <div key={reply.id} className="ml-2 mr-2">
                  <div className="card p-2">
                    <div className="card-top">
                      {reply.user_profile &&
                      reply.user_profile.profile_picture ? (
                        <img
                          className="picture thumbnail"
                          src={reply.user_profile.profile_picture}
                          alt="profile"
                        ></img>
                      ) : (
                        <FontAwesomeIcon icon="user-circle"></FontAwesomeIcon>
                      )}

                      <div className="info ml-2">
                        <div className="title">
                          {reply.user_profile.first_name}{" "}
                          {reply.user_profile.last_name}
                        </div>
                        <div className="desc">{comment.last_updated} ago</div>
                      </div>

                      <div className="action-icon p-1">
                        <div
                          onClick={() =>
                            this.setState({
                              actionId: this.state.actionId ? null : reply.id,
                            })
                          }
                        >
                          <FontAwesomeIcon icon="ellipsis-v"></FontAwesomeIcon>
                        </div>

                        {this.state.actionId === reply.id && (
                          <CommentActionDropdown
                            comment={comment}
                            reply={reply}
                            onAddReply={this.onAddReply}
                            onResolvedComment={this.onResolvedComment}
                            onEditComment={this.onEditComment}
                            onDeleteComment={this.onDeleteComment}
                          />
                        )}
                      </div>
                    </div>
                    {/* Edit reply  */}
                    <div className="card-content mt-2">
                      {this.state.isEditing &&
                      this.state.editCommentId === reply.id ? (
                        <UpdateCommentInputBox
                          comment={this.state.comment}
                          commentObj={reply}
                          onDiscardComment={this.onDiscardComment}
                          members={this.state.members}
                          onSetMember={this.onSetMember}
                          onSetComment={this.onSetComment}
                          onUpdateComment={this.onUpdateComment}
                        />
                      ) : (
                        <div>{parse(reply.comment)}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Adding a reply to a thread */}
              {this.state.replyParentId &&
                this.state.replyParentId === comment.id && (
                  <div className="p-2">
                    <CommentInputBox
                      members={this.state.members}
                      onSetMember={this.onSetMember}
                      onSetComment={this.onSetComment}
                      onCreateComment={this.onCreateComment}
                      comment={this.state.comment}
                      isSubmitting={this.state.isSubmitting}
                      parentId={comment.id}
                      onDiscardComment={this.onDiscardComment}
                    />
                  </div>
                )}
            </div>
          ))}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  activePage: state.editor.activePage,
  activeElement: state.editor.activeElement,
});

const mapDispatchToProps = (dispatch) => ({
  updateCommentCount: (payload) => dispatch(updateCommentCount(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TldrCommentPanel);
