import React from 'react';
import PropTypes from 'prop-types';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import CalloutBox from 'bundles/ui/components/CalloutBox';
import ReplyContainer from 'bundles/discussions/components/repliesList/ReplyContainer';
import { replyPropType } from 'bundles/discussions/lib/propTypes';
import _t from 'i18n!nls/discussions';
import 'css!./__styles__/HighlightedReply';

class HighlightedReply extends React.Component {
  static propTypes = {
    reply: replyPropType,
    answerId: PropTypes.string,
    forumLink: PropTypes.string,
    commentId: PropTypes.string,
    fetchAnswerPosition: PropTypes.func.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  render() {
    const { reply, answerId, commentId, forumLink, fetchAnswerPosition } = this.props;

    if (!reply || reply.hide) {
      return null;
    }

    return (
      <div className="rc-HighlightedReply card-rich-interaction">
        <CalloutBox label={_t('Highlighted Post')}>
          <div className="highlighted-reply-content">
            <ReplyContainer
              showJumpLink
              collapseCommentsByDefault
              reply={reply}
              answerId={answerId}
              commentId={commentId}
              forumLink={forumLink}
              fetchAnswerPosition={fetchAnswerPosition}
            />
          </div>
        </CalloutBox>
      </div>
    );
  }
}

export default connectToStores(HighlightedReply, ['ThreadDetailsStore'], ({ ThreadDetailsStore }, { questionId }) => {
  return {
    reply: ThreadDetailsStore.getHighlightedPost(questionId),
  };
});
