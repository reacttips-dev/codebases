/* @jsx jsx */
import { jsx } from '@emotion/react';
import { Button } from '@coursera/cds-core';
import type { IconProps } from '@coursera/cds-core';
import PropTypes from 'prop-types';
import React from 'react';
import withSingleTracked from 'bundles/common/components/withSingleTracked';
import _t from 'i18n!nls/discussions';
import { CommentIcon } from '@coursera/cds-icons/dist';
import 'css!./__styles__/index';
import type { AuthorProfile } from '../forumsV2-ForumThreads/__providers__/ForumPostDataProvider/__types__';
import formatCount from '../../utils/formatCount';
import { extractForumPostId } from '../forumsV2-ForumThreads/__helpers__/forumPostDataHelpers';

type Props = {
  creator?: AuthorProfile;
  replies?: number;
  ariaLabel?: string;
  forumQuestionId: string;
  forumId?: string;
  onClick?: () => void;
};

type TrackedReplyButtonProps = {
  icon: React.ReactElement<IconProps>;
  message: string;
  onClick: () => void;
  ariaLabel: string;
};

const TrackedReplyButton = withSingleTracked({
  type: 'BUTTON',
})(({ icon, message, onClick, ariaLabel }: TrackedReplyButtonProps) => (
  <Button
    size="small"
    variant="ghost"
    type="button"
    className="rc-forumsV2_ReplyButton"
    onClick={onClick}
    aria-label={ariaLabel}
    icon={icon}
    iconPosition="before"
  >
    {message}
  </Button>
));

class ReplyButton extends React.Component<Props> {
  static contextTypes = {
    userId: PropTypes.number,
  };

  render() {
    const message =
      this.props.replies && this.props.replies > 0
        ? _t('Reply #{replies}', { replies: formatCount(this.props.replies) })
        : _t('Reply');
    const forumQuestionId = extractForumPostId(this.props.forumQuestionId);

    return (
      <TrackedReplyButton
        trackingName="discussion_forum_reply_button"
        trackingData={{ forumQuestionId }}
        icon={<CommentIcon size="small" />}
        message={message}
        onClick={() => this.props?.onClick && this.props.onClick()}
        ariaLabel={this.props.ariaLabel || _t('reply button')}
      />
    );
  }
}

export default ReplyButton;
