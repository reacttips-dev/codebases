import PropTypes from 'prop-types';
import React from 'react';
import user from 'js/lib/user';
import { color } from '@coursera/coursera-ui';
import { SvgThumbsUp, SvgThumbsUpFilled } from '@coursera/coursera-ui/svg';
import { TrackedSvgButton } from 'bundles/common/components/withSingleTracked';
import _t from 'i18n!nls/course-item-resource-panel';
import 'css!./__styles__/index';
import { AuthorProfile } from '../../__providers__/ForumPostDataProvider/__types__';
import { formatCount } from '../../../__helpers__/displayHelpers';
import { extractForumPostId } from '../../__helpers__/eventingHelpers';

type Props = {
  creator?: AuthorProfile;
  upvotes: number;
  isUpvoted?: boolean;
  upvoteError?: boolean;
  ariaDescribedBy?: string;
  forumQuestionId: string;
};

type State = {
  clickedLike: boolean;
};

class LikeButton extends React.Component<Props, State> {
  static contextTypes = {
    like: PropTypes.func.isRequired,
    unlike: PropTypes.func.isRequired,
    userId: PropTypes.number,
  };

  state = {
    clickedLike: false,
  };

  componentDidMount() {
    this.setState({ clickedLike: this.props.isUpvoted || false });
  }

  toggleLike = () => {
    const { clickedLike } = this.state;

    if (clickedLike) {
      this.context.unlike();
      this.setState({ clickedLike: false });
    } else {
      this.context.like();
      this.setState({ clickedLike: true });
    }
  };

  render() {
    if (!this.props.creator) return null;
    const { forumQuestionId, creator, upvoteError, ariaDescribedBy } = this.props;
    const postedByCurrentUser = creator.id === user.get().id;
    const likeCount = formatCount(this.props.upvotes);
    const hasError = upvoteError;
    const message = _t('Like #{likeCount}', { likeCount });
    const forumPostId = extractForumPostId(forumQuestionId);

    if (postedByCurrentUser) {
      return (
        <div className="rc-ResourcePanel-LikeButton">
          <SvgThumbsUp size={20} />
          <span className="label-wrapper">{message}</span>
        </div>
      );
    } else {
      let likeIcon;
      if (this.state.clickedLike) {
        likeIcon = <SvgThumbsUpFilled size={20} color={color.primary} />;
      } else {
        likeIcon = <SvgThumbsUp size={20} />; // disableMouseEvent
      }

      return (
        <TrackedSvgButton
          rootClassName="rc-ResourcePanel-LikeButton"
          trackingName="resource_panel_forum_thread_modal_like_button"
          // Because the tracking action is executed before state update, we have to invert the state in the following line
          trackingData={{ forumPostId, isLikeAction: !this.state.clickedLike }}
          onClick={this.toggleLike}
          htmlAttributes={{
            'aria-label': message,
            'aria-describedby': ariaDescribedBy,
          }}
          size="zero"
          type="noStyle"
          svgElement={likeIcon}
        >
          <span className="label-wrapper">{message}</span>
          {hasError && <span>{_t('Sorry, something went wrong')}</span>}
        </TrackedSvgButton>
      );
    }
  }
}

export default LikeButton;
