import React from 'react';

import { compose } from 'recompose';

import connectToRouter from 'js/lib/connectToRouter';

import { getWeekUrl } from 'bundles/course-v2/utils/Course';

import NavigationDrawerLink from 'bundles/course-v2/components/navigation/cds/NavigationDrawerLink';
import withCustomLabelsByUserAndCourse from 'bundles/custom-labels/hoc/withCustomLabelsByUserAndCourse';

import _t from 'i18n!nls/course-v2';

import { NavigationWeek } from 'bundles/course-v2/types/CourseNavigation';
import { ReplaceCustomContent } from 'bundles/custom-labels/types/CustomLabels';

type InputProps = {
  weekNumber: number;
  week: NavigationWeek;
  courseId: string;
};

type Props = InputProps & {
  courseSlug: string;
  selectedWeekNumber: number;
  replaceCustomContent: ReplaceCustomContent;
};

const WeekNavigationItem = (props: Props) => {
  const { replaceCustomContent, courseSlug, weekNumber, selectedWeekNumber } = props;

  const url = getWeekUrl(courseSlug, weekNumber);
  const selected = selectedWeekNumber === weekNumber;
  const title = replaceCustomContent(_t('#{capitalizedWeekWithNumber}'), { weekNumber, returnsString: true });
  const ariaLabel = selected
    ? replaceCustomContent(_t('#{capitalizedWeekWithNumber}. You currently have this selected.'), {
        weekNumber,
        returnsString: true,
      })
    : title;

  return (
    <NavigationDrawerLink
      trackingName="nav_week"
      className="rc-WeekNavigationItem"
      url={url}
      title={title}
      selected={selected}
      ariaLabel={ariaLabel}
    />
  );
};

export default compose<Props, InputProps>(
  connectToRouter((router) => ({
    courseSlug: router.params.courseSlug,
    selectedWeekNumber: parseInt(router.params.week, 10),
  })),
  withCustomLabelsByUserAndCourse
)(WeekNavigationItem);
