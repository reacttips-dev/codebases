import React from 'react';

import { compose } from 'recompose';
import withSessionsV2EnrollmentEnabled from 'bundles/course-sessions/utils/withSessionsV2EnrollmentEnabled';

import { getFormattedLockMessage } from 'bundles/learner-progress/utils/Item';
import { Item } from 'bundles/learner-progress/types/Item';
import withSessionLabel, { SessionLabel } from 'bundles/course-sessions/utils/withSessionLabel';
import mapProps from 'js/lib/mapProps';

type InputProps = {
  computedItem: Item;
  scheduleSuggestionsAvailable?: boolean;
};

type Props = InputProps & {
  sessionLabel: SessionLabel;
  sessionsV2EnrollmentEnabled: boolean;
};

class LockMessage extends React.Component<Props> {
  render() {
    const { sessionLabel, scheduleSuggestionsAvailable, computedItem: item, sessionsV2EnrollmentEnabled } = this.props;

    if (!item.itemLockedStatus) {
      return null;
    }

    return (
      <div className="rc-LockMessage" aria-live="polite">
        <h2>
          {getFormattedLockMessage({
            scheduleSuggestionsAvailable,
            sessionLabel,
            sessionsV2Enabled: sessionsV2EnrollmentEnabled,
            itemLockedStatus: item.itemLockedStatus,
            itemLockedReasonCode: item.itemLockedReasonCode,
            itemLockSummary: item.itemLockSummary,
          })}
        </h2>
      </div>
    );
  }
}

export default compose<Props, InputProps>(
  withSessionsV2EnrollmentEnabled(({ computedItem }) => computedItem.courseId),
  mapProps(({ computedItem: { courseId } }: Props) => ({
    courseId,
  })),
  withSessionLabel
)(LockMessage);
