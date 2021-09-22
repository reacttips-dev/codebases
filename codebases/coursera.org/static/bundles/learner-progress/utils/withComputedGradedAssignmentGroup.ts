import { createComputedItemFromStores } from 'bundles/learner-progress/utils/withComputedItem';
import { Stores } from '../types/Stores';
import { GradedAssignmentGroupGrade, GradedAssignmentGroup } from '../types/GradedAssignmentGroup';

const GROUP_PASSING_STATE = 'Completed';

const createComputedGradedAssignmentGroupFromStores = ({
  gradedAssignmentGroupGrade,
  CourseStore,
  ProgressStore,
  CourseScheduleStore,
  SessionStore,
  CourseViewGradeStore,
}: { gradedAssignmentGroupGrade?: GradedAssignmentGroupGrade } & Stores): GradedAssignmentGroup | null => {
  if (!gradedAssignmentGroupGrade || !gradedAssignmentGroupGrade.gradedAssignmentGroup) {
    return null;
  }

  const {
    id,
    grade,
    droppedItemIds,
    gradedAssignmentGroup: { name, gradingWeight, gradingType, itemIds, passingPolicies },
  } = gradedAssignmentGroupGrade;

  const items = itemIds.map((itemId) =>
    createComputedItemFromStores({
      itemMetadata: CourseStore.getMaterials().getItemMetadata(itemId),
      CourseStore,
      ProgressStore,
      CourseScheduleStore,
      SessionStore,
      CourseViewGradeStore,
    })
  );

  const isPassed = ProgressStore.getGradedAssignmentGroupProgress(id) === GROUP_PASSING_STATE;

  const totalGradingWeight = CourseStore.getTotalGradingWeight();

  return {
    id,
    isPassed,
    grade,
    droppedItemIds,
    gradingType,
    gradingWeight: gradingWeight / totalGradingWeight,
    passingPolicies,
    name,
    items,
  };
};

export { createComputedGradedAssignmentGroupFromStores };
