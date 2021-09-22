import { GridSize } from '@material-ui/core';
import { CourseNextStepTypeName } from 'bundles/naptimejs/resources/__generated__/GuidedCourseNextStepsV1';

type Args = {
  nextStepType?: CourseNextStepTypeName | null;
  showGoalCard: boolean;
  showProgressCard: boolean;
};

export default ({ nextStepType, showGoalCard, showProgressCard }: Args) => {
  let progressCardWidth: GridSize | boolean = true;
  let goalCardWidth: GridSize | boolean = true;
  let nextStepWidth: GridSize | boolean = true;

  if (showGoalCard && showProgressCard) {
    goalCardWidth = 6;
    progressCardWidth = 6;
  } else if (nextStepType === 'courseMaterialNextStep') {
    if (showProgressCard && showGoalCard) {
      progressCardWidth = 6;
      goalCardWidth = 6;
    } else if (!showProgressCard && showGoalCard) {
      goalCardWidth = 6;
      nextStepWidth = 6;
    } else if (showProgressCard && !showGoalCard) {
      progressCardWidth = 6;
      nextStepWidth = 6;
    }
  } else {
    if (showProgressCard && !showGoalCard) {
      progressCardWidth = 12;
      nextStepWidth = 12;
    } else if (!showProgressCard && showGoalCard) {
      goalCardWidth = 12;
      nextStepWidth = 12;
    } else {
      nextStepWidth = 12;
    }
  }

  return {
    nextStepWidth,
    progressCardWidth,
    goalCardWidth,
  };
};
