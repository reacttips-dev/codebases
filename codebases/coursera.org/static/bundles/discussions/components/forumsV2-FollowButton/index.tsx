/* @jsx jsx */
import { jsx, css } from '@emotion/react';
import { Button } from '@coursera/cds-core';
import { AddIcon, SubtractIcon } from '@coursera/cds-icons';
import PropTypes from 'prop-types';
import React from 'react';
import _t from 'i18n!nls/discussions';
import { follow, unfollow } from 'bundles/discussions/actions/ThreadDetailsActions';
import { ForumQuestionFromStore } from '../../lib/types';

type Props = {
  question: ForumQuestionFromStore;
};

class FollowButton extends React.Component<Props> {
  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
  };

  toggleFollowing = () => {
    const { question } = this.props;

    if (question.isFollowing) {
      this.context.executeAction(unfollow, { question });
    } else {
      this.context.executeAction(follow, { question });
    }
  };

  render() {
    const { isFollowing, followError } = this.props.question;

    const errorLabel = _t('Sorry, something went wrong');
    const followingLabel = isFollowing ? _t('Unfollow this post') : _t('Follow this post');
    const label = followError ? errorLabel : followingLabel;

    return (
      <Button
        variant="ghost"
        size="small"
        type="button"
        className="rc-forumsV2_FollowButton"
        onClick={this.toggleFollowing}
        aria-pressed={isFollowing}
        icon={isFollowing ? <SubtractIcon size="small" /> : <AddIcon size="small" />}
        iconPosition="before"
      >
        {label}
      </Button>
    );
  }
}

export default FollowButton;
