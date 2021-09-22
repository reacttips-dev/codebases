import React from 'react';

import { getDescription } from 'bundles/course-v2/utils/NavigationItem';
import { WeeksNavigationItem } from 'bundles/course-v2/types/CourseNavigation';
import { ReplaceCustomContent } from 'bundles/custom-labels/types/CustomLabels';

import NavigationLink from 'bundles/course-v2/components/navigation/NavigationLink';
import NavigationDrawer from 'bundles/course-v2/components/navigation/NavigationDrawer';
import WeekNavigationItem from 'bundles/course-v2/components/navigation/WeekNavigationItem';
import withCustomLabelsByUserAndCourse from 'bundles/custom-labels/hoc/withCustomLabelsByUserAndCourse';

type InputProps = {
  router: any;
  courseId: string;
  courseSlug: string;
  navigationItem: WeeksNavigationItem;
};

type Props = InputProps & {
  replaceCustomContent: ReplaceCustomContent;
};

const WeekCollectionNavigationItem = (props: Props) => {
  const { courseId, navigationItem, courseSlug, router, replaceCustomContent } = props;
  const {
    definition: { weeks, currentWeekNumber },
  } = navigationItem;
  const { title, url, selected } = getDescription(navigationItem, courseSlug, router, replaceCustomContent);

  return (
    <div className="rc-WeekCollectionNavigationItem">
      <NavigationLink title={title} url={url} selected={selected} ariaExpanded={selected ? 'true' : 'false'} />

      {selected && (
        <NavigationDrawer>
          {weeks.map((week, i) => (
            <WeekNavigationItem
              week={week}
              courseId={courseId}
              key={`week${i}`}
              weekNumber={i + 1}
              // @ts-expect-error TSMIGRATION
              isCurrentWeek={i + 1 === currentWeekNumber}
            />
          ))}
        </NavigationDrawer>
      )}
    </div>
  );
};

export default withCustomLabelsByUserAndCourse<InputProps>(WeekCollectionNavigationItem);
