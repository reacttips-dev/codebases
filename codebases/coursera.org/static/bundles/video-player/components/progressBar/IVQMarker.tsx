import React from 'react';
import { InVideoQuestion } from 'bundles/video-player/types';

import ProgressBarMarker from 'bundles/video-player/components/progressBar/ProgressBarMarker';

// NOTE: This should only be added as a child of <VideoProgressBar>
// There is a separate file mainly for organization purposes -
// separating files helps keep the logic in each more focused.

type Props = {
  question: InVideoQuestion;
  videoDuration: number;
};

// note video duration is in seconds, unlike the question timestamp
const IVQMarker = ({ question, videoDuration }: Props) => {
  const ivqTime = question.video.cuePointMs;
  const ivqOffsetFractionFromVideoStart = ivqTime / 1000 / videoDuration;
  return <ProgressBarMarker offsetFraction={ivqOffsetFractionFromVideoStart} />;
};

export default IVQMarker;
