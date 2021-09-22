import React from 'react';
import _t from 'i18n!nls/interactive-transcript';
import debounce from 'lodash/debounce';

import SaveTranscriptHighlight from 'bundles/interactive-transcript/components/v1/SaveTranscriptHighlight';
import RemoveTranscriptHighlight from 'bundles/interactive-transcript/components/v1/RemoveTranscriptHighlight';
import TranscriptAnnouncer from 'bundles/interactive-transcript/components/v1/TranscriptAnnouncer';
import A11yScreenReaderOnly from 'bundles/a11y/components/A11yScreenReaderOnly';
import { getModifierKeyForPlatform } from 'bundles/interactive-transcript/utils/HotkeyUtils';

import {
  findParentCueElement,
  getTranscriptSelection,
  mouseMovedInNeighborhoodOfHighlight,
  getHighlightForCueElement,
  expandSelection,
  contractSelection,
} from 'bundles/interactive-transcript/utils/TranscriptHighlighterUtils';

import type { Highlight, TranscriptSelection } from 'bundles/video-highlighting/types';

type Props = {
  children: JSX.Element;
  highlights: Array<Highlight>;
  onSelect: (highlight?: Highlight | null) => void;
  onSave: (selection: TranscriptSelection) => void;
  onRemove: (x: string) => void;
};

type State = {
  targetedHighlight?: Highlight | null;
  transcriptSelection?: TranscriptSelection;
  announcementText: string | null;
  showKeyboardControls: boolean;
};

class TranscriptHighlighter extends React.Component<Props, State> {
  transcriptHighlighter: HTMLElement | null;

  mouseMoveTimeout: number | null;

  saveHighlightButton: HTMLElement | null;

  setTranscriptHighlighterRef: (el: HTMLDivElement | null) => void;

  setSaveHighlightButtonRef: (el: HTMLElement | null) => void;

  constructor(props: Props) {
    super(props);

    this.mouseMoveTimeout = null;
    this.transcriptHighlighter = null;
    this.saveHighlightButton = null;

    this.setTranscriptHighlighterRef = (el) => {
      this.transcriptHighlighter = el;
    };

    this.setSaveHighlightButtonRef = (el: HTMLElement | null) => {
      this.saveHighlightButton = el;
    };

    this.state = {
      announcementText: null,
      targetedHighlight: null,
      transcriptSelection: undefined,
      showKeyboardControls: false,
    };
  }

  componentDidMount() {
    if (this.transcriptHighlighter) {
      this.transcriptHighlighter.addEventListener('mouseup', this.handleMouseUp);
    }

    if (this.transcriptHighlighter) {
      this.transcriptHighlighter.addEventListener('mousemove', this.handleMouseMove);
    }

    if (this.transcriptHighlighter) {
      this.transcriptHighlighter.addEventListener('mouseleave', this.handleMouseLeave);
    }

    if (this.transcriptHighlighter) {
      this.transcriptHighlighter.addEventListener('keydown', this.handleKeyboardControls);
    }
  }

  componentWillUnmount() {
    if (this.transcriptHighlighter) {
      this.transcriptHighlighter.removeEventListener('mouseup', this.handleMouseUp);
    }

    if (this.transcriptHighlighter) {
      this.transcriptHighlighter.removeEventListener('mousemove', this.handleMouseMove);
    }

    if (this.transcriptHighlighter) {
      this.transcriptHighlighter.removeEventListener('mouseleave', this.handleMouseLeave);
    }

    if (this.transcriptHighlighter) {
      this.transcriptHighlighter.removeEventListener('keydown', this.handleKeyboardControls);
    }
  }

  handleSave = () => {
    const { onSave } = this.props;
    const { transcriptSelection } = this.state;

    if (transcriptSelection) {
      onSave(transcriptSelection);
      this.setState({ transcriptSelection: undefined });
      const selection = window.getSelection();
      if (selection) {
        selection.empty();
      }
      this.updateAnnouncementText(_t('Note Saved!'));
    }
  };

  handleRemove = () => {
    const { onRemove } = this.props;
    const { targetedHighlight } = this.state;

    if (targetedHighlight) {
      onRemove(targetedHighlight.id);
      this.setState({ targetedHighlight: undefined });
      this.updateAnnouncementText(_t('Note Deleted!'));
    }
  };

  handleCancel = () => {
    const selection = window.getSelection();
    if (selection) {
      selection.empty();
    }

    this.setState({ transcriptSelection: undefined });
  };

  handleMouseUp = () => {
    this.updateSelection();
    this.setState({ showKeyboardControls: false });
  };

  handleMouseMove = (event: MouseEvent) => {
    if (this.mouseMoveTimeout) {
      clearTimeout(this.mouseMoveTimeout);
    }

    this.mouseMoveTimeout = window.setTimeout(() => {
      const { targetedHighlight } = this.state;
      const { highlights, onSelect } = this.props;

      // if a selection is made, remove targeted highlight
      const selection = window.getSelection();
      if (selection && selection.toString()) {
        this.mouseMoveTimeout = null;
        this.resetTargetedHighlight();

        return;
      }

      const targetIsHighlight = event.target && (event.target as HTMLElement).matches('mark');
      const selectedCueElement = targetIsHighlight ? findParentCueElement(event.target as HTMLElement) : null;
      const selectedTargetHighlight = selectedCueElement
        ? getHighlightForCueElement(highlights, selectedCueElement)
        : null;

      // if a new highlight wasn't targeted and mouse was moved in the neighborhood
      // of a previously targeted highlight, keep the highlight targeted.
      if (
        !selectedTargetHighlight &&
        targetedHighlight &&
        this.transcriptHighlighter &&
        mouseMovedInNeighborhoodOfHighlight(event, targetedHighlight, this.transcriptHighlighter)
      ) {
        return;
      }

      if (!selectedTargetHighlight) {
        this.mouseMoveTimeout = null;
        this.resetTargetedHighlight();
        return;
      }

      this.setState({ targetedHighlight: selectedTargetHighlight });
      onSelect(selectedTargetHighlight);

      this.mouseMoveTimeout = null;
    }, 0);
  };

