import React from 'react';
import classNames from 'classnames';
import a11yKeyPress from 'js/lib/a11yKeyPress';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import Highlighter from 'react-highlight-words';

import {
  getHighlightedTextIndicesForCue,
  getTextNodesFromPhrase,
} from 'bundles/interactive-transcript/utils/TranscriptHighlighterUtils';

import type Cue from 'bundles/interactive-transcript/models/Cue';
import type { Highlight } from 'bundles/video-highlighting/types';

import _t from 'i18n!nls/interactive-transcript';

import 'css!./__styles__/Phrase';

type Props = {
  cue: Cue;
  isActive: boolean;
  isTargeted: boolean;
  onClick: (cue: Cue, isKeyPress?: boolean) => void;
  onFocus?: () => void;
  highlights: Array<Highlight>;
};

class Phrase extends React.Component<Props> {
  phrase: HTMLElement | null;

  setPhraseRef: (el: HTMLElement | null) => void;

  constructor(props: Props) {
    super(props);

    this.phrase = null;

    this.setPhraseRef = (el: HTMLElement | null) => {
      this.phrase = el;
    };
  }

  handleClick = (isKeyPress = false) => (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();

    const { cue, onClick } = this.props;

    if (this.phrase) {
      this.phrase.setAttribute('tabIndex', '0');
    }

    const selection = window.getSelection();
    if (!selection || !selection.toString()) {
      if (this.phrase) {
        this.phrase.focus();
      }
    }

    if (onClick) {
      onClick(cue, isKeyPress);
    }
  };

  handleFocus = () => {
    const { onFocus } = this.props;
    window.setTimeout(() => {
      const selection = window.getSelection();
      if (this.phrase && selection) {
        const range = this.getTextRangeForPhrase();
        if (range) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
        if (onFocus) {
          onFocus();
        }
      }
    }, 0);
  };

  handleMouseDown = () => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      selection.empty();
    }

    if (this.phrase) {
      this.phrase.removeAttribute('tabIndex');
    }
  };

  getTextRangeForPhrase = () => {
    if (!this.phrase) return null;

    const textNodes = getTextNodesFromPhrase(this.phrase);
    const firstNode = textNodes[0];
    const lastNode = textNodes[textNodes.length - 1];
    const range = document.createRange();
    range.setStart(firstNode, 0);
    range.setEnd(lastNode, lastNode.length - 1);
    return range;
  };

  render() {
    const { cue, highlights, isActive: active, isTargeted } = this.props;

    const includesHighlights = highlights.length !== 0;
    const highlighted = includesHighlights && !isTargeted;
    const targeted = includesHighlights && isTargeted;

    const classes = classNames('rc-Phrase', { active, targeted, highlighted });
    const highlightedTextIndices = highlights.map((highlight) => getHighlightedTextIndicesForCue(cue, highlight));

    return (
      <div
        tabIndex={0}
        role="button"
        data-cue={cue.id}
        className={classes}
        ref={this.setPhraseRef}
        data-cue-index={cue.index}
        onClick={this.handleClick(false)}
        onMouseDown={this.handleMouseDown}
        onKeyPress={(event) => a11yKeyPress(event, this.handleClick(true))}
        onFocus={this.handleFocus}
        aria-label={
          active
            ? _t('toggle video from current lecture segment: #{cueText}', { cueText: cue.text })
            : _t('toggle video from #{cueText}', { cueText: cue.text })
        }
      >
        {includesHighlights && (
          <Highlighter
            autoEscape
            searchWords={[]}
            highlightClassName="highlight"
            textToHighlight={`${cue.text} `}
            findChunks={() => highlightedTextIndices}
            aria-hidden={true}
          />
        )}

        {!includesHighlights && <span aria-hidden={true}>{`${cue.text} `}</span>}
      </div>
    );
  }
}

export default Phrase;
