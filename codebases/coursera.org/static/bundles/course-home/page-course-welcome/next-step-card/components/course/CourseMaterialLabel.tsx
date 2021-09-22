import React from 'react';

import _t from 'i18n!nls/course-home';
import toHumanReadableTypeName from 'bundles/ondemand/utils/toHumanReadableTypeName';

import { humanizeLearningTime } from 'js/utils/DateTimeUtils';
import { Item } from 'bundles/course-v2/types/Item';

import withCustomLabelsByUserAndCourse from 'bundles/custom-labels/hoc/withCustomLabelsByUserAndCourse';
import { ReplaceCustomContent as ReplaceCustomContentType } from 'bundles/custom-labels/types/CustomLabels';
import { compose } from 'recompose';

type InputProps = {
  courseId: string; // required to use the HOC
  week: number;
  item: Item;
  duration: number;
};

type Props = InputProps & {
  replaceCustomContent: ReplaceCustomContentType;
};

const CourseMaterialLabel: React.SFC<Props> = (props) => {
  const { week, item, duration, replaceCustomContent } = props;

  return (
    <div className="title label-text">
      {replaceCustomContent(_t('{capitalizedWeekWithNumber} | {format} · {duration}'), {
        weekNumber: week,
        additionalVariables: {
          format: toHumanReadableTypeName(item.contentSummary.typeName),
          duration: humanizeLearningTime(duration),
        },
      })}
    </div>
  );
};

export default compose<Props, InputProps>(withCustomLabelsByUserAndCourse)(CourseMaterialLabel);
