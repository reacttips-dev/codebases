import React from 'react';
import _ from 'underscore';
import classNames from 'classnames';

import { Week } from 'bundles/course-v2/types/Week';

import { getGradableItemsWithoutHonorsAndOptionalsInModule } from 'bundles/course-v2/utils/Module';

import TooltipAssignmentProgressIcon from 'bundles/course-home/page-course-welcome/progress-bar/components/TooltipAssignmentProgressIcon';

import _t from 'i18n!nls/course-home';

import withCustomLabelsByUserAndCourse from 'bundles/custom-labels/hoc/withCustomLabelsByUserAndCourse';
import { ReplaceCustomContent as ReplaceCustomContentType } from 'bundles/custom-labels/types/CustomLabels';

import 'css!./__styles__/WeekAssignmentIcons';
import { compose } from 'recompose';

// The max number of items to display before the rest are collapsed by default.
const NUM_DISPLAY_ITEMS = 3;

type InputProps = {
  courseId: string; // required to use the HOC
  week: Week;
  weekNumber: number;
};

type Props = InputProps & {
  replaceCustomContent: ReplaceCustomContentType;
};

class WeekAssignmentIcons extends React.Component<Props> {
  render() {
    const { courseId, week, weekNumber, replaceCustomContent } = this.props;

    const itemDescriptors = _(week.modules)
      .chain()
      .map((module) =>
        getGradableItemsWithoutHonorsAndOptionalsInModule(module).map((item) => ({
          item,
          module,
        }))
      )
      .flatten()
      .value();

    const hiddenItemCount = itemDescriptors.length - NUM_DISPLAY_ITEMS;
    const previousWeekCompleted = week?.previousWeekStatus === 'COMPLETED' || !week?.previousWeekStatus;
    const weekCompleted = week?.weekStatus === 'COMPLETED' || !week?.weekStatus;

    return (
      <div
        className={classNames([
          'rc-WeekAssignmentIcons',
          {
            'prev-week-completed': previousWeekCompleted,
          },
          {
            'week-completed': weekCompleted,
          },
        ])}
      >
        <div className="vertical-box">
          {hiddenItemCount > 0 && <div className="num-hidden-assignments">+{hiddenItemCount}</div>}

          <div className="screenreader-only" id={`tooltipDescription-${weekNumber}`}>
            {_t('Week #{weekNumber}', { weekNumber })}
          </div>

          <ol className="nostyle vertical-box" aria-labelledby={`tooltipDescription-${weekNumber}`}>
            {itemDescriptors.slice(0, NUM_DISPLAY_ITEMS).map(({ item, module }) => (
              <TooltipAssignmentProgressIcon courseId={courseId} key={item.id} item={item} moduleName={module.name} />
            ))}
          </ol>

          <div className="label horizontal-box align-items-vertical-center">
            {replaceCustomContent(_t('{capitalizedWeekWithNumber}'), { weekNumber })}
          </div>
        </div>
      </div>
    );
  }
}

export default compose<Props, InputProps>(withCustomLabelsByUserAndCourse)(WeekAssignmentIcons);
