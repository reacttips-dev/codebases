import React from 'react';
import { Tooltip } from 'react-bootstrap-33';
import { compose } from 'recompose';
import { Item } from 'bundles/learner-progress/types/Item';
import { getFormattedLockMessage } from 'bundles/learner-progress/utils/Item';

import withSessionsV2EnrollmentEnabled from 'bundles/course-sessions/utils/withSessionsV2EnrollmentEnabled';
import withSessionLabel, { SessionLabel } from 'bundles/course-sessions/utils/withSessionLabel';
import mapProps from 'js/lib/mapProps';

type InputProps = {
  computedItem: Item;
  placement: 'right' | 'top' | 'left' | 'bottom';
};

type Props = InputProps & {
  sessionsV2EnrollmentEnabled: boolean;
  sessionLabel: SessionLabel;
};

class LockedTooltip extends React.Component<Props> {
  static defaultProps: Partial<InputProps> = {
    placement: 'right',
  };

  render() {
    const { sessionLabel, computedItem: item, placement, sessionsV2EnrollmentEnabled } = this.props;

    if (!item.itemLockedStatus) {
      return null;
    }

    return (
      <Tooltip className="locked-tooltip" placement={placement}>
        {getFormattedLockMessage({
          sessionsV2Enabled: sessionsV2EnrollmentEnabled,
          sessionLabel,
          itemLockedStatus: item.itemLockedStatus,
          itemLockedReasonCode: item.itemLockedReasonCode,
          itemLockSummary: item.itemLockSummary,
        })}
      </Tooltip>
    );
  }
}

export default compose<Props, InputProps>(
  withSessionsV2EnrollmentEnabled(({ computedItem }) => computedItem?.courseId),
  mapProps(({ computedItem: { courseId } }: Props) => ({
    courseId,
  })),
  withSessionLabel
)(LockedTooltip);
