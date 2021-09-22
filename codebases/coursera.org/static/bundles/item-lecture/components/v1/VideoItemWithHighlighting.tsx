import _ from 'lodash';
import React from 'react';
import _t from 'i18n!nls/course-v2';
import PropTypes from 'prop-types';

import VideoMiniPlayer from 'bundles/item-lecture/components/v1/VideoMiniPlayer';
import VideoToolbar from 'bundles/item-lecture/components/v1/toolbar/VideoToolbar';
import VideoOrigamiRegion from 'bundles/item-lecture/components/v1/VideoOrigamiRegion';
import RecordFullStoryForVideo from 'bundles/item-lecture/components/v1/RecordFullStoryForVideo';
import VideoHighlightingManager from 'bundles/item-lecture/components/v1/VideoHighlightingManager';

import { getDefaultTrack, buildTracks } from 'bundles/interactive-transcript/utils/TrackUtils';
import { getUIPanelVisibilityPreference, setUIPanelEnabled } from 'bundles/video-highlighting';

/* eslint-disable no-restricted-imports */
import type ItemMetadata from 'pages/open-course/common/models/itemMetadata';
import type VerificationDisplay from 'bundles/verificationDisplay/models/verificationDisplay';
/* eslint-enable no-restricted-imports */

/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import type CourseProgress from 'pages/open-course/common/models/courseProgress';
import type TrackList from 'bundles/interactive-transcript/models/TrackList';
import type CoursesV1 from 'bundles/naptimejs/resources/courses.v1';

import type { Item } from 'bundles/learner-progress/types/Item';

import type {
  VideoRegion,
  VideoPlayer,
  VideoQuizModel,
  EnrollmentMode,
  InteractiveTranscript,
} from 'bundles/item-lecture/types';

import type Track from 'bundles/interactive-transcript/models/Track';
import type VideoContent from 'bundles/video-player/models/VideoContent';

import 'css!./__styles__/VideoItemWithHighlighting';

type Props = {
  course: CoursesV1;
  computedItem: Item;
  itemMetadata: ItemMetadata;
  courseProgress: CourseProgress;
  verificationDisplay: typeof VerificationDisplay;
  isSubtitleTranslationEnabled: boolean;

  autoplay: boolean;
  startPlaybackSeconds: number;

  videoQuizModel: VideoQuizModel;
  enrollmentMode: EnrollmentMode;
  videoContent: VideoContent;
};

type State = {
  videoPlayer?: VideoPlayer;
  videoRegion?: VideoRegion;
  selectedTrack?: Track;
  tracks?: TrackList;
};

class VideoItemWithHighlighting extends React.Component<Props, State> {
  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
  };

  state: State = {
    tracks: undefined,
    videoPlayer: undefined,
    videoRegion: undefined,
    selectedTrack: undefined,
  };

  handleTrackSelected = (selectedTrack: Track) => {
    if (selectedTrack) {
      this.setState({ selectedTrack });
    }
  };

  setVideoPlayer = (videoPlayer: VideoPlayer) => {
    this.setState({ videoPlayer });
  };

  setVideoRegion = (videoRegion: VideoRegion) => {
    this.setState({ videoRegion });
  };

  setInteractiveTranscript = (interactiveTranscript: InteractiveTranscript | null) => {
    const { executeAction } = this.context;

    // The transcript hasn't loaded yet.
    // Do not reset ui panel until transcript is completely loaded
    if (!interactiveTranscript) {
      this.setState({ tracks: undefined, selectedTrack: undefined });
      return;
    }

    // The video does not have transcripts in any language
    if (_.isEmpty(interactiveTranscript.languageMap)) {
      executeAction(setUIPanelEnabled, false);
      // @ts-expect-error ts-migrate(2322) FIXME: Type 'null' is not assignable to type 'TrackList |... Remove this comment to see the full error message
      this.setState({ tracks: null, selectedTrack: null });
      return;
    }

    const { selectedTrack: track } = this.state;

    const { languageMap, defaultLanguage } = interactiveTranscript;
    const tracks = buildTracks(languageMap);
    const defaultTrack = getDefaultTrack(tracks, defaultLanguage);
    const selectedTrack = track || defaultTrack;

    executeAction(setUIPanelEnabled, true);
    this.setState({ tracks, selectedTrack });
  };

  render() {
    const {
      course,
      itemMetadata,
      computedItem,
      courseProgress,
      verificationDisplay,
      enrollmentMode,
      autoplay,
      startPlaybackSeconds,
      videoQuizModel,
      videoContent,
      isSubtitleTranslationEnabled,
    } = this.props;

    const { videoPlayer, videoRegion, selectedTrack, tracks } = this.state;

    const { id: itemId } = computedItem;
    const { slug: courseSlug, id: courseId } = course;

    const isVideoPlayerReady = videoRegion && videoPlayer;
    const { name } = videoContent;
    const ariaLabel = _t('Video: #{name}', { name });

    return (
      <RecordFullStoryForVideo
        autoplay={autoplay}
        courseSlug={courseSlug}
        computedItem={computedItem}
        isVideoHighlightingEnabled
      >
        {/* TODO: Avoid the data-js attribute dependency by pages/open-course/video/views/video.js to set video width/height attributes */}
        <div className="rc-VideoItemWithHighlighting" data-js="item-container">
          <h1 className="video-name">{name}</h1>

          <VideoMiniPlayer videoPlayer={videoPlayer} videoRegion={videoRegion}>
            <VideoOrigamiRegion
              computedItem={computedItem}
              courseProgress={courseProgress}
              verificationDisplay={verificationDisplay}
              itemMetadata={itemMetadata}
              enrollmentMode={enrollmentMode}
              autoplay={autoplay}
              startPlaybackSeconds={startPlaybackSeconds}
              videoQuizModel={videoQuizModel}
              videoContent={videoContent}
              setVideoPlayer={this.setVideoPlayer}
              setVideoRegion={this.setVideoRegion}
              setInteractiveTranscript={this.setInteractiveTranscript}
              ariaLabel={ariaLabel}
            />
          </VideoMiniPlayer>

          {isVideoPlayerReady && selectedTrack && (
            <VideoHighlightingManager
              itemId={itemId}
              courseId={courseId}
              videoPlayer={videoPlayer}
              videoRegionRef={videoRegion}
              selectedTrack={selectedTrack}
              // @ts-expect-error ts-migrate(2322) FIXME: Type 'TrackList | undefined' is not assignable to ... Remove this comment to see the full error message
              tracks={tracks}
              onTrackSelected={this.handleTrackSelected}
              computedItem={computedItem}
              itemMetadata={itemMetadata}
              videoContent={videoContent}
              course={course}
              isSubtitleTranslationEnabled={isSubtitleTranslationEnabled}
            />
          )}

          {isVideoPlayerReady && selectedTrack === null && (
            <VideoToolbar
              course={course}
              courseId={courseId}
              computedItem={computedItem}
              itemMetadata={itemMetadata}
              videoPlayer={videoPlayer}
              videoContent={videoContent}
              disableHighlighting
            />
          )}
        </div>
      </RecordFullStoryForVideo>
    );
  }
}

export default getUIPanelVisibilityPreference(VideoItemWithHighlighting);
