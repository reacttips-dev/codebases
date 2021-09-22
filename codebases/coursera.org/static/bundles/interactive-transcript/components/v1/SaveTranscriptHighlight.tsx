import React from 'react';
import TranscriptHighlightButton from 'bundles/interactive-transcript/components/v1/TranscriptHighlightButton';

import { getModifierKeyForPlatform } from 'bundles/interactive-transcript/utils/HotkeyUtils';
import type { TranscriptSelection } from 'bundles/video-highlighting/types';

import _t from 'i18n!nls/interactive-transcript';

type Props = {
  onSave: () => void;
  onCancel: () => void;
  transcriptSelection: TranscriptSelection;
  showKeyboardControls: boolean;
};
class SaveTranscriptHighlight extends React.Component<Props> {
  saveHighlight: HTMLElement | null;

  constructor(props: Props) {
    super(props);

    this.saveHighlight = null;
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleDocumentMouseDown);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleDocumentMouseDown);
  }

  handleClick = () => {
    const { onSave } = this.props;
    const selection = window.getSelection();

    if (selection) {
      selection.empty();
    }

    onSave();
  };

  handleDocumentMouseDown = (e: MouseEvent) => {
    const { onCancel } = this.props;

    if (this.saveHighlight && !this.saveHighlight.contains(e.target as Node)) {
      onCancel();
    }
  };

  render() {
    const {
      showKeyboardControls,
      transcriptSelection: {
        transcriptTextStartIndex: { cueIndex },
      },
    } = this.props;

    const modiferKey = getModifierKeyForPlatform();
    const keyboardControlLabel = _t('Press [#{modiferKey} + S] to Save Note', { modiferKey });
    const label = showKeyboardControls ? keyboardControlLabel : _t('Save Note');

    return (
      <TranscriptHighlightButton
        cueIndex={cueIndex}
        label={label}
        onClick={this.handleClick}
        trackingName="create_transcript_highlight"
      />
    );
  }
}

export default SaveTranscriptHighlight;
