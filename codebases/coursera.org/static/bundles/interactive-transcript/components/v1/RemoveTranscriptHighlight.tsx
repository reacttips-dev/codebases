import React from 'react';
import TranscriptHighlightButton from 'bundles/interactive-transcript/components/v1/TranscriptHighlightButton';

import { getModifierKeyForPlatform } from 'bundles/interactive-transcript/utils/HotkeyUtils';

import type { Highlight } from 'bundles/video-highlighting/types';

import _t from 'i18n!nls/interactive-transcript';

type Props = {
  targetedHighlight: Highlight;
  onRemove: () => void;
  showKeyboardControls: boolean;
};

const RemoveTranscriptHighlight = ({ targetedHighlight, onRemove, showKeyboardControls }: Props) => {
  if (!targetedHighlight.transcriptTextStartIndex) {
    return null;
  }

  const modiferKey = getModifierKeyForPlatform();
  const keyboardControlLabel = _t('Press [#{modiferKey} + D] to Delete Note', { modiferKey });
  const label = showKeyboardControls ? keyboardControlLabel : _t('Delete Note');

  const { cueIndex } = targetedHighlight.transcriptTextStartIndex;
  return (
    <TranscriptHighlightButton
      onClick={onRemove}
      cueIndex={cueIndex}
      label={label}
      trackingName="delete_transcript_highlight"
    />
  );
};

export default RemoveTranscriptHighlight;
