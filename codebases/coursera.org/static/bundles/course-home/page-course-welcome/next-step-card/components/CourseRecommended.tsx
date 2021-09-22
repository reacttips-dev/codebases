/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { compose } from 'recompose';
import user from 'js/lib/user';

import Naptime from 'bundles/naptimejs';
import type { InjectedNaptime } from 'bundles/naptimejs';

import type { CourseCompletedNextStep } from 'bundles/course-home/page-course-welcome/next-step-card/types/NextStep';
import type { ReplaceCustomContent as ReplaceCustomContentType } from 'bundles/custom-labels/types/CustomLabels';
import CourseCompletionRecommendationV1 from 'bundles/naptimejs/resources/courseCompletionRecommendation.v1';

import CourseRecommendedWithRatings from 'bundles/course-home/page-course-welcome/next-step-card/components/course-complete/CourseRecommendedWithRatings';
import CourseRecommendedWithS12nProgess from 'bundles/course-home/page-course-welcome/next-step-card/components/course-complete/CourseRecommendedWithS12nProgess';

type Props = {
  nextStep: CourseCompletedNextStep;
  replaceCustomContent: ReplaceCustomContentType;
};

export type RecommendedCourse = {
  courseCompleteRecommendation: {
    'org.coursera.ondemand.courseRecommendation.GeneralCourseRecommendation'?: {
      courses: Array<{
        courseId: string;
        courseLogoUrl: string;
        courseName: string;
        courseRating: number;
        courseSlug: string;
        partnerName: string;
      }>;
    };
    'org.coursera.ondemand.courseRecommendation.S12nNextCourseRecommendation'?: {
      courseId: string;
      courseLogoUrl: string;
      courseName: string;
      coursePositionInS12n: number;
      courseSlug: string;
      partnerName: string;
      relatedS12nMetadata: {
        name: string;
        s12nId: string;
        s12nSlug: string;
        totalNumberOfCoursesInS12n: number;
        s12nCourses: Array<{
          courseId: string;
          courseSlug: string;
          courseName: string;
          courseProgressState: 'NotStarted' | 'Completed' | 'Started';
          courseHomeUrl: string;
        }>;
      };
    };
  };
};

type PropsFromNaptime = {
  naptime: InjectedNaptime;
};

const CourseRecommended: React.FC<Props & PropsFromNaptime> = ({ replaceCustomContent, naptime, nextStep }) => {
  const [recommendedCourse, setRecommendedCourse] = useState<RecommendedCourse>({} as RecommendedCourse);

  const getRecommendedCourses = async () => {
    const result = await naptime.executeMutation(
      CourseCompletionRecommendationV1.action(
        'recommendNextCourse',
        {},
        { userId: user.get().id, courseId: nextStep?.definition?.course?.id }
      )
    );

    setRecommendedCourse(result?.data);
  };

  useEffect(() => {
    getRecommendedCourses();
  }, []);

  const s12nCourseRecPath =
    recommendedCourse.courseCompleteRecommendation?.[
      'org.coursera.ondemand.courseRecommendation.S12nNextCourseRecommendation'
    ];

  if (s12nCourseRecPath) {
    return (
      <CourseRecommendedWithS12nProgess
        recommendedCourse={recommendedCourse}
        replaceCustomContent={replaceCustomContent}
      />
    );
  } else
    return (
      <CourseRecommendedWithRatings
        recommendedCourse={recommendedCourse}
        replaceCustomContent={replaceCustomContent}
        isCourseS12n={nextStep.definition.s12n}
        s12nCourseName={nextStep.definition.course.name}
      />
    );
};

export default compose<Props & PropsFromNaptime, Props>(Naptime.createContainer<{}, Props>(() => ({})))(
  CourseRecommended
);
