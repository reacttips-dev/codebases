// triggering ondemand app build
import React from 'react';

import { Box } from '@coursera/coursera-ui';
import _t from 'i18n!nls/course-v2';

import RecordFullStoryForVideo from 'bundles/item-lecture/components/v1/RecordFullStoryForVideo';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import LectureResources from 'bundles/item-lecture/components/v1/LectureResources';
import VideoOrigamiRegion from 'bundles/item-lecture/components/v1/VideoOrigamiRegion';
import DiscussionPromotionCard from 'bundles/item-lecture/components/v1/DiscussionPromotionCard';
import VideoItemTranscript from 'bundles/item-lecture/components/v1/VideoItemTranscript';
import ItemFeedback from 'bundles/content-feedback/components/ItemFeedback';
import ItemTypes from 'bundles/content-feedback/constants/ItemTypes';

/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import { isForumsBlacklisted } from 'bundles/ondemand/utils/socialExperimentUtils';

/* eslint-disable no-restricted-imports */
import type ItemMetadata from 'pages/open-course/common/models/itemMetadata';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import type CourseProgress from 'pages/open-course/common/models/courseProgress';
import type VerificationDisplay from 'bundles/verificationDisplay/models/verificationDisplay';
/* eslint-enable no-restricted-imports */
import type CoursesV1 from 'bundles/naptimejs/resources/courses.v1';

import type { Item } from 'bundles/learner-progress/types/Item';
import type {
  VideoRegion,
  VideoPlayer,
  VideoQuizModel,
  EnrollmentMode,
  InteractiveTranscript,
} from 'bundles/item-lecture/types';
import type VideoContent from 'bundles/video-player/models/VideoContent';

import 'css!./__styles__/VideoItem';

type Props = {
  courseId: string;
  weekNumber: number;
  isPreviewMode: boolean;
  isSubtitleTranslationEnabled: boolean; // hide volunteer links like "Help Us Translate" when disabled

  course: CoursesV1;
  computedItem: Item;
  itemMetadata: ItemMetadata;
  courseProgress: CourseProgress;
  verificationDisplay: typeof VerificationDisplay;

  autoplay: boolean;
  startPlaybackSeconds: number;

  videoQuizModel: VideoQuizModel;
  enrollmentMode: EnrollmentMode;
  videoContent: VideoContent;
};

type State = {
  videoRegion: VideoRegion;
  videoPlayer: VideoPlayer;
  interactiveTranscript: InteractiveTranscript | null;
};

class VideoItem extends React.Component<Props, State> {
  state = {
    videoRegion: null,
    videoPlayer: null,
    interactiveTranscript: null,
  };

  setVideoPlayer = (videoPlayer: any) => {
    this.setState({ videoPlayer });
  };

  setVideoRegion = (videoRegion: any) => {
    this.setState({ videoRegion });
  };

  setInteractiveTranscript = (interactiveTranscript: any) => {
    this.setState({ interactiveTranscript });
  };

  render() {
    const {
      courseId,
      weekNumber,
      isPreviewMode,
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

    const { slug: courseSlug } = course;
    const { name } = videoContent;

    const { videoPlayer, videoRegion, interactiveTranscript } = this.state;

    const includeDiscussions = !isForumsBlacklisted(courseId) && !isPreviewMode && weekNumber;
    const includeVideoResources = !(course && course.isClosedCourse);
    const ariaLabel = _t('Video: #{name}', { name });

    return (
      <RecordFullStoryForVideo autoplay={autoplay} courseSlug={courseSlug} computedItem={computedItem}>
        <div className="rc-VideoItem">
          <div className="horizontal-box" data-js="item-container">
            <div className="content-container">
              <div className="video-container">
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
              </div>

              <Box rootClassName="video-meta" justifyContent="between">
                <h1 className="video-name">{name}</h1>
                <ItemFeedback courseId={courseId} computedItem={computedItem} itemFeedbackType={ItemTypes.Lecture} />
              </Box>

              <div className="extras horizontal-box align-items-top wrap">
                {(interactiveTranscript || includeDiscussions) && (
                  <div className="flex-3 main-column">
                    {includeDiscussions && <DiscussionPromotionCard weekNumber={weekNumber} />}

                    {interactiveTranscript && (
                      <VideoItemTranscript
                        itemId={computedItem.id}
                        player={videoPlayer}
                        courseId={courseId}
                        videoRegionRef={videoRegion}
                        hideHelpUsTranslate={!isSubtitleTranslationEnabled}
                        {...interactiveTranscript}
                      />
                    )}
                  </div>
                )}

                <LectureResources
                  courseId={courseId}
                  videoPlayer={videoPlayer}
                  itemMetadata={itemMetadata}
                  shouldShowVideoDownloads={includeVideoResources}
                  hideVolunteerLink={!isSubtitleTranslationEnabled}
                />
              </div>
            </div>
          </div>
        </div>
      </RecordFullStoryForVideo>
    );
  }
}

export default VideoItem;
