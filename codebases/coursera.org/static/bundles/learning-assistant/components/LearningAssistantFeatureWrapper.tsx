import React from 'react';

import { compose } from 'recompose';

import deferToClientSideRender from 'js/lib/deferToClientSideRender';

import LearningAssistant from 'bundles/learning-assistant/components/LearningAssistant';

import { isLearningAssistantEnabled } from 'bundles/learning-assistant/utils/featureGates';

type Props = {
  courseId: string;
};

const LearningAssistantFeatureWrapper: React.SFC<Props> = ({ courseId }) => {
  const assistantEnabled = isLearningAssistantEnabled(courseId);

  if (assistantEnabled) {
    return <LearningAssistant courseId={courseId} />;
  }

  return null;
};

export default compose<Props, Props>(deferToClientSideRender())(LearningAssistantFeatureWrapper);
