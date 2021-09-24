import React, {Component} from 'react';
import {observer} from 'mobx-react';

// This component is async imported
let RichTextEditor = null;

export default
@observer
class CommentForm extends Component {
  constructor(props) {
    super(props);
    this.store = this.props.store;
    // Type can be one of: ['create', 'edit', 'reply']
    this.type = this.props.type;
    // Value to set in the comment form body (i.e. for editing a comment)
    this.value = this.props.value;
    // If editing, the id of the comment being edited
    this.commentId = this.props.commentId;
    // If replying, the id of the comment being replied to
    this.parentId = this.props.parentId;
    // Function to call on sucessful action (i.e. create / edit / delete)
    this.successFn = this.props.successFn;
    // Function to call when clicking the cancel button
    this.cancelFn = this.props.cancelFn;
    this.state = {
      rteReady: false
    };
  }

  createComment = () => {
    let commentBody = this.state.value.toString('markdown');
    this.store
      .createComment(commentBody)
      .then(() => {
        this.successFn();
        // Show all comments if they were collapsed when creating the comment
        if (this.store.viewMoreCommentsVisible === false) {
          this.store.viewMoreCommentsVisible = true;
        }
        // Scroll down to the new comment
        document.getElementsByClassName('react_comments__bottom_anchor')[0].scrollIntoView(false);
      })
      .catch(() => null);
  };

  editComment = () => {
    let commentBody = this.state.value.toString('markdown');
    this.store
      .updateComment(this.commentId, commentBody)
      .then(() => {
        this.successFn();
      })
      .catch(() => null);
  };

  replyComment = () => {
    let commentBody = this.state.value.toString('markdown');
    this.store
      .replyComment(this.parentId, commentBody)
      .then(() => {
        this.successFn();
      })
      .catch(() => null);
  };

  onChange = value => {
    this.setState({value});
  };

  componentDidMount() {
    import(/* webpackChunkName: "react-rte" */ 'react-rte').then(module => {
      RichTextEditor = module.default;
      this.setState({
        rteReady: true,
        value: this.value
          ? module.createValueFromString(this.value, 'markdown')
          : module.createEmptyValue()
      });
    });
  }

  render() {
    if (!this.state.rteReady) {
      return <span style={{fontStyle: 'italic'}}>Loading comment editor...</span>;
    }

    const toolbarConfig = {
      // Optionally specify the groups to display (displayed in the order listed).
      display: [
        'INLINE_STYLE_BUTTONS',
        'BLOCK_TYPE_BUTTONS',
        'LINK_BUTTONS',
        'BLOCK_TYPE_DROPDOWN'
      ],
      INLINE_STYLE_BUTTONS: [{label: 'Bold', style: 'BOLD'}, {label: 'Italic', style: 'ITALIC'}],
      BLOCK_TYPE_DROPDOWN: [
        {label: 'Normal', style: 'unstyled'},
        {label: 'Heading Large', style: 'header-one'},
        {label: 'Heading Medium', style: 'header-two'},
        {label: 'Heading Small', style: 'header-three'}
      ],
      BLOCK_TYPE_BUTTONS: [
        {label: 'UL', style: 'unordered-list-item'},
        {label: 'OL', style: 'ordered-list-item'}
      ]
    };

    return (
      <div className="row">
        <div
          className={`comment_form__wrapper ${(this.type === 'reply' ||
            (this.type === 'edit' && this.parentId != null)) &&
            'col-md-10 col-sm-10 col-xs-10 col-md-offset-2 col-sm-offset-2 col-xs-offset-2'}`}
        >
          <div className="comment_form">
            <div className="comment_instructions">
              <span className="comment_instructions__note">Parsed as Markdown</span>
              <span className="comment_instructions__icon octicon octicon-markdown" />
            </div>
            <RichTextEditor
              value={this.state.value}
              onChange={this.onChange}
              toolbarConfig={toolbarConfig}
            />
          </div>
          {this.type === 'create' && (
            <button
              onClick={this.createComment}
              className="btn btn-ss-alt btn-sm comment_form__action_btn"
            >
              Comment
            </button>
          )}
          {this.type === 'edit' && (
            <button
              onClick={this.editComment}
              className="btn btn-ss-alt btn-sm comment_form__action_btn"
            >
              Confirm Edit
            </button>
          )}
          {this.type === 'reply' && (
            <button
              onClick={this.replyComment}
              className="btn btn-ss-alt btn-sm comment_form__action_btn"
            >
              Reply
            </button>
          )}
          <button onClick={this.cancelFn} className="btn btn-sm">
            Cancel
          </button>
        </div>
      </div>
    );
  }
}
