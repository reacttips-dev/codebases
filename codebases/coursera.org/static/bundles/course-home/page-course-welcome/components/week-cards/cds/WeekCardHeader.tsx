/** @jsx jsx */
import React from 'react';

import { Box, color, Pill } from '@coursera/coursera-ui';
import { Week } from 'bundles/course-v2/types/Week';
// eslint-disable-next-line
import { css, jsx } from '@emotion/react';
import { Typography, Theme } from '@coursera/cds-core';

import TrackedDiv from 'bundles/page/components/TrackedDiv';
import WeekStatusMarker from 'bundles/course-home/page-course-welcome/components/week-cards/WeekStatusMarker';
import EstimatedTime from 'bundles/course-home/page-course-welcome/components/week-cards/cds/EstimatedTime';
import HeaderProgressBar from 'bundles/course-home/page-course-welcome/components/week-cards/cds/HeaderProgressBar';

import { SvgChevronDown, SvgChevronUp } from '@coursera/coursera-ui/svg';

import withCustomLabelsByUserAndCourse from 'bundles/custom-labels/hoc/withCustomLabelsByUserAndCourse';

import { areCourseHomeTweaksEnabled } from 'bundles/course-home/page-course-welcome/utils/featureGates';
import { ReplaceCustomContent } from 'bundles/custom-labels/types/CustomLabels';

import { rtlStyle } from 'js/lib/language';
import _t from 'i18n!nls/course-home';

import 'css!./../__styles__/WeekCardHeader';

type InputProps = {
  weekNumber: number;
  week: Week;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  courseId: string;
  theme: Theme;
};

type Props = InputProps & {
  userId: string;
  replaceCustomContent: ReplaceCustomContent;
};

export class WeekCardHeader extends React.Component<Props> {
  render() {
    const {
      week: {
        weekStatus,
        weekTimeProgress: {
          totalItemsProgress: { totalDuration, remainingDuration },
        },
      },
      weekNumber,
      isCollapsed,
      replaceCustomContent,
      onToggleCollapse,
      theme,
    } = this.props;

    const isWeekComplete = weekStatus === 'COMPLETED';
    const isWeekOverdue = weekStatus === 'OVERDUE';
    const overdueMessageLabel = _t('Overdue');
    const headerProgressEnabled = areCourseHomeTweaksEnabled();

    return (
      <TrackedDiv
        className="rc-WeekCardHeader"
        onClick={onToggleCollapse}
        trackingName="week_card_toggle_collapse"
        aria-expanded={!isCollapsed}
        role="button"
      >
        <Box justifyContent="between" alignItems="center" flexDirection="row" rootClassName="content">
          <Box flexDirection="row" alignItems="center" justifyContent="start">
            <WeekStatusMarker status={weekStatus} />

            <Typography
              variant="h3semibold"
              css={css`
                margin: ${theme?.spacing(0, 16, 0, 0)};
              `}
            >
              {replaceCustomContent('{capitalizedWeekWithNumber}', { weekNumber })}
            </Typography>

            {isWeekOverdue && (
              <div className="flex-1">
                <Pill
                  type="outline"
                  label={overdueMessageLabel}
                  fillColor={color.white}
                  borderColor={color.warning}
                  style={{ fontWeight: 600, background: color.white }}
                />
              </div>
            )}
          </Box>

          <Box flexDirection="row" alignItems="center">
            {headerProgressEnabled ? (
              <HeaderProgressBar
                weekStatus={weekStatus}
                remainingDuration={remainingDuration}
                totalDuration={totalDuration}
                theme={theme}
              />
            ) : (
              !isWeekComplete && <EstimatedTime remainingDuration={remainingDuration} theme={theme} />
            )}

            {isCollapsed ? (
              <SvgChevronDown
                size={24}
                color={color.primaryText}
                style={rtlStyle({ marginLeft: '24px' })}
                suppressTitle={true}
              />
            ) : (
              <SvgChevronUp
                size={24}
                color={color.primaryText}
                style={rtlStyle({ marginLeft: '24px' })}
                suppressTitle={true}
              />
            )}
          </Box>
        </Box>
      </TrackedDiv>
    );
  }
}

export default withCustomLabelsByUserAndCourse<InputProps>(WeekCardHeader);
