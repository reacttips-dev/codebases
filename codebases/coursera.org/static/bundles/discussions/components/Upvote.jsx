import PropTypes from 'prop-types';
import React from 'react';
import _t from 'i18n!nls/discussions';
import { color } from '@coursera/coursera-ui';
import SvgUpvote from 'bundles/coursera-ui/components/svg/coursera/common/SvgUpvote';
import SvgUpvoteFilled from 'bundles/coursera-ui/components/svg/coursera/common/SvgUpvoteFilled';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import { upvote, cancelUpvote } from 'bundles/discussions/actions/ThreadDetailsActions';
import 'css!./__styles__/Upvote';

class Upvote extends React.Component {
  static propTypes = {
    post: PropTypes.object,
    userId: PropTypes.number,
    ariaDescribedBy: PropTypes.string,
  };

  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
  };

  state = {
    // We control the upvote icon's hovered state with this since coursera-ui
    // icons don't accept inline styles
    hovered: false,
    clickedUpvote: false,
  };

  componentDidMount() {
    this.setState({ clickedUpvote: this.props.post.isUpvoted });
  }

  handleMouseLeave = () => {
    this.setState({ hovered: false });
  };

  handleMouseEnter = () => {
    this.setState({ hovered: true });
  };

  toggleUpvote = () => {
    const { post } = this.props;
    const { clickedUpvote } = this.state;

    if (clickedUpvote === post.isUpvoted) {
      if (post.isUpvoted) {
        this.context.executeAction(cancelUpvote, { post });
        this.setState({ clickedUpvote: false });
      } else {
        this.context.executeAction(upvote, { post });
        this.setState({ clickedUpvote: true });
      }
    }
  };

  formatVoteCount(c) {
    let count = c || 0;
    if (count.toString().length > 3) {
      count = Math.round((count / 1000) * 10) / 10;
      count += 'k';
    }
    return count;
  }

  render() {
    if (!this.props.post) return null;
    const { post, ariaDescribedBy } = this.props;
    const postedByCurrentUser = post.creator.userId === this.props.userId;
    const upvoteCount = post.upvotes === undefined ? post.upvoteCount : post.upvotes;
    const voteCount = this.formatVoteCount(upvoteCount);
    const hasError = post.upvoteError;
    if (postedByCurrentUser) {
      return (
        <div className="rc-Upvote">
          <SvgUpvote size={14} style={{ position: 'relative', top: '2px', color: '#5e5e5e' }} />
          <span className="label-wrapper">
            <FormattedMessage
              message={_t('{voteCount, number} {voteCount, plural, =1 {Upvote} other {Upvotes}}')}
              voteCount={voteCount}
            />
          </span>
        </div>
      );
    } else {
      const labelStyle = {};
      if (post.isUpvoted) {
        labelStyle.fontWeight = 'bold';
      }
      if (post.isUpvoted || this.state.hovered) {
        labelStyle.color = color.primary;
      }
      let upvoteIcon = (
        <SvgUpvote
          size={14}
          hoverColor={color.primary}
          hovered={this.state.hovered}
          style={{ position: 'relative', top: '2px', color: '#5e5e5e' }}
          disableMouseEvent
        />
      );
      if (post.isUpvoted) {
        upvoteIcon = <SvgUpvoteFilled size={14} color={color.primary} style={{ position: 'relative', top: '2px' }} />;
      }

      const message = voteCount.toString() + ' ' + (voteCount !== 1 ? _t('Upvotes') : _t('Upvote'));

      return (
        <button
          type="button"
          className="rc-Upvote"
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          onClick={this.toggleUpvote}
          aria-label={message}
          aria-pressed={post.isUpvoted}
          aria-describedby={ariaDescribedBy}
        >
          {upvoteIcon}
          <span className="label-wrapper" style={labelStyle}>
            {message}
          </span>
          {hasError && <span>{_t('Sorry, something went wrong')}</span>}
        </button>
      );
    }
  }
}

export default connectToStores(['ApplicationStore'], ({ ApplicationStore }) => {
  return {
    userId: ApplicationStore.getUserData().id,
  };
})(Upvote);
