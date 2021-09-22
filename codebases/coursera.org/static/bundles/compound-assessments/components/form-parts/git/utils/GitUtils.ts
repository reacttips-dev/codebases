import {
  AssignmentPresentation as AssignmentPresentationType,
  SingleFormPhase,
} from 'bundles/compound-assessments/components/api/AssignmentPresentation';
import {
  AsyncMachineTask,
  OnDemandAssignmentPresentationsQuery_OnDemandAssignmentPresentationsV1_learner_elements_phases_Phase_singleFormPhase_definition as SingleFormPhaseDefinition,
} from 'bundles/compound-assessments/components/api/types/OnDemandAssignmentPresentationsQuery';
import { Form, FormElementNodeWithId } from 'bundles/compound-assessments/components/api/types/CompoundAssessmentsForm';
import { typeNames } from 'bundles/compound-assessments/constants';

export type GitStatuses = {
  isGitInitializationFailed: boolean;
  isGitInitializationInProgress: boolean;
  gitRelatedAsyncTask?: AsyncMachineTask;
};

// TODO(riwong): Consolidate this as AssignmentUtils or something

export const formPartsHasGitQuestions = (formParts: Array<FormElementNodeWithId>): boolean => {
  return formParts.some((formPart) => {
    return formPart.root.element.typeName === typeNames.GIT_REPOSITORY_PROMPT_ELEMENT;
  });
};

export const getFormPartsFromAssignment = (assignment: AssignmentPresentationType): Array<FormElementNodeWithId> => {
  const singleFormPhasePhases = assignment.phases
    .filter((phase) => phase?.typeName === 'singleFormPhase')
    .filter(Boolean) as SingleFormPhase[];
  const phaseDefinitions = singleFormPhasePhases
    .map((phase) => phase.definition)
    .filter(Boolean) as SingleFormPhaseDefinition[];
  const forms = phaseDefinitions.map((phaseDefinition) => phaseDefinition.task.form).filter(Boolean) as Form[];
  const formParts = forms.map((form) => form.parts);
  // Equivalent of formParts.flat()
  // Ideally, we'd return forms.flatMap() above, when supported in Node
  return formParts.reduce((acc, val) => acc.concat(val), []);
};

export const assignmentHasGitQuestions = (assignment: AssignmentPresentationType): boolean => {
  return formPartsHasGitQuestions(getFormPartsFromAssignment(assignment));
};

export const getGitStatuses = (assignment: AssignmentPresentationType): GitStatuses => {
  const gitRelatedAsyncTasks = assignment.phases
    .map((phase) => {
      if (phase?.typeName === 'singleFormPhase') {
        return phase?.definition?.relatedAsyncTasks?.find(
          (relatedAsyncTask) => relatedAsyncTask.baseTaskId === 'GIT_INITIALIZATION'
        );
      }
      return undefined;
    })
    .filter(Boolean);
  const gitRelatedAsyncTask = gitRelatedAsyncTasks[0];

  const isGitInitializationFailed = typeof gitRelatedAsyncTask?.errorMessage === 'string';
  const isGitInitializationInProgress =
    typeof gitRelatedAsyncTask?.startedAt === 'number' && !isGitInitializationFailed; // Failed state will still have startedAt

  return {
    isGitInitializationFailed,
    isGitInitializationInProgress,
    gitRelatedAsyncTask,
  };
};
