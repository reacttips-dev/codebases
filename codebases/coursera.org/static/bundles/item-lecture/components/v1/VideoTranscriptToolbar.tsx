import React from 'react';
import { Box } from '@coursera/coursera-ui';

import VolunteerLink from 'bundles/translation/components/VolunteerLink';
import { TrackChooser } from 'bundles/interactive-transcript';

import type Track from 'bundles/interactive-transcript/models/Track';
import type TrackList from 'bundles/interactive-transcript/models/TrackList';

import _t from 'i18n!nls/item-lecture';

type Props = {
  tracks: TrackList;
  selectedTrack: Track;
  onTrackSelected: (track: Track) => void;
  hideVolunteerLink: boolean;
  itemId?: string;
  courseId?: string;
};

const VideoTranscriptToolbar = ({
  tracks,
  selectedTrack,
  onTrackSelected,
  itemId,
  courseId,
  hideVolunteerLink = false,
}: Props) => {
  return (
    <div className="rc-VideoTranscriptToolbar">
      <Box justifyContent="between" alignItems="center">
        <TrackChooser
          tracks={tracks}
          selectedTrack={selectedTrack}
          onTrackSelect={onTrackSelected}
          courseId={courseId}
          itemId={itemId}
        />

        {!hideVolunteerLink && (
          <VolunteerLink
            linkClassName="volunteer-link"
            linkStyle={{ fontSize: '14px' }}
            linkTrackingName="lecture_translation_link"
            modalTrackingName="lecture_translation_modal"
          >
            {_t('Help Us Translate')}
          </VolunteerLink>
        )}
      </Box>
    </div>
  );
};

export default VideoTranscriptToolbar;
