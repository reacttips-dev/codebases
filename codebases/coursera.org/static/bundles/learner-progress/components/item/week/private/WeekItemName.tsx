import React from 'react';
import A11yScreenReaderOnly from 'bundles/a11y/components/A11yScreenReaderOnly';

import { getFormattedTitlePrefix, getFormattedTitlePrefixForA11y } from 'bundles/learner-progress/utils/Item';
import { Item } from 'bundles/learner-progress/types/Item';
import { compose } from 'recompose';
import withComputedCourseProgress from 'bundles/learner-progress/utils/withComputedCourseProgress';
import { CourseProgress } from 'bundles/learner-progress/types/Course';

type PropsFromCaller = {
  computedItem: Item;
};

type PropsFromWithComputedCourseProgress = {
  computedCourseProgress: CourseProgress;
};

type PropsToComponent = PropsFromCaller & PropsFromWithComputedCourseProgress;

const WeekItemName = ({ computedItem, computedCourseProgress }: PropsToComponent) => {
  const { isGuidedProject } = computedCourseProgress;
  const formattedTitlePrefix = getFormattedTitlePrefix(computedItem, isGuidedProject);
  const formattedTitlePrefixForA11y = getFormattedTitlePrefixForA11y(computedItem, isGuidedProject);

  return (
    <div className="rc-WeekItemName headline-1-text">
      {!!formattedTitlePrefix && <strong>{`${formattedTitlePrefix}: `}</strong>}

      {!!formattedTitlePrefixForA11y && (
        <A11yScreenReaderOnly tagName="span">{formattedTitlePrefixForA11y}</A11yScreenReaderOnly>
      )}

      {computedItem.name}
    </div>
  );
};

export default compose<PropsToComponent, PropsFromCaller>(withComputedCourseProgress())(WeekItemName);
