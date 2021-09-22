import React from 'react';
import initBem from 'js/lib/bem';

import LearnerLearningObjectivesProvider from 'bundles/learner-learning-objectives/components/data/LearnerLearningObjectivesProvider';
import type StoredLearningObjective from 'bundles/learner-learning-objectives/models/StoredLearningObjective';

import CollapsibleMessage from 'bundles/ui/components/CollapsibleMessage';

import _t from 'i18n!nls/learner-learning-objectives';
import 'css!bundles/learner-learning-objectives/components/views/__styles__/ModuleLearningObjectivesList';

type Props = {
  objectives: Array<StoredLearningObjective>;
};

const bem = initBem('ModuleLearningObjectivesList');

const ModuleLearningObjectivesList: React.FC<Props> = ({ objectives }) => {
  if (!objectives?.length) {
    return null;
  }

  const lessAriaLabel = _t('Show fewer learning objectives');

  const moreAriaLabel = _t('Show more learning objectives');

  return (
    <CollapsibleMessage
      className={bem()}
      showToggle={true}
      cardSpacing="roomy"
      gradientColor="none"
      isInitiallyCollapsed={true}
      lessAriaLabel={lessAriaLabel}
      moreAriaLabel={moreAriaLabel}
      toggleIconColor="#2A73CC"
    >
      <h3 className="card-headline-text">{_t('Learning Objectives')}</h3>
      <LearnerLearningObjectivesProvider learningObjectiveIds={objectives.map((objective) => objective.id)}>
        {({ learningObjectives }) => (
          <ul className={bem('key-concepts')}>
            {learningObjectives?.map((objective) => (
              <li key={`key-concept-${objective.id}`}>{objective.description}</li>
            ))}
          </ul>
        )}
      </LearnerLearningObjectivesProvider>
    </CollapsibleMessage>
  );
};

export default ModuleLearningObjectivesList;
