import React from 'react';
import { Box } from '@coursera/coursera-ui';

import {
  getFormattedTRCAvailabilityWindowMessage,
  getIsGradable,
  getIsLockedByTimedRelease,
} from 'bundles/learner-progress/utils/Item';

import EffortText from 'bundles/learner-progress/components/item/EffortText';
import WeekItemDeadlinePill from 'bundles/learner-progress/components/item/week/private/WeekItemDeadlinePill';
import LatePenaltyIcon from 'bundles/learner-progress/components/item/LatePenaltyIcon';

import { Item } from 'bundles/learner-progress/types/Item';

import _t from 'i18n!nls/learner-progress';
import { FormattedMessage } from 'js/lib/coursera.react-intl';

type Props = {
  computedItem: Item;
};

const WeekItemAnnotations = ({ computedItem }: Props) => {
  const shouldDisplayDeadline =
    getIsGradable(computedItem) &&
    !getIsLockedByTimedRelease(computedItem) &&
    !!computedItem.deadline &&
    !computedItem.isSubmitted;

  const shouldDisplayLatePenaltyIcon = !computedItem.isSubmitted && !!computedItem.gradingLatePenalty;

  return (
    <Box alignItems="center" rootClassName="rc-WeekItemAnnotations">
      <EffortText computedItem={computedItem} />

      {shouldDisplayDeadline && <WeekItemDeadlinePill computedItem={computedItem} />}

      {getIsLockedByTimedRelease(computedItem) && (
        <span className="availability-text">
          <FormattedMessage
            message={_t('Available {availabilityWindow}')}
            availabilityWindow={getFormattedTRCAvailabilityWindowMessage(
              computedItem.itemLockedStatus,
              computedItem.itemLockedReasonCode,
              computedItem.itemLockSummary
            )}
          />
        </span>
      )}

      {shouldDisplayLatePenaltyIcon && <LatePenaltyIcon gradingLatePenalty={computedItem.gradingLatePenalty} />}
    </Box>
  );
};

export default WeekItemAnnotations;
