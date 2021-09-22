import React from 'react';

import GradeFeedback from 'bundles/compound-assessments/components/form-parts/cds/GradeFeedback';
import getQuestionGradeFeedbackInfo, {
  Props as QuestionGradeFeedbackInfoProps,
} from 'bundles/compound-assessments/lib/utils/getQuestionGradeFeedbackInfo';

type Props = QuestionGradeFeedbackInfoProps;

const GradeNotification: React.SFC<Props> = (props) => {
  const { prompt } = props || {};
  if (!(prompt || {}).feedback) {
    return null;
  }

  const questionGradeFeedbackInfo = getQuestionGradeFeedbackInfo(props);
  if (questionGradeFeedbackInfo === null) {
    return null;
  }

  return <GradeFeedback questionType={prompt.question.type} {...questionGradeFeedbackInfo} />;
};

export default GradeNotification;
