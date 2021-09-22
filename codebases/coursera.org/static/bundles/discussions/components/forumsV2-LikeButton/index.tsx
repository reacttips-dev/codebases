/* @jsx jsx */
import { css, jsx } from '@emotion/react';
import PropTypes from 'prop-types';
import React from 'react';
import store from 'js/lib/coursera.store';

import { SvgThumbsUp, SvgThumbsUpFilled } from '@coursera/coursera-ui/svg';
import withSingleTracked from 'bundles/common/components/withSingleTracked';
import _t from 'i18n!nls/discussions';
import 'css!./__styles__/index';
import type { Contributor } from 'bundles/discussions/lib/types';
import { Button, useTheme } from '@coursera/cds-core';
import type { ButtonProps, Theme } from '@coursera/cds-core';
import formatCount from '../../utils/formatCount';

type Props = {
  creator?: Contributor;
  upvotes?: number;
  isUpvoted?: boolean;
  upvoteError?: boolean;
  ariaDescribedBy?: string;
  forumPostId: string;
  theme: Theme;
};

type State = {
  clickedLike: boolean;
};

const TrackedButton = withSingleTracked({ type: 'BUTTON' })<ButtonProps>(Button);

class LikeButton extends React.Component<Props, State> {
  static contextTypes = {
    like: PropTypes.func.isRequired,
    unlike: PropTypes.func.isRequired,
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
    const { forumPostId, creator, upvoteError, ariaDescribedBy } = this.props;
    const storeContextData = store.get('discussionsV2Context') || {};
    const { userId } = storeContextData;
    const postedByCurrentUser = creator.learnerId?.toString() === userId;
    const hasError = upvoteError;
    const message =
      this.props.upvotes && this.props.upvotes > 0
        ? _t('Like #{likeCount}', { likeCount: formatCount(this.props.upvotes) })
        : _t('Like');

    let likeIcon;
    const activeColor = this.props.theme.palette.blue[600];
    const disabledColor = this.props.theme.palette.gray[400];

    if (postedByCurrentUser) {
      likeIcon = <SvgThumbsUp size={16} color={disabledColor} />;
    } else if (this.state.clickedLike) {
      likeIcon = <SvgThumbsUpFilled size={16} color={activeColor} />;
    } else {
      likeIcon = <SvgThumbsUp size={16} color={activeColor} />;
    }

    return (
      <TrackedButton
        className="rc-forumsV2_LikeButton"
        trackingName="discussion_forum_like_button"
        // Because the tracking action is executed before state update, we have to invert the state in the following line
        trackingData={{ forumPostId, isLikeAction: !this.state.clickedLike }}
        onClick={this.toggleLike}
        aria-label={message}
        aria-describedby={ariaDescribedBy}
        size="small"
        variant="ghost"
        icon={likeIcon}
        iconPosition="before"
        disabled={postedByCurrentUser}
      >
        {(hasError && _t('Sorry, something went wrong')) || message}
      </TrackedButton>
    );
  }
}

const LikeButtonWithTheme = (props) => {
  const theme = useTheme();
  return <LikeButton {...props} theme={theme} />;
};

export default LikeButtonWithTheme;
