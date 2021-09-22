import URI from 'jsuri';
import StoredLearningObjective from 'bundles/learner-learning-objectives/models/StoredLearningObjective';
import type { LearningObjectiveCategory } from 'bundles/author-learning-objectives/types';
import API from 'js/lib/api';

const onDemandLearningObjectivesApi = API('/api/onDemandLearningObjectives.v2', { type: 'rest' });

const LEARNING_OBJECTIVE_FIELDS = 'category,description';

type LearningObjective = {
  id: string;
  category: string | { value: LearningObjectiveCategory };
  description: string;
};

/**
 * Return the content of the given stored learning objectives.
 */
export const getLearningObjectives = (ids: Array<string>) => {
  const uri = new URI().addQueryParam('ids', ids.join(',')).addQueryParam('fields', LEARNING_OBJECTIVE_FIELDS);

  return onDemandLearningObjectivesApi
    .get(uri.toString())
    .then((response: { elements: Array<LearningObjective> }) => response.elements)
    .then((jsons: Array<LearningObjective>) =>
      jsons.map(
        (json) => new StoredLearningObjective({ id: json.id, category: json.category, description: json.description })
      )
    );
};
