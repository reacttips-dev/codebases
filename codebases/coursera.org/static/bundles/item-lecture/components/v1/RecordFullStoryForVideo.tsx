import React from 'react';

import epic from 'bundles/epic/client';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import fullStory from 'js/lib/fullStoryUtils';

import type { Item } from 'bundles/learner-progress/types/Item';

type Props = {
  courseSlug: string;
  computedItem: Item;
  autoplay: boolean;
  children: any | any[]; // see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/27805
  isVideoHighlightingEnabled?: boolean;
};

class RecordFullStoryForVideo extends React.Component<Props> {
  static defaultProps = {
    isVideoHighlightingEnabled: false,
  };

  componentDidMount() {
    const { courseSlug, computedItem, autoplay, isVideoHighlightingEnabled } = this.props;
    const { timeCommitment, id: itemId, contentSummary, weekNumber } = computedItem;

    // @ts-expect-error TSMIGRATION
    const includesInVideoAssessment = !!contentSummary.definition.hasInVideoAssessment;

    if (this.isExperimentEnabled()) {
      fullStory.init();

      fullStory.set({
        courseSlug,
        itemId,
        weekNumber,
        autoplay,
        timeCommitment,
        includesInVideoAssessment,
        isVideoHighlightingEnabled,
      });
    }
  }

  componentWillUnmount() {
    if (this.isExperimentEnabled()) {
      fullStory.endSession();
    }
  }

  isExperimentEnabled() {
    const { isVideoHighlightingEnabled } = this.props;

    if (isVideoHighlightingEnabled) {
      return epic.get('FullStory', 'enableVideoHighlightsFullStory');
    }

    return epic.get('FullStory', 'enableVideoLectureFullStory');
  }

  render() {
    const { children } = this.props;
    return children;
  }
}

export default RecordFullStoryForVideo;
