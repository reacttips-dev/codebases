import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import { buildUrl } from 'bundles/discussions/utils/discussionsUrl';

class CreatedTimeLink extends React.Component {
  static propTypes = {
    post: PropTypes.object.isRequired,
    forumLink: PropTypes.string,
    isClickable: PropTypes.bool,
  };

  static defaultProps = {
    isClickable: true,
  };

  render() {
    const { post, forumLink, isClickable } = this.props;

    const postUrl = buildUrl(forumLink, post.questionId, post.topLevelForumAnswerId, post.forumCommentId);

    const createdTimeString = moment(new Date(post.createdAt)).fromNow();

    if (isClickable) {
      return (
        <a href={postUrl} target="_blank" rel="noopener noreferrer" className="rc-CreatedTimeLink dim caption-text">
          {createdTimeString}
        </a>
      );
    } else {
      return <span className="rc-CreatedTimeLink dim caption-text">{createdTimeString}</span>;
    }
  }
}

export default CreatedTimeLink;
