import React from 'react';
import a11yKeyPress from 'js/lib/a11yKeyPress';
import TrackedDiv from 'bundles/page/components/TrackedDiv';

import type { Highlight } from 'bundles/video-highlighting/types';
import HighlightButtonLabel from 'bundles/video-highlighting/components/v1/HighlightButtonLabel';

import _t from 'i18n!nls/video-highlighting';

import 'css!./__styles__/HighlightTranscript';

type Props = {
  highlight: Highlight;
  playing: boolean;
  onClick: (e: React.SyntheticEvent<HTMLButtonElement>) => void;
};

const HighlightTranscript = ({ highlight, onClick, playing }: Props) => {
  const { snapshotUrl, snapshotDataUrl, transcriptText, noteStartTs, captureTs } = highlight;

  if (!transcriptText) {
    return null;
  }

  const snapshot = snapshotUrl || snapshotDataUrl;

  const maxLength = snapshot ? 300 : 500;
  const formattedTranscriptText =
    transcriptText.length > maxLength ? `${transcriptText.substring(0, maxLength)}...` : transcriptText;

  return (
    <TrackedDiv
      role="button"
      tabIndex={0}
      onClick={onClick}
      className="rc-HighlightTranscript"
      trackingName="highlight_transcript"
      onKeyPress={(event) => a11yKeyPress(event, onClick)}
      aria-labelledby={`transcript-btn-label-${noteStartTs || captureTs}`}
    >
      <HighlightButtonLabel
        id={`transcript-btn-label-${noteStartTs || captureTs}`}
        startText={
          playing
            ? _t('Pause video for highlighted transcript with text, #{formattedTranscriptText}, marked', {
                formattedTranscriptText,
              })
            : _t('Play video for highlighted transcript with text, #{formattedTranscriptText}, marked', {
                formattedTranscriptText,
              })
        }
        highlight={highlight}
      />
      {formattedTranscriptText}
    </TrackedDiv>
  );
};

export default HighlightTranscript;
