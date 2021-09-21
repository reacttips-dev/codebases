import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import {
  receiveRSSFeedError,
  submitRSSFeed,
  receiveRSSSearch,
  receiveRSSFeedMetadata,
} from '../../../../onboarding';

import { ImportSection as ImportSectionView } from './ImportSection';

// Redux ------------------------------------------------

const mapDispatchToProps = dispatch => ({
  onTypeaheadSearch: value => {
    dispatch(receiveRSSSearch(value));
  },
  onSelectTypeahead: option => {
    if (option[0]) {
      const rssMetadata = option[0];
      const rssFeedUrl = rssMetadata.feedUrl;
      if (rssFeedUrl && rssMetadata.podcastName) {
        if (rssFeedUrl.startsWith('https://anchor.fm/')) {
          // User is importing an anchor account
          // TODO (bui): a cta here? server check?
          const title = rssMetadata.podcastName;
          dispatch(
            receiveRSSFeedError({
              message: `${title} is already on Anchor! Just login to access this podcast.`,
            })
          );
        } else {
          dispatch(submitRSSFeed(rssFeedUrl));
        }
      } else {
        dispatch(
          receiveRSSFeedError({
            message:
              'Sorry, we were unable to extract an RSS feed from this result.',
          })
        );
      }
    } else {
      // Clear any possible metadata
      dispatch(receiveRSSFeedMetadata({}));
    }
  },
  onBlur: feedUrl => {
    dispatch(submitRSSFeed(feedUrl));
  },
  onSubmit: feedUrl => {
    dispatch(push('/switch/signup'));
  },
});
const mapStateToProps = ({
  onboarding: {
    fetchingRSSFeedImport,
    rssFeed,
    rssFeedIsValid,
    rssFeedError,
    rssFeedMetadata,
  },
  search,
}) => ({
  enableReinitialize: true,
  initialValues: {
    rssFeedUrl: rssFeed,
  },
  fetchingRSSFeedImport,
  rssFeedUrl: rssFeed,
  rssFeedIsValid,
  rssFeedError,
  rssFeedMetadata,
  isSearching: search.isSearchingRssTypeaheadResults,
  rssTypeaheadResults: search.rssTypeaheadResults,
});

export const ImportSection = connect(
  mapStateToProps,
  mapDispatchToProps
)(ImportSectionView);
