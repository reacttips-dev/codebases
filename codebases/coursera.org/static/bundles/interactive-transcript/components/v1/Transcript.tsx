import React from 'react';

import TrackedDiv from 'bundles/page/components/TrackedDiv';
import Paragraph from 'bundles/interactive-transcript/components/v1/Paragraph';

import type Cue from 'bundles/interactive-transcript/models/Cue';
import type { Highlight } from 'bundles/video-highlighting/types';

import 'css!./__styles__/Transcript';

type Props = {
  activeCues: Array<Cue>;
  onCueClick: (cue: Cue) => void;
  onPhraseFocus?: () => void;
  highlights: Array<Highlight>;
  paragraphs: Array<Array<Cue>>;
  targetedHighlight?: Highlight | null;
  hideTime?: boolean;
  renderPlainText?: boolean;
};

const Transcript = ({
  paragraphs,
  highlights,
  onCueClick,
  onPhraseFocus,
  activeCues,
  targetedHighlight,
  hideTime,
  renderPlainText,
}: Props) => (
  <TrackedDiv trackingName="interactive_transcript" trackMouseEnters trackMouseLeaves className="rc-Transcript">
    {paragraphs.map((cues) => (
      <Paragraph
        cues={cues}
        key={cues[0].startTime}
        onCueClick={onCueClick}
        onPhraseFocus={onPhraseFocus}
        activeCues={activeCues}
        highlights={highlights}
        targetedHighlight={targetedHighlight}
        hideTime={hideTime}
        renderPlainText={renderPlainText}
      />
    ))}
  </TrackedDiv>
);

export default Transcript;
