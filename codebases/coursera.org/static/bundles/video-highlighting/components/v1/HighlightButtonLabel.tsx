import React from 'react';

import { getTimeFromDuration } from 'bundles/interactive-transcript/utils/TranscriptUtils';

import type { Highlight } from 'bundles/video-highlighting/types';

import _t from 'i18n!nls/video-highlighting';
import { FormattedMessage } from 'react-intl';

type Props = {
  id: string;
  startText: string;
  highlight: Highlight;
};

const HighlightButtonLabel = ({ startText, highlight, id }: Props) => {
  const { noteStartTs, noteEndTs, captureTs } = highlight;
  let label;

  if (noteStartTs && noteEndTs) {
    const from = getTimeFromDuration(noteStartTs);
    const to = getTimeFromDuration(noteEndTs);

    label = (
      <FormattedMessage
        message={_t(
          `{startText} from {fromHr} hours {fromMin} minutes {fromSec} seconds until {toHr} hours {toMin} minutes {toSec} seconds`
        )}
        {...{ fromSec: from.seconds || '0', fromMin: from.minutes || '0', fromHr: from.hours || '0' }}
        {...{ toSec: to.seconds || '0', toMin: to.minutes || '0', toHr: to.hours || '0' }}
        startText={startText}
      />
    );
  } else {
    const duration = getTimeFromDuration(captureTs);
    label = (
      <FormattedMessage
        message={_t(`{startText} for {hours} hours {minutes} minutes {seconds} seconds`)}
        hours={duration.hours || '0'}
        minutes={duration.minutes || '0'}
        seconds={duration.seconds || '0'}
        startText={startText}
      />
    );
  }

  return (
    <span id={id} className="sr-only">
      {label}
    </span>
  );
};

export default HighlightButtonLabel;
