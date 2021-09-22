import React from 'react';
import ItemFeedback from 'bundles/content-feedback/components/ItemFeedback';
import ItemTypes from 'bundles/content-feedback/constants/ItemTypes';

import CaptureHighlightButton from 'bundles/item-lecture/components/v1/toolbar/CaptureHighlightButton';
import ShareButtonWithModalVideo from 'bundles/item-lecture/components/v1/ShareButtonWithModalVideo';
import DiscussButton from 'bundles/item-lecture/components/v1/toolbar/DiscussButton';
import DownloadsDropdown from 'bundles/item-lecture/components/v1/toolbar/DownloadsDropdown';

/* eslint-disable no-restricted-imports */
import type ItemMetadata from 'pages/open-course/common/models/itemMetadata';
/* eslint-enable no-restricted-imports */

import type VideoContent from 'bundles/video-player/models/VideoContent';

import getSocialCaptions from 'bundles/video-logged-out-page/utils/getSocialCaptions';

import type { Item } from 'bundles/learner-progress/types/Item';
import type Track from 'bundles/interactive-transcript/models/Track';
import type CoursesV1 from 'bundles/naptimejs/resources/courses.v1';
import type { VideoPlayer } from 'bundles/item-lecture/types';
import type { Highlight } from 'bundles/video-highlighting';

import epicClient from 'bundles/epic/client';
import _t from 'i18n!nls/video-player';

import { Box } from '@coursera/coursera-ui';

import 'css!./__styles__/VideoToolbar';

type Props = {
  courseId: string;
  course: CoursesV1;

  computedItem: Item;
  itemMetadata: ItemMetadata;

  videoPlayer: VideoPlayer;
  videoContent: VideoContent;

  selectedTrack?: Track;
  onCapture?: (highlight: Highlight) => void;
  onFocusHighlight?: (highlight: Highlight) => void;
  disableHighlighting?: boolean;
};

const VideoToolbar = ({
  courseId,
  computedItem,
  itemMetadata,
  course,
  selectedTrack,
  videoPlayer,
  videoContent,
  onCapture,
  onFocusHighlight,
  disableHighlighting,
}: Props) => {
  const { weekNumber } = computedItem;
  const { isClosedCourse } = course;

  const shouldShowVideoDownloads = !(course && isClosedCourse);

  const isDiscussionForumsDisabled = epicClient.get('featureBlacklist', 'discussions');

  return (
    <div className="rc-VideoToolbar horizontal-box wrap align-items-spacebetween">
      <Box flexWrap="wrap" alignItems="center">
        {!disableHighlighting && onCapture && onFocusHighlight && (
          <CaptureHighlightButton
            videoPlayer={videoPlayer}
            selectedTrack={selectedTrack}
            onCapture={onCapture}
            onFocusHighlight={onFocusHighlight}
          />
        )}

        {!isDiscussionForumsDisabled && <DiscussButton weekNumber={weekNumber} />}

        <DownloadsDropdown
          courseId={courseId}
          videoPlayer={videoPlayer}
          itemMetadata={itemMetadata}
          computedItem={computedItem}
          videoContent={videoContent}
          shouldShowVideoDownloads={shouldShowVideoDownloads}
        />
      </Box>

      <Box alignItems="center">
        <ShareButtonWithModalVideo
          style={{ marginTop: '8px' }}
          utmMediumParam="page_share"
          utmContentParam="in_course_lecture"
          utmCampaignParam="bar_button"
          title={_t('Share this video')}
          description={_t('If you enjoy this video, take the time to show your friends.')}
          captions={getSocialCaptions({
            courseName: course.name,
            partnerName: itemMetadata?.get('course')?.get('universities')?.getNamesString(),
          })}
        />
        <ItemFeedback courseId={courseId} computedItem={computedItem} itemFeedbackType={ItemTypes.Lecture} />
      </Box>
    </div>
  );
};

export default VideoToolbar;
