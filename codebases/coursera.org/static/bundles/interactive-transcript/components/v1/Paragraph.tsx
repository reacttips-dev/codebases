import React from 'react';
import { Box } from '@coursera/coursera-ui';

import _t from 'i18n!nls/interactive-transcript';

import Phrase from 'bundles/interactive-transcript/components/v1/Phrase';

import { formatTime, getTimeFromDuration } from 'bundles/interactive-transcript/utils/TranscriptUtils';

import {
  getHighlightsForCue,
  getIsCueIncludedInHighlight,
} from 'bundles/interactive-transcript/utils/TranscriptHighlighterUtils';

import type Cue from 'bundles/interactive-transcript/models/Cue';
import type { Highlight } from 'bundles/video-highlighting/types';

import 'css!./__styles__/Paragraph';
import { FormattedMessage } from 'react-intl';

type Props = {
  cues: Array<Cue>;
  onCueClick: (cue: Cue) => void;
  onPhraseFocus?: () => void;
  activeCues: Array<Cue>;
  highlights: Array<Highlight>;
  targetedHighlight?: Highlight | null;
  hideTime?: boolean;
  renderPlainText?: boolean;
};

class Paragraph extends React.Component<Props> {
  handleTimestampClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const { cues, onCueClick } = this.props;
    const firstCue = cues[0];

    onCueClick(firstCue);
  };

  render() {
    const {
      cues,
      onCueClick,
      onPhraseFocus,
      activeCues,
      targetedHighlight,
      highlights,
      hideTime,
      renderPlainText,
    } = this.props;
    const firstCue = cues[0];

    return (
      <div className="rc-Paragraph">
        <Box justifyContent="start">
          {!hideTime && (
            <button
              type="button"
              className="timestamp"
              onClick={this.handleTimestampClick}
              aria-labelledby={`button-label-${firstCue.id}`}
            >
              <span id={`button-label-${firstCue.id}`} className="sr-only">
                <FormattedMessage
                  message={_t(`Play video starting at {hours}:{minutes}:{seconds} and follow transcript`)}
                  {...getTimeFromDuration(firstCue.startTime)}
                />
              </span>
              {formatTime(firstCue.startTime)}
            </button>
          )}

          <div className="phrases">
            {cues.map((cue) => {
              const isActive = activeCues && activeCues.find((activeCue) => cue.id === activeCue.id);
              const cueHighlights = getHighlightsForCue(cue, highlights);
              const isTargeted = !!(targetedHighlight && getIsCueIncludedInHighlight(cue, targetedHighlight));

              if (!renderPlainText) {
                return (
                  <Phrase
                    cue={cue}
                    key={cue.id}
                    onClick={onCueClick}
                    onFocus={onPhraseFocus}
                    isActive={!!isActive}
                    isTargeted={isTargeted}
                    highlights={cueHighlights}
                  />
                );
              } else {
                return (
                  <div className="rc-Phrase">
                    <span>{cue.text}</span>
                  </div>
                );
              }
            })}
          </div>
        </Box>
      </div>
    );
  }
}

export default Paragraph;
