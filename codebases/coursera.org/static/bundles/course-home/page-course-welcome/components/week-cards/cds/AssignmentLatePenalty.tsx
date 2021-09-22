import React from 'react';

import { ComputedOutcome, GradingLatePenalty as GradingLatePenaltyType } from 'bundles/course-v2/types/Item';
import LatePenaltyIcon from 'bundles/learner-progress/components/item/LatePenaltyIcon';

type Props = {
  computedOutcome?: ComputedOutcome;
  gradingLatePenalty?: GradingLatePenaltyType;
};

const AssignmentLatePenalty = (props: Props) => {
  const { gradingLatePenalty, computedOutcome } = props;

  if (!gradingLatePenalty) {
    return null;
  }

  if (!computedOutcome) {
    // item has a late penalty but no grade yet, show the penalty policy
    return <LatePenaltyIcon gradingLatePenalty={gradingLatePenalty} />;
  }

  if (computedOutcome && computedOutcome.latePenaltyRatio) {
    // item has a grade and late penalty applied
    return (
      <LatePenaltyIcon
        tooltipLabel={`Penalty of ${computedOutcome.latePenaltyRatio.definition.ratio * 100}% applied`}
      />
    );
  }

  // no penalty applied, don't render tooltip
  return null;
};

export default AssignmentLatePenalty;
