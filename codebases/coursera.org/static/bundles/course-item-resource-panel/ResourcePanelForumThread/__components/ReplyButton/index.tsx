import PropTypes from 'prop-types';
import React from 'react';
import { SvgComment } from '@coursera/coursera-ui/svg';
import { TrackedSvgButton } from 'bundles/common/components/withSingleTracked';
import _t from 'i18n!nls/course-item-resource-panel';
import 'css!./__styles__/index';
import { AuthorProfile } from '../../__providers__/ForumPostDataProvider/__types__';
import { formatCount } from '../../../__helpers__/displayHelpers';
import { extractForumPostId } from '../../__helpers__/eventingHelpers';

type Props = {
  creator?: AuthorProfile;
  replies: number;
  ariaLabel?: string;
  forumQuestionId: string;
  forumId?: string;
  onClick?: () => void;
};

class ReplyButton extends React.Component<Props> {
  static contextTypes = {
    userId: PropTypes.number,
  };

  render() {
    const count = formatCount(this.props.replies);
    const forumPostId = extractForumPostId(this.props.forumQuestionId);

    return (
      <span className="rc-ResourcePanel-ReplyButton">
        <TrackedSvgButton
          rootClassName="rc-ResourcePanel-ReplyButton__button"
          trackingName="resource_panel_forum_thread_modal_reply_button"
          trackingData={{ forumPostId }}
          htmlAttributes={{
            'aria-label': this.props.ariaLabel || _t('reply_button'),
          }}
          size="zero"
          type="noStyle"
          svgElement={<SvgComment size={20} style={{ position: 'relative', top: '2px' }} disableMouseEvent />}
          onClick={() => this.props?.onClick && this.props.onClick()}
        >
          <span className="rc-ResourcePanel-ReplyButton__label">{_t('Reply #{replies}', { replies: count })}</span>
        </TrackedSvgButton>
      </span>
    );
  }
}

export default ReplyButton;
