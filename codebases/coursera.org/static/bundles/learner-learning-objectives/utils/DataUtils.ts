import type { Item } from 'bundles/learner-progress/types/Item';
import type { ItemToLearningObjectives } from 'bundles/ondemand/lib/CourseMaterials';

export const buildLearningObjectiveToItemIds = (itemToLearningObjectives: ItemToLearningObjectives = {}) => {
  const result = {};
  Object.keys(itemToLearningObjectives).forEach((itemId) => {
    itemToLearningObjectives[itemId].learningObjectives.forEach((learningObjectiveId) => {
      // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      if (result[learningObjectiveId]) {
        // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        result[learningObjectiveId].push(itemId);
      } else {
        // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        result[learningObjectiveId] = [itemId];
      }
    });
  });
  return result;
};

// TODO (jcheung) explore whether BE should handle computation of relevant learning objective items
export const buildFilteredComputedItems = (
  computedItems: Array<Item>,
  excludeItemIds?: Array<string>,
  maxWeekNumber?: number
) =>
  computedItems.filter((item) => {
    if ((excludeItemIds && excludeItemIds.includes(item.id)) || (maxWeekNumber && item.weekNumber > maxWeekNumber)) {
      return false;
    }
    return true;
  });
