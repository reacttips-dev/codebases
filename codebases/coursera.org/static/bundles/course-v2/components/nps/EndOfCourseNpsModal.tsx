import React from 'react';
import _ from 'underscore';

import NpsModal from 'bundles/course-v2/components/nps/NpsModal';

import Naptime from 'bundles/naptimejs';
import user from 'js/lib/user';
import mapProps from 'js/lib/mapProps';

import connectToRouter from 'js/lib/connectToRouter';

import CoursesV1 from 'bundles/naptimejs/resources/courses.v1';
import OnDemandCourseGradesV2 from 'bundles/naptimejs/resources/onDemandCourseGrades.v2';

type Props = {
  course: {
    id: string;
  };

  hasPassedCourse: boolean;
};

class EndOfCourseNpsModal extends React.Component<Props> {
  render() {
    const { course, hasPassedCourse } = this.props;

    if (!hasPassedCourse) {
      return null;
    }

    return (
      <NpsModal
        showFollowupQuestion
        courseId={course.id}
        feedbackSystem="NPS_END_OF_COURSE"
        followupSurveyLink="https://www.surveymonkey.com/r/FCPMXC2"
      />
    );
  }
}

export default _.compose(
  connectToRouter((router) => ({
    courseSlug: router.params.courseSlug,
  })),
  Naptime.createContainer(({ courseSlug }: any) => ({
    course: CoursesV1.bySlug(courseSlug, {
      fields: ['id'],
    }),
  })),
  Naptime.createContainer(({ course }: any) => ({
    grade: OnDemandCourseGradesV2.get(`${user.get().id}~${course.id}`, {
      fields: ['passingState'],
    }),
  })),
  mapProps<{ hasPassedCourse: boolean }, { grade: any }>(({ grade }) => ({
    hasPassedCourse: !!grade && (grade.passingState === 'passed' || grade.passingState === 'verifiedPassed'),
  }))
)(EndOfCourseNpsModal);
