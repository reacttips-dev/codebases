import React from 'react';
import type { Item } from 'bundles/course-v2/types/Item';
import { compose } from 'recompose';
import classNames from 'classnames';
import { formatDateTimeDisplay, SHORT_MONTH_DAY_DISPLAY } from 'js/utils/DateTimeUtils';

import HoverableOverlayTrigger from 'bundles/course/components/HoverableOverlayTrigger';
import { getFormattedLockMessage } from 'bundles/learner-progress/utils/Item';

import toHumanReadableTypeName from 'bundles/ondemand/utils/toHumanReadableTypeName';
import getItemStatusDisplayText from 'bundles/ondemand/utils/progress/utils/getItemStatusDisplayText';
import withSessionsV2EnrollmentEnabled from 'bundles/course-sessions/utils/withSessionsV2EnrollmentEnabled';

import AssignmentProgressIcon from 'bundles/course-home/page-course-welcome/components/AssignmentProgressIcon';
import type { SessionLabel } from 'bundles/course-sessions/utils/withSessionLabel';
import withSessionLabel from 'bundles/course-sessions/utils/withSessionLabel';

import _t from 'i18n!nls/course-home';

import 'css!./__styles__/TooltipAssignmentProgressIcon';

type InputProps = {
  item: Item;
  courseId: string;
  moduleName: string;
};

type Props = InputProps & {
  sessionsV2EnrollmentEnabled: boolean;
  sessionLabel: SessionLabel;
};

class TooltipAssignmentProgressIcon extends React.Component<Props> {
  renderTooltip = (itemStatusText: string, titlePrefix: string, deadlineDate: string) => {
    const { item, sessionsV2EnrollmentEnabled, sessionLabel } = this.props;
    const { name, itemDeadlineStatus } = item;

    const progressIndicatorClasses = classNames('progress-indicator', itemDeadlineStatus.toLowerCase());
    const isLockedSessionEnded =
      item.isLocked &&
      item.itemLockSummary?.lockState?.reasonCode === 'SESSION_ENDED' &&
      item.itemLockSummary?.lockState?.lockStatus;

    return (
      <div className="horizontal-box assignment-tooltip-content">
        {item.itemLockSummary && isLockedSessionEnded ? (
          getFormattedLockMessage({
            sessionsV2Enabled: sessionsV2EnrollmentEnabled,
            sessionLabel,
            itemLockedStatus: item.itemLockSummary.lockState.lockStatus,
            itemLockedReasonCode: item.itemLockSummary.lockState.reasonCode,
          })
        ) : (
          <div>
            {itemStatusText && <div className={progressIndicatorClasses} />}

            <div className="flex-1 vertical-box">
              <p className="body-2-text">{itemStatusText}</p>

              <div className="horizontal-box">
                <p className="flex-1 body-2-text item-type">{titlePrefix}</p>

                {deadlineDate && <p className="item-deadline">{deadlineDate}</p>}
              </div>

              <p>{name}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  render() {
    const { item } = this.props;
    const tooltipId = `assignment-progression-tooltip-${item.id}`;
    const tooltipDescriptionId = `tooltip-description-${item.id}`;
    const { name, deadline, contentSummary, trackId, itemDeadlineStatus } = item;

    const itemStatusText = getItemStatusDisplayText(itemDeadlineStatus);
    const titlePrefix = toHumanReadableTypeName(contentSummary.typeName, trackId, contentSummary);
    // @ts-expect-error TODO: deadline can't be undefined
    const deadlineDate = formatDateTimeDisplay(deadline, SHORT_MONTH_DAY_DISPLAY);

    const tooltip = this.renderTooltip(itemStatusText, titlePrefix, deadlineDate);

    /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
    return (
      <li className="rc-TooltipAssignmentProgressIcon">
        <HoverableOverlayTrigger overlay={tooltip} tooltipId={tooltipId} placement="top">
          {/* OverlayTrigger won't work if it's directly wrapping a span, thus the wrapper div below. */}
          <div className="icon-wrapper" role="tooltip" tabIndex={0} aria-describedby={tooltipDescriptionId}>
            <div className="screenreader-only" id={tooltipDescriptionId}>
              {_t('#{itemStatusText} #{titlePrefix}, #{name}, #{deadlineDate}', {
                itemStatusText,
                titlePrefix,
                name,
                deadlineDate,
              })}
            </div>
            <AssignmentProgressIcon item={item} suppressTitle={true} />
          </div>
        </HoverableOverlayTrigger>
      </li>
    );
  }
}

export default compose<Props, InputProps>(
  withSessionsV2EnrollmentEnabled(({ courseId }) => courseId),
  withSessionLabel
)(TooltipAssignmentProgressIcon);
