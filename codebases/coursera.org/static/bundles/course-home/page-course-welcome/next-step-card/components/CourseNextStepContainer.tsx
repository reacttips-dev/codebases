import React from 'react';
import _ from 'underscore';

import Naptime, { InjectedNaptime } from 'bundles/naptimejs';
import user from 'js/lib/user';
import _t from 'i18n!nls/course-home';

import waitFor from 'js/lib/waitFor';
import A11yScreenReaderOnly from 'bundles/a11y/components/A11yScreenReaderOnly';

import CourseNextStep from 'bundles/course-home/page-course-welcome/next-step-card/components/CourseNextStep';
import CourseNextStepV2 from 'bundles/course-home/page-course-welcome/next-step-card/components/CourseNextStepV2';

import { NextStep } from 'bundles/course-home/page-course-welcome/next-step-card/types/NextStep';
import GuidedCourseNextStepsV1 from 'bundles/naptimejs/resources/guidedCourseNextSteps.v1';
import LearnerCourseSchedulesV1 from 'bundles/naptimejs/resources/learnerCourseSchedules.v1';
import CourseTypeMetadataV1 from 'bundles/naptimejs/resources/courseTypeMetadata.v1';

type PropsFromCaller = { courseSlug: string; courseId: string };

type PropsFromNaptime = {
  naptime: InjectedNaptime;
  guidedCourseNextSteps: Array<{ id: string; nextStep: NextStep }>;
  sessionsV2Enabled: boolean;
  courseTypeMetadata?: CourseTypeMetadataV1[];
};

type PropsToComponent = PropsFromCaller & PropsFromNaptime;

class CourseNextStepContainer extends React.Component<PropsToComponent> {
  componentDidMount() {
    this.props.naptime.refreshData({ resources: ['guidedCourseNextSteps.v1'] });
  }

  render() {
    const { courseId, guidedCourseNextSteps, courseTypeMetadata, sessionsV2Enabled } = this.props;
    if (!courseId || !guidedCourseNextSteps || guidedCourseNextSteps.length === 0) {
      return null;
    }

    const nextStepWithCourseMetadata = guidedCourseNextSteps[0].nextStep;
    if (nextStepWithCourseMetadata.typeName === 'courseCompletedNextStep') {
      if (!nextStepWithCourseMetadata.definition.course) {
        return null;
      }

      nextStepWithCourseMetadata.definition.course.courseTypeMetadata = courseTypeMetadata?.[0] ?? undefined;
    }

    if (sessionsV2Enabled) {
      return (
        <>
          <A11yScreenReaderOnly tagName="h2">{_t('Next Step')}</A11yScreenReaderOnly>
          <CourseNextStepV2
            courseId={courseId}
            nextStep={nextStepWithCourseMetadata}
            sessionsV2Enabled={sessionsV2Enabled}
          />
        </>
      );
    } else {
      return (
        <>
          <A11yScreenReaderOnly tagName="h2">{_t('Next Step')}</A11yScreenReaderOnly>
          <CourseNextStep nextStep={nextStepWithCourseMetadata} courseId={courseId} />
        </>
      );
    }
  }
}

export default _.compose(
  Naptime.createContainer(({ courseSlug, courseId }: PropsFromCaller) => ({
    guidedCourseNextSteps: GuidedCourseNextStepsV1.multiGet([`${user.get().id}~${courseSlug}`], {
      fields: ['id', 'nextStep'],
    }),
    sessionsV2Enabled: LearnerCourseSchedulesV1.getSessionsV2EnabledBySlug(courseSlug),
    courseTypeMetadata: CourseTypeMetadataV1.courseTypeMetadatas([courseId], true),
  })),
  waitFor(({ guidedCourseNextSteps }) => {
    return !!guidedCourseNextSteps && guidedCourseNextSteps.length !== 0;
  })
)(CourseNextStepContainer);
