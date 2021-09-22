import React from 'react';
import _ from 'underscore';
import Naptime from 'bundles/naptimejs';
import user from 'js/lib/user';
import type { Theme } from '@coursera/cds-core';
import { useTheme } from '@coursera/cds-core';

import waitFor from 'js/lib/waitFor';
import mapProps from 'js/lib/mapProps';
import connectToRouter from 'js/lib/connectToRouter';

import type { Week } from 'bundles/course-v2/types/Week';

import WeekCard from 'bundles/course-home/page-course-welcome/components/week-cards/cds/WeekCard';

import GuidedCourseWeekCardsV1 from 'bundles/naptimejs/resources/guidedCourseWeekCards.v1';

type Props = {
  naptime: $TSFixMe;
  weeks: Array<Week>;
  courseId: string;
  theme: Theme;
};

class CourseWeekCards extends React.Component<Props> {
  componentDidMount() {
    const { naptime } = this.props;
    naptime.refreshData({ resources: ['guidedCourseWeekCards.v1'] });
  }

  render() {
    const { courseId, weeks, theme } = this.props;

    return (
      <ul className="rc-CourseWeekCards nostyle" data-elementtiming="ondemand.course-week-cards">
        {weeks.map((week, index) => (
          // WeekCard does not have a unique id, and the list cannot be modified through UI by learners
          // so using index as key is generally safe
          // eslint-disable-next-line react/no-array-index-key
          <li key={index + 1}>
            <WeekCard courseId={courseId} weekNumber={index + 1} week={week} theme={theme} />
          </li>
        ))}
      </ul>
    );
  }
}

const CourseWeekCardsWithTheme = (props: Props) => {
  const theme = useTheme();

  return <CourseWeekCards {...props} theme={theme} />;
};

export default _.compose(
  connectToRouter((router) => ({
    courseSlug: router.params.courseSlug,
  })),
  Naptime.createContainer(({ courseSlug }: $TSFixMe) => ({
    guidedCourseWeekCards: GuidedCourseWeekCardsV1.multiGet([`${user.get().id}~${courseSlug}`], {
      fields: ['id', 'courseId', 'weeks'],
    }),
  })),
  waitFor(({ guidedCourseWeekCards }) => guidedCourseWeekCards.length !== 0),
  mapProps<{ weeks: Array<Week> }, { guidedCourseWeekCards: Array<{ weeks: Array<Week> }> }>(
    ({ guidedCourseWeekCards }) => ({
      ...guidedCourseWeekCards[0],
    })
  )
)(CourseWeekCardsWithTheme);
