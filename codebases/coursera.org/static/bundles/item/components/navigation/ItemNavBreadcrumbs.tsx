import React from 'react';

import logger from 'js/app/loggerSingleton';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';

import withComputedItem from 'bundles/learner-progress/utils/withComputedItem';
import withComputedCourseProgress from 'bundles/learner-progress/utils/withComputedCourseProgress';
import withCustomLabelsByUserAndCourse from 'bundles/custom-labels/hoc/withCustomLabelsByUserAndCourse';

import { compose, mapProps } from 'recompose';

import { getCourseRootPath, getHomeUrl, getWeekUrl } from 'bundles/ondemand/utils/url';
import Breadcrumbs from 'bundles/item/components/navigation/Breadcrumbs';

import { Item } from 'bundles/learner-progress/types/Item';
import { CourseProgress } from 'bundles/learner-progress/types/Course';
import { ReplaceCustomContent } from 'bundles/custom-labels/types/CustomLabels';

import _t from 'i18n!nls/item';

import 'css!./__styles__/ItemNavBreadcrumbs';

type InputProps = {
  courseSlug: string;
  itemId: string;
  weekNumber: number;
  ariaLabel?: string;
};

type Props = InputProps & {
  computedItem: Item;
  computedCourseProgress: CourseProgress;
  replaceCustomContent: ReplaceCustomContent;
};

const ItemNavBreadcrumbs: React.SFC<Props> = ({
  computedItem,
  computedCourseProgress,
  ariaLabel,
  replaceCustomContent,
}) => {
  if (!computedItem || !computedCourseProgress) {
    logger.error('<ItemNavBreadcrumbs> Item or course not defined.');
    return null;
  }
  const { weekNumber, name: itemName } = computedItem;
  const { courseName, courseSlug } = computedCourseProgress;
  if (!weekNumber || !itemName || !courseName || !courseSlug) {
    logger.error('<ItemNavBreadcrumbs> Critical fields (item name, week, coure) not defined.');
    return null;
  }

  const courseRootPath = getCourseRootPath(courseSlug);
  const navItems = [
    {
      title: courseName,
      trackingName: 'item_nav_course_name',
      location: getHomeUrl(courseRootPath),
    },
    {
      title: replaceCustomContent(_t('{capitalizedWeekWithNumber}'), { weekNumber }),
      trackingName: 'item_nav_week_number',
      location: getWeekUrl(courseRootPath, weekNumber),
    },
    {
      title: itemName,
    },
  ];

  return (
    <div className="rc-ItemNavBreadcrumbs">
      <Breadcrumbs navItems={navItems} ariaLabel={ariaLabel} />
    </div>
  );
};

export default compose<Props, InputProps>(
  connectToStores(['CourseStore'], ({ CourseStore }, { itemId }: InputProps) => ({
    itemMetadata: CourseStore.getMaterials().getItemMetadata(itemId),
  })),
  withComputedItem,
  withComputedCourseProgress,
  mapProps<InputProps, Props>(({ computedItem, computedItem: { courseId }, ...rest }) => ({
    ...rest,
    computedItem,
    courseId,
  })),
  withCustomLabelsByUserAndCourse
)(ItemNavBreadcrumbs);
