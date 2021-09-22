import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { buildUrl } from 'bundles/discussions/utils/discussionsUrl';
import { replyPropType } from 'bundles/discussions/lib/propTypes';
import _t from 'i18n!nls/discussions';

class JumpToReply extends React.Component {
  static propTypes = {
    reply: replyPropType.isRequired,
    forumLink: PropTypes.string.isRequired,
    fetchAnswerPosition: PropTypes.func.isRequired,
  };

  render() {
    const { reply, forumLink, fetchAnswerPosition } = this.props;
    const replyURL = buildUrl(forumLink, reply.questionId, reply.topLevelForumAnswerId, reply.forumCommentId);

    return (
      <div className="rc-JumpToReply align-self-end">
        <Link to={replyURL} title={_t('Jump to post')} onClick={() => fetchAnswerPosition(reply.topLevelForumAnswerId)}>
          {_t('Jump to post')}
        </Link>
      </div>
    );
  }
}

export default JumpToReply;
