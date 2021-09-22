import React from 'react';
import { CourseMaterialNextStep } from 'bundles/course-home/page-course-welcome/next-step-card/types/NextStep';

import CourseMaterialLabel from 'bundles/course-home/page-course-welcome/next-step-card/components/course/CourseMaterialLabel';
import ItemName from 'bundles/course-home/page-course-welcome/next-step-card/components/course/ItemName';
import ItemButton from 'bundles/course-home/page-course-welcome/next-step-card/components/course/ItemButton';
import withCustomLabelsByUserAndCourse from 'bundles/custom-labels/hoc/withCustomLabelsByUserAndCourse';

import getCourseMaterialTypeDescription from 'bundles/course-home/page-course-welcome/next-step-card/utils/getCourseMaterialTypeDescription';

import { ReplaceCustomContent } from 'bundles/custom-labels/types/CustomLabels';

import 'css!./__styles__/CourseMaterial';

type InputProps = {
  nextStep: CourseMaterialNextStep;
  sessionsV2Enabled?: boolean;
  courseId: string;
};

type Props = InputProps & {
  replaceCustomContent: ReplaceCustomContent;
};

const CourseMaterial: React.SFC<Props> = (props) => {
  const {
    nextStep: {
      definition: {
        item,
        courseMaterialNextStepType: type,
        currentWeekNumberByProgress,
        item: { timeCommitment },
      },
    },
    sessionsV2Enabled,
    courseId,
    replaceCustomContent,
  } = props;

  const { description, overrideLabel, overrideName, ariaLabel } = getCourseMaterialTypeDescription(
    type,
    item,
    replaceCustomContent
  );

  return (
    <div className="rc-CourseMaterial">
      <div className="next-step-content horizontal-box wrap">
        <div className="flex-1 description">
          {!sessionsV2Enabled && (
            <CourseMaterialLabel
              week={currentWeekNumberByProgress}
              duration={timeCommitment}
              item={item}
              courseId={courseId}
            />
          )}
          <ItemName item={item} overrideName={overrideName} />
          <div className="body-1-text description">{description}</div>
        </div>

        <ItemButton item={item} overrideLabel={overrideLabel} buttonSpacing="roomy" ariaLabel={ariaLabel} />
      </div>
    </div>
  );
};

export default withCustomLabelsByUserAndCourse<InputProps>(CourseMaterial);
