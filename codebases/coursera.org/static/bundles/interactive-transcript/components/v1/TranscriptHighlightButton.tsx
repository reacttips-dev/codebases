import React from 'react';
import { Button } from '@coursera/coursera-ui';

import withSingleTracked from 'bundles/common/components/withSingleTracked';

import { findCueElementWithIndex } from 'bundles/interactive-transcript/utils/TranscriptHighlighterUtils';

import 'css!./__styles__/TranscriptHighlightButton';

const TrackedButton = withSingleTracked({ type: 'BUTTON' })(Button);

type Props = {
  label: string;
  cueIndex: number;
  trackingName: string;
  onClick: () => void;
};

const TranscriptHighlightButton = ({ cueIndex, label, trackingName, onClick }: Props) => {
  const cueElement = findCueElementWithIndex(cueIndex);
  const cueOffsetTop = cueElement?.offsetTop;

  return (
    <div className="rc-TranscriptHighlightButton" style={{ top: cueOffsetTop }}>
      <TrackedButton
        size="sm"
        label={label}
        type="primary"
        onClick={onClick}
        trackingName={trackingName}
        style={{ fontWeight: 'bold' }}
        // @ts-expect-error TODO: Property `tabIndex` does not exist on CUI `Button`. Move it to `htmlAttributes`
        tabIndex={-1}
      >
        <div className="transcript-highlight-btn-arrow-down" />
      </TrackedButton>
    </div>
  );
};

export default TranscriptHighlightButton;
