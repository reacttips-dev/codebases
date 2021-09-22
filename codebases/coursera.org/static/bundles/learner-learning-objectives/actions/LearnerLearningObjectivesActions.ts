import { getLearningObjectives } from 'bundles/learner-learning-objectives/utils/LearningObjectivesApiUtils';
import { SET_OBJECTIVES } from 'bundles/learner-learning-objectives/constants/ModuleLearningObjectivesActionNames';
import type { ActionContext } from 'js/lib/ActionContext';

export type LoadModuleLearningObjectivesPayload = {
  branchId: string;
  moduleId: string;
  objectiveIds: Array<string>;
};

export const loadModuleLearningObjectives = (
  actionContext: ActionContext,
  payload: LoadModuleLearningObjectivesPayload,
  done: () => void
) => {
  const { branchId, moduleId, objectiveIds } = payload;
  if (objectiveIds.length) {
    getLearningObjectives(objectiveIds).then((objectives) => {
      actionContext.dispatch(SET_OBJECTIVES, {
        branchId,
        moduleId,
        objectives: objectiveIds
          .map((id) => objectives.find((objective) => objective.id === id))
          .filter((objective) => objective != null),
      });
      done();
    });
  } else {
    actionContext.dispatch(SET_OBJECTIVES, {
      branchId,
      moduleId,
      objectives: [],
    });
    done();
  }
};
