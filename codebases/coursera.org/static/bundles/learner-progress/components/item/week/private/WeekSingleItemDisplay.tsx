import React from 'react';
import classNames from 'classnames';

import { Box } from '@coursera/coursera-ui';
import LearnerAppClientNavigationLink from 'bundles/course-v2/components/navigation/LearnerAppClientNavigationLink';

import LockedTooltip from 'bundles/learner-progress/components/item/locking/LockedTooltip';

import WeekItemIcon from 'bundles/learner-progress/components/item/week/private/WeekItemIcon';
import WeekItemName from 'bundles/learner-progress/components/item/week/private/WeekItemName';
import WeekItemAnnotations from 'bundles/learner-progress/components/item/week/private/WeekItemAnnotations';

import { getIsLocked } from 'bundles/learner-progress/utils/Item';
import { Item } from 'bundles/learner-progress/types/Item';

import _t from 'i18n!nls/learner-progress';

import 'css!./__styles__/WeekSingleItemDisplay';

type Props = {
  computedItem: Item;
};

const WeekSingleItemDisplay = ({
  computedItem,
  computedItem: { isNextItemInCourse, isIncludedInGradedAssignmentGroup },
}: Props) => {
  const isNextItem = isNextItemInCourse && !isIncludedInGradedAssignmentGroup;

  return (
    <LearnerAppClientNavigationLink
      className="nostyle"
      trackingName="item_link"
      href={computedItem.resourcePath}
      data={{ itemId: computedItem.id, isNextItemInCourse }}
    >
      <Box
        alignItems="center"
        justifyContent="between"
        rootClassName={classNames('rc-WeekSingleItemDisplay', { highlighted: isNextItemInCourse })}
      >
        <Box justifyContent="start" alignItems="center">
          {getIsLocked(computedItem) && <LockedTooltip placement="top" computedItem={computedItem} />}

          <Box>
            <WeekItemIcon computedItem={computedItem} />
            <Box>
              <WeekItemName computedItem={computedItem} />
              <WeekItemAnnotations computedItem={computedItem} />
            </Box>
          </Box>
        </Box>
        {isNextItem && (
          <span aria-hidden="true" className="resume-button">
            {_t('Resume')}
          </span>
        )}
      </Box>
      {isNextItem && <span className="sr-only">{_t('. Click to resume')}</span>}
    </LearnerAppClientNavigationLink>
  );
};

export default WeekSingleItemDisplay;
