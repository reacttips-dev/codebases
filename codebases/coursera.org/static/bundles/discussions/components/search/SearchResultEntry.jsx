import PropTypes from 'prop-types';
import React from 'react';
import ThreadsListEntry from 'bundles/discussions/components/discussionsBody/ThreadsListEntry';
import { profilePropType } from 'bundles/discussions/lib/propTypes';
import * as discussionsUrl from 'bundles/discussions/utils/discussionsUrl';
import unreadTracker from 'bundles/discussions/utils/unreadTracker';
import _t from 'i18n!nls/discussions';

class SearchResultEntry extends React.Component {
  static propTypes = {
    entry: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      snippet: PropTypes.object.isRequired,
      creator: profilePropType.isRequired,
      createdAt: PropTypes.number,
      forumId: PropTypes.string,
    }).isRequired,
    index: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    query: PropTypes.string.isRequired,
    forumLink: PropTypes.string.isRequired,
  };

  render() {
    const { entry } = this.props;
    const isRead = !unreadTracker.hasUnread(entry);

    return (
      <div className="rc-SearchResultEntry nostyle">
        <ThreadsListEntry
          threadUrl={discussionsUrl.getDeepLink(this.props.forumLink, this.props.entry)}
          profile={entry.creator}
          timestamp={entry.createdAt}
          threadName={entry.title}
          snippet={entry.snippet}
          questionId={entry.id}
          questionUserId={entry.creator.userId}
          isRead={isRead}
          metadataLabel={_t('Post by')}
        />
      </div>
    );
  }
}

export default SearchResultEntry;
