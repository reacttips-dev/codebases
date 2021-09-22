import React from 'react';
import PropTypes from 'prop-types';

import VideoToolbar from 'bundles/item-lecture/components/v1/toolbar/VideoToolbar';
import VideoHighlightSidebar from 'bundles/video-highlighting/components/v1/VideoHighlightSidebar';
import VideoTranscriptToolbar from 'bundles/item-lecture/components/v1/VideoTranscriptToolbar';
import VideoJsTranscriptContainer from 'bundles/item-lecture/components/v1/VideoJsTranscriptContainer';

import {
  getHighlights,
  updateHighlight,
  deleteHighlight,
  createHighlight,
  compareHighlightsByStartTimestamp,
} from 'bundles/video-highlighting';

import {
  setUIPanelVisibilityPreference,
  setHighlightsCount,
} from 'bundles/video-highlighting/utils/highlightingUIPreferenceUtils';

import type VideoContent from 'bundles/video-player/models/VideoContent';

import type { Highlight } from 'bundles/video-highlighting/types';
import type Track from 'bundles/interactive-transcript/models/Track';
import type TrackList from 'bundles/interactive-transcript/models/TrackList';
import type { VideoRegion, VideoPlayer } from 'bundles/item-lecture/types';

import type CoursesV1 from 'bundles/naptimejs/resources/courses.v1';
import type { Item } from 'bundles/learner-progress/types/Item';

/* eslint-disable no-restricted-imports */
import type ItemMetadata from 'pages/open-course/common/models/itemMetadata';
import _t from 'i18n!nls/item-lecture';
/* eslint-enable no-restricted-imports */

type Props = {
  itemId: string;
  courseId: string;
  selectedTrack: Track;
  videoPlayer: VideoPlayer;
  videoRegionRef: VideoRegion;

  course: CoursesV1;
  computedItem: Item;
  itemMetadata: ItemMetadata;
  videoContent: VideoContent;
  tracks: TrackList;
  isSubtitleTranslationEnabled: boolean;

  onTrackSelected: (track: Track) => void;
};

type State = {
  loadingHighlights: boolean;
  highlights: Array<Highlight>;
  notificationAnnouncement: string;
};

class VideoHighlightingManager extends React.Component<Props, State> {
  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      highlights: [],
      loadingHighlights: true,
      notificationAnnouncement: '',
    };
  }

  componentDidMount() {
    const {
      itemId,
      courseId,
      selectedTrack: { languageCode },
    } = this.props;
    const { executeAction } = this.context;

    getHighlights({ itemId, courseId, languageCode }).then((highlights) => {
      this.setState({ loadingHighlights: false, highlights });
      executeAction(setHighlightsCount, highlights.length);
    });
  }

  componentWillReceiveProps(nextProps: Props) {
    const {
      itemId,
      courseId,
      selectedTrack: { languageCode: previousLanguageCode },
    } = this.props;
    const { executeAction } = this.context;

    const {
      selectedTrack: { languageCode },
    } = nextProps;

    if (languageCode !== previousLanguageCode) {
      this.setState({ loadingHighlights: true });

      getHighlights({ itemId, courseId, languageCode }).then((highlights) => {
        this.setState({ loadingHighlights: false, highlights });
        executeAction(setHighlightsCount, highlights.length);
      });
    }
  }

  handleDelete = (id: string) => {
    const { highlights } = this.state;
    const { executeAction } = this.context;

    const {
      itemId,
      courseId,
      selectedTrack: { languageCode },
    } = this.props;

    const updatedHighlights = highlights.filter((h) => h.id !== id);

    this.setState({ highlights: updatedHighlights });
    // @ts-expect-error TSMIGRATION
    deleteHighlight({ itemId, courseId, languageCode, id }).then(() => {
      this.setState({ notificationAnnouncement: _t('Note deleted') });
    });

    executeAction(setHighlightsCount, updatedHighlights.length);
  };

  handleUpdate = (id: string, highlight: Highlight) => {
    const { highlights } = this.state;

    const {
      itemId,
      courseId,
      selectedTrack: { languageCode },
    } = this.props;

    this.setState({
      highlights: highlights.map((h) => (h.id === highlight.id ? { ...highlight, pendingUpdate: true } : h)),
    });

    updateHighlight({ itemId, courseId, languageCode, id, highlight }).then(() => {
      this.handleUpdateComplete(highlight.id, { ...highlight, pendingUpdate: false });
      this.setState({ notificationAnnouncement: _t('Note updated') });
    });
  };

  handleCreate = (highlight: Highlight) => {
    const { highlights } = this.state;
    const { executeAction } = this.context;

    const {
      itemId,
      courseId,
      selectedTrack: { languageCode },
    } = this.props;

    const updatedHighlights = [highlight, ...highlights];

    this.setState({ highlights: updatedHighlights });

    createHighlight({ itemId, courseId, languageCode, highlight }).then(({ id }) => {
      this.handleUpdateComplete(highlight.id, { ...highlight, id, pendingCreate: false });
    });

    executeAction(setHighlightsCount, updatedHighlights.length);
  };

  handleUpdateComplete = (id: string, highlight: Highlight) => {
    const { highlights } = this.state;

    this.setState({
      highlights: [...highlights].sort(compareHighlightsByStartTimestamp).map((h) => (h.id === id ? highlight : h)),
    });
  };

  handleFocusHighlight = () => {
    const { executeAction } = this.context;
    executeAction(setUIPanelVisibilityPreference, true);
  };

  render() {
    const { highlights, loadingHighlights, notificationAnnouncement } = this.state;

    const {
      selectedTrack,
      videoPlayer,
      course,
      computedItem,
      itemMetadata,
      courseId,
      videoContent,
      tracks,
      onTrackSelected,
      isSubtitleTranslationEnabled,
      itemId,
    } = this.props;

    return (
      <div className="rc-VideoHighlightingManager">
        <VideoHighlightSidebar
          // @ts-expect-error TSMIGRATION
          highlights={highlights}
          videoPlayer={videoPlayer}
          loading={loadingHighlights}
          notificationAnnouncement={notificationAnnouncement}
          onDelete={this.handleDelete}
          onUpdate={this.handleUpdate}
        />

        <VideoToolbar
          course={course}
          courseId={courseId}
          computedItem={computedItem}
          itemMetadata={itemMetadata}
          videoPlayer={videoPlayer}
          videoContent={videoContent}
          selectedTrack={selectedTrack}
          onCapture={this.handleCreate}
          onFocusHighlight={this.handleFocusHighlight}
        />

        <VideoTranscriptToolbar
          tracks={tracks}
          selectedTrack={selectedTrack}
          onTrackSelected={onTrackSelected}
          hideVolunteerLink={!isSubtitleTranslationEnabled}
          courseId={courseId}
          itemId={itemId}
        />

        <VideoJsTranscriptContainer
          player={videoPlayer}
          highlights={highlights}
          selectedTrack={selectedTrack}
          onSaveHighlight={this.handleCreate}
          onRemoveHighlight={this.handleDelete}
          courseId={courseId}
        />
      </div>
    );
  }
}

export default VideoHighlightingManager;
