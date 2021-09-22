import PropTypes from 'prop-types';
import React from 'react';
import _t from 'i18n!nls/discussions';
import { follow, unfollow } from 'bundles/discussions/actions/ThreadDetailsActions';
import 'css!./__styles__/Follow';

class Follow extends React.Component {
  static propTypes = {
    question: PropTypes.object.isRequired,
  };

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

    return (
      <button className="rc-Follow" onClick={this.toggleFollowing} aria-pressed={isFollowing}>
        <span>{isFollowing ? _t('Unfollow this discussion') : _t('Follow this discussion')} </span>
        {followError && <span>{_t('Sorry, something went wrong')}</span>}
      </button>
    );
  }
}

export default Follow;
