import React, {Component} from 'react';
import {observer} from 'mobx-react';
import CommentStore from './store/comment_store.js';

import CommentsList from './comments_list.jsx';
import {SigninDesktopModal} from '../../../../shared/library/modals/signin';

export default
@observer
class Comments extends Component {
  constructor(props) {
    super(props);

    this.store = new CommentStore({
      commentableId: props.commentableId,
      commentableType: props.commentableType,
      showCommentVisibilityToggle: props.showCommentVisibilityToggle,
      showCommentsList: props.showCommentsList
    });
  }

  render() {
    return (
      <div className="react_comments">
        {this.store.signInModalVisible && (
          <SigninDesktopModal
            onDismiss={this.store.hideSignInModal}
            redirect={window.location.href}
          />
        )}
        <CommentsList store={this.store} />
      </div>
    );
  }
}