  handleMouseLeave = () => {
    // on mouse leave, reset targeted highlight
    this.mouseMoveTimeout = null;
    this.resetTargetedHighlight();
  };

  handleKeyboardControls = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      this.setState({ showKeyboardControls: true });
    }

    // If user is expanding the selection using the keyboard, load the new selection into state
    if (
      e.shiftKey &&
      (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'ArrowDown')
    ) {
      // move updating selection to the next stack to ensure that the newly selected text has been added to the browser selection
      window.setTimeout(this.updateSelection, 0);
    }

    // if a user is using the screen reader compatible access keys, expand or contract the selection manually then load the selection into state
    if (e.metaKey || e.ctrlKey || (e.ctrlKey && e.altKey)) {
      const modifySelection = (payload: $TSFixMe) => {
        e.preventDefault();
        e.stopPropagation();
        return e.shiftKey ? contractSelection(payload) : expandSelection(payload);
      };

      switch (e.key) {
        case 'l':
        case 'ArrowRight': {
          modifySelection({ direction: 'right', magnitude: 'word' });
          break;
        }
        case 'h':
        case 'ArrowLeft': {
          modifySelection({ direction: 'left', magnitude: 'word' });
          break;
        }
        case 'j':
        case 'ArrowDown': {
          modifySelection({ direction: 'right', magnitude: 'phrase' });
          break;
        }
        case 'k':
        case 'ArrowUp': {
          modifySelection({ direction: 'left', magnitude: 'phrase' });
          break;
        }
        case 's': {
          e.preventDefault();
          this.handleSave();
          break;
        }
        case 'd': {
          e.preventDefault();
          this.handleRemove();
          break;
        }
        default:
          return;
      }
      window.setTimeout(this.updateSelection, 0);
    }
  };

  handleSelectingNote = (selectedMark: HTMLElement) => {
    const { highlights } = this.props;
    const modifierKey = getModifierKeyForPlatform();

    const selectedCueElement = findParentCueElement(selectedMark as HTMLElement);
    const selectedTargetHighlight = selectedCueElement
      ? getHighlightForCueElement(highlights, selectedCueElement)
      : null;
    if (selectedTargetHighlight) {
      this.setState({ targetedHighlight: selectedTargetHighlight });
      this.updateAnnouncementText(
        _t('Previously saved note: #{highlightedText}. Press [#{modifierKey} + D] to delete the note', {
          highlightedText: selectedTargetHighlight.transcriptText,
          modifierKey,
        })
      );
    }
  };

  updateSelection = () => {
    const transcriptSelection = getTranscriptSelection();
    const modifierKey = getModifierKeyForPlatform();
    this.setState({ transcriptSelection });

    const selection = window.getSelection();

    if (selection) {
      // check if the current selection includes any marks
      const selectedMarks = Array.from(document.getElementsByTagName('mark')).filter((el) =>
        selection.containsNode(el, true)
      );
      const selectedMark = selectedMarks[0];
      if (selectedMark) {
        this.handleSelectingNote(selectedMark);
      } else {
        this.resetTargetedHighlight();
        this.updateAnnouncementText(
          _t('#{selectedText}: Added to Selection. Press [#{modifierKey} + S] to save as a note', {
            selectedText: selection && selection.toString(),
            modifierKey,
          })
        );
      }
    }
  };

  resetTargetedHighlight = () => {
    const { onSelect } = this.props;
    this.setState({ targetedHighlight: null });
    onSelect(null);
  };

  updateAnnouncementText = debounce((announcementText: string | null) => this.setState({ announcementText }), 250, {
    leading: true,
  });

  render() {
    const { children } = this.props;
    const { transcriptSelection, announcementText, targetedHighlight, showKeyboardControls } = this.state;
    const modifierKey = getModifierKeyForPlatform();

    return (
      <div className="rc-TranscriptHighlighter" ref={this.setTranscriptHighlighterRef}>
        {transcriptSelection && !targetedHighlight && (
          <SaveTranscriptHighlight
            onSave={this.handleSave}
            onCancel={this.handleCancel}
            transcriptSelection={transcriptSelection}
            showKeyboardControls={showKeyboardControls}
          />
        )}

        {targetedHighlight && (
          <RemoveTranscriptHighlight
            targetedHighlight={targetedHighlight}
            onRemove={this.handleRemove}
            showKeyboardControls={showKeyboardControls}
          />
        )}

        <A11yScreenReaderOnly tagName="p">
          {_t(
            'You may navigate through the transcript using tab. To save a note for a section of text press #{modifierKey} + S. To expand your selection you may use #{modifierKey} + arrow key. You may contract your selection using shift + #{modifierKey} + arrow key. For screen readers that are incompatible with using arrow keys for shortcuts, you can replace them with the H J K L keys. Some screen readers may require using #{modifierKey} in conjunction with the alt key',
            { modifierKey }
          )}
        </A11yScreenReaderOnly>

        {React.cloneElement(children, { onPhraseFocus: this.updateSelection })}
        <TranscriptAnnouncer announcementText={announcementText} />
      </div>
    );
  }
}

export default TranscriptHighlighter;
