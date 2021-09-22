import React, { Fragment } from 'react';

import CourseMaterial from 'bundles/course-home/page-course-welcome/next-step-card/components/CourseMaterial';
import CourseCompleted from 'bundles/course-home/page-course-welcome/next-step-card/components/CourseCompleted';
import CourseCompletedV2 from 'bundles/course-home/page-course-welcome/next-step-card/components/CourseCompletedV2';
import CourseRecommended from 'bundles/course-home/page-course-welcome/next-step-card/components/CourseRecommended';
import CourseScheduleAdjustment from 'bundles/course-home/page-course-welcome/next-step-card/components/CourseScheduleAdjustment';
import { Box, color } from '@coursera/coursera-ui';

import type { NextStep } from 'bundles/course-home/page-course-welcome/next-step-card/types/NextStep';

import { rtlStyle } from 'js/lib/language';
import _t from 'i18n!nls/course-home';
import { areCourseCompletedHomeVariantEnabled } from 'bundles/course-home/page-course-welcome/utils/featureGates';
import CompletedCourseRating from 'bundles/course-home/page-course-welcome/next-step-card/components/CompletedCourseRating';

import withCustomLabelsByUserAndCourse from 'bundles/custom-labels/hoc/withCustomLabelsByUserAndCourse';
import type { ReplaceCustomContent as ReplaceCustomContentType } from 'bundles/custom-labels/types/CustomLabels';

import 'css!./__styles__/CourseNextStepV2';
import { compose } from 'recompose';
import isDeprecatedNextStep from 'bundles/course-home/page-course-welcome/next-step-card/utils/isDeprecatedNextStep';

type InputProps = {
  nextStep: NextStep;
  courseId: string;
  sessionsV2Enabled?: boolean;
};

type Props = InputProps & {
  replaceCustomContent: ReplaceCustomContentType;
};

const CourseNextStepV2: React.SFC<Props> = (props) => {
  const { nextStep, courseId, sessionsV2Enabled, replaceCustomContent } = props;

  let typeComponent: React.ReactNode = null;
  let headerComponent: React.ReactNode = null;
  if (isDeprecatedNextStep(nextStep?.typeName)) {
    return null;
  }
  if (nextStep.typeName === 'courseCompletedNextStep') {
    return (
      <Fragment>
        {areCourseCompletedHomeVariantEnabled() ? (
          <Fragment>
            <div className="rc-CourseNextStepV2 card-no-action roomy">
              <CourseCompletedV2 nextStep={nextStep} replaceCustomContent={replaceCustomContent} />
            </div>
            <CompletedCourseRating courseId={courseId} courseSlug={nextStep.definition.course.slug} />
            <div className="rc-CourseNextStepV2 card-no-action">
              <CourseRecommended nextStep={nextStep} replaceCustomContent={replaceCustomContent} />
            </div>
          </Fragment>
        ) : (
          <div className="rc-CourseNextStepV2 card-no-action comfy">
            <CourseCompleted nextStep={nextStep} />
          </div>
        )}
      </Fragment>
    );
  }

  const isCourseScheduleAdjustmentNextStep = nextStep.typeName === 'courseScheduleAdjustmentNextStep';

  if (nextStep.typeName === 'courseMaterialNextStep') {
    const {
      definition: { currentWeekNumberByProgress: week },
    } = nextStep;

    typeComponent = <CourseMaterial nextStep={nextStep} sessionsV2Enabled={sessionsV2Enabled} courseId={courseId} />;
    headerComponent = replaceCustomContent(_t('{capitalizedWeekWithNumber}'), { weekNumber: week });
  } else if (nextStep.typeName === 'courseScheduleAdjustmentNextStep') {
    typeComponent = <CourseScheduleAdjustment courseId={courseId} nextStep={nextStep} />;
  } else if (nextStep.typeName === 'noAvailableNextStep') {
    return null;
  }

  return (
    <div className="rc-CourseNextStepV2 card-no-action">
      {!isCourseScheduleAdjustmentNextStep && (
        <Box
          flexDirection="column"
          justifyContent="start"
          alignItems="start"
          style={rtlStyle<React.CSSProperties>({
            padding: '12px 30px',
            fontWeight: 'bold',
            color: color.white,
            backgroundColor: color.bgDarkGray,
          })}
        >
          <div className="label-text">{headerComponent}</div>
        </Box>
      )}
      <div className="content">{typeComponent}</div>
    </div>
  );
};

export default compose<Props, InputProps>(withCustomLabelsByUserAndCourse)(CourseNextStepV2);
