import React from 'react';

import { Box, color } from '@coursera/coursera-ui';
import { SvgPlayFilled, SvgPauseFilled } from '@coursera/coursera-ui/svg';

import TrackedButton from 'bundles/page/components/TrackedButton';

import { formatTime } from 'bundles/interactive-transcript/utils/TranscriptUtils';
import HighlightButtonLabel from 'bundles/video-highlighting/components/v1/HighlightButtonLabel';

import type { Highlight } from 'bundles/video-highlighting/types';

import _t from 'i18n!nls/video-highlighting';

import 'css!./__styles__/HighlightPlayButton';

type Props = {
  playing: boolean;
  highlight: Highlight;
  onClick: (e: React.SyntheticEvent<HTMLButtonElement>) => void;
  onSetRef?: (ref: HTMLButtonElement | null) => void;
};

const HighlightPlayButton = ({ highlight, onClick, playing }: Props) => {
  const { id, noteStartTs, noteEndTs, captureTs } = highlight;

  let playLabel;

  if (noteStartTs && noteEndTs) {
    playLabel = `${formatTime(noteStartTs)} - ${formatTime(noteEndTs)}`;
  } else {
    playLabel = formatTime(captureTs);
  }

  return (
    <TrackedButton
      type="button"
      onClick={onClick}
      className="rc-HighlightPlayButton"
      trackingName="highlight_timestamp"
      aria-labelledby={`play-btn-label-${id}`}
    >
      <HighlightButtonLabel
        id={`play-btn-label-${id}`}
        startText={playing ? _t('Pause video for the note marked') : _t('Play video for the note marked')}
        highlight={highlight}
      />
      <Box justifyContent="between">
        {playing ? (
          <SvgPauseFilled suppressTitle={true} color={color.secondaryText} size={12} />
        ) : (
          <SvgPlayFilled suppressTitle={true} color={color.secondaryText} size={12} />
        )}

        {playLabel}
      </Box>
    </TrackedButton>
  );
};

export default HighlightPlayButton;
