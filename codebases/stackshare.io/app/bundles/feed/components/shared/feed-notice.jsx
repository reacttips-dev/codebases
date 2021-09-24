import {
  TYPE_COMPANY,
  TYPE_USER_DECISION,
  TYPE_TOOL,
  TYPE_SERVICE,
  TYPE_USER
} from '../../../../data/feed/constants';
import {InfoIcon} from '../../../../shared/library/notices/notice';
import TrendingIcon from '../icons/trending-icon.svg';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withLocalStorage} from '../../../../shared/enhancers/local-storage-enhancer';
import {compose} from 'react-apollo';
import {withRouteContext} from '../../../../shared/enhancers/router-enhancer';
import {ID} from '../../../../shared/utils/graphql';
import FeedEmptyNotice from './feed-empty-notice';

export const PERSONALIZE_NOTICE_SEEN_KEY = 'personalizeNoticeSeen';
export const DECISIONS_FIRST_RUN_SEEN_KEY = 'decisionsFirstRunSeen';
export const PERMALINK = 'permalink';

class FeedNotice extends Component {
  static propTypes = {
    children: PropTypes.any,
    userId: ID,
    userSlug: PropTypes.string,
    routeContext: PropTypes.shape({
      feedType: PropTypes.string.isRequired,
      typeSlug: PropTypes.string,
      idNotFound: PropTypes.object
    }).isRequired,
    followedTools: PropTypes.array,
    items: PropTypes.array,
    storageProvider: PropTypes.object
  };

  state = {
    showNotice: false
  };

  componentDidMount() {
    const {showNotice} = getFirstRunState(this.props.storageProvider);
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({showNotice});
  }

  handleDismissNotice = () => {
    this.setState({showNotice: false});
    this.props.storageProvider.setItem(PERSONALIZE_NOTICE_SEEN_KEY, true);
  };

  render() {
    const {
      children,
      userId,
      userSlug,
      routeContext: {feedType, typeSlug, idNotFound},
      followedTools,
      items
    } = this.props;
    const {showNotice} = this.state;
    const decisionTypes = [TYPE_SERVICE, TYPE_COMPANY, TYPE_USER_DECISION];
    const showIdNotFoundNotice = Boolean(idNotFound);
    const hasFollowedTools = followedTools && followedTools.length > 0;
    const showToolsNotice =
      userId &&
      hasFollowedTools === false &&
      feedType !== TYPE_USER_DECISION &&
      feedType !== TYPE_SERVICE &&
      feedType !== TYPE_COMPANY;
    const showDecisionsNotice = items && items.length === 0 && decisionTypes.includes(feedType);
    const showEmptyFeedNotice = items && items.length === 0 && feedType === TYPE_USER;
    if (showIdNotFoundNotice) {
      const {slug, type} = idNotFound;
      const msg =
        type === TYPE_USER_DECISION
          ? `The decision with id '${slug}' does not exist. Please check the id and try again, or browse other decisions from this user below.`
          : `The ${type} '${slug}' does not exist. Please check the name and try again, or browse our top trending articles and decisions below.`;

      const title = `${type === TYPE_USER_DECISION ? 'decision' : type} id does not exist.`;
      return children(title, msg, <InfoIcon />);
    } else if (showToolsNotice) {
      return children(
        'Trending',
        "You haven't followed any tools yet, here are some trending articles",
        <TrendingIcon />
      );
    } else if (showNotice && feedType === TYPE_USER) {
      return children(
        'Your feed',
        "We've personalized your feed based on the tools you've shown interest in.",
        <InfoIcon />,
        this.handleDismissNotice
      );
    } else if (showDecisionsNotice) {
      let msg, title;
      if (feedType === TYPE_USER_DECISION) {
        msg =
          typeSlug === userSlug
            ? 'Please create or bookmark Decisions to manage them here.'
            : 'This user has not shared any decisions yet.';
        title = typeSlug === userSlug ? 'Your Decisions' : `${typeSlug}'s Stack Decisions`;
      } else {
        const type = feedType === TYPE_SERVICE ? TYPE_TOOL : feedType;
        msg = `This ${type} has no decisions tagged to it yet.`;
        title =
          feedType === TYPE_SERVICE
            ? `Stack Decisions about ${typeSlug}`
            : `${typeSlug}'s Stack Decisions`;
      }
      return children(title, msg, <InfoIcon />);
    } else if (showEmptyFeedNotice) {
      return children('Your feed', <FeedEmptyNotice />, <InfoIcon />);
    }
    return null;
  }
}

export const getFirstRunState = storageProvider => {
  const showFirstRun = !storageProvider.getBoolean(DECISIONS_FIRST_RUN_SEEN_KEY);
  if (showFirstRun) {
    return {showFirstRun, showNotice: false};
  } else {
    const showNotice = !storageProvider.getBoolean(PERSONALIZE_NOTICE_SEEN_KEY);
    return {showNotice, showFirstRun: false};
  }
};

export default compose(
  withRouteContext,
  withLocalStorage('Feed', '1')
)(FeedNotice);
