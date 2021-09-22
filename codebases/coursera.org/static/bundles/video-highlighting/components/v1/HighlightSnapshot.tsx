import React from 'react';
import TrackedButton from 'bundles/page/components/TrackedButton';

import HighlightButtonLabel from 'bundles/video-highlighting/components/v1/HighlightButtonLabel';

import type { Highlight } from 'bundles/video-highlighting/types';

import _t from 'i18n!nls/video-highlighting';

import 'css!./__styles__/HighlightSnapshot';

type Props = {
  playing: boolean;
  highlight: Highlight;
  onClick: (e: React.SyntheticEvent<HTMLButtonElement>) => void;
};

const HighlightSnapshot = ({ highlight, onClick, playing }: Props) => {
  const { snapshotDataUrl, snapshotUrl, noteStartTs, captureTs } = highlight;
  const src = snapshotUrl || snapshotDataUrl;

  if (!src) {
    return null;
  }

  return (
    <TrackedButton
      trackingName="highlight_snapshot"
      type="button"
      className="rc-HighlightSnapshot"
      onClick={onClick}
      aria-labelledby={`snapshot-btn-label-${noteStartTs || captureTs}`}
    >
      <HighlightButtonLabel
        id={`snapshot-btn-label-${noteStartTs || captureTs}`}
        startText={playing ? _t('Pause video for highlight marked') : _t('Play video for highlight marked')}
        highlight={highlight}
      />
      <img alt={_t('Video thumbnail')} src={src} />
    </TrackedButton>
  );
};

export default HighlightSnapshot;
