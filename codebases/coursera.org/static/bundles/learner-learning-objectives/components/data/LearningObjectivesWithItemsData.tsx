import React from 'react';
import initBem from 'js/lib/bem';

import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import { createComputedItemFromStores } from 'bundles/learner-progress/utils/withComputedItem';
import CourseMaterials from 'bundles/ondemand/lib/CourseMaterials';
import type { LearningObjective } from 'bundles/learner-learning-objectives/components/data/LearnerLearningObjectivesProvider';
import LearnerLearningObjectivesProvider from 'bundles/learner-learning-objectives/components/data/LearnerLearningObjectivesProvider';

import type { Item } from 'bundles/learner-progress/types/Item';

import {
  buildLearningObjectiveToItemIds,
  buildFilteredComputedItems,
} from 'bundles/learner-learning-objectives/utils/DataUtils';

type EnhancedLearningObjective = LearningObjective & {
  computedItems?: Array<Item>;
};

type EnhancedLearningObjectives = Array<EnhancedLearningObjective> | null;

type Props = {
  itemId?: string;
  courseSlug?: string;
  learningObjectiveIds?: Array<string>;
  removeParentItem?: boolean;
  removeFutureItems?: boolean;
  buildComputedItem: (itemId: string) => Item;
  children: ({ learningObjectives }: { learningObjectives?: EnhancedLearningObjectives }) => React.ReactElement;
};

const bem = initBem('LearningObjectiveWithItemsData');

/**
 * This component gathers learning objectives and course materials data and computes an array of
 * learning objectives that includes computed items for items associated with each learning objective.
 * The component only aggregates data, and delegates presentation via the children render prop.
 */
const LearningObjectivesWithItemsData: React.FC<Props> = ({
  itemId,
  courseSlug = '',
  learningObjectiveIds,
  removeParentItem,
  removeFutureItems,
  buildComputedItem,
  children,
}) => {
  return (
    <div className={bem()}>
      <CourseMaterials slug={courseSlug}>
        {({ courseMaterialsItems, itemToLearningObjectives }) => {
          const itemOrder = courseMaterialsItems?.map((courseMaterialsItem) => courseMaterialsItem.id);
          const learningObjectiveToItemIds = buildLearningObjectiveToItemIds(itemToLearningObjectives);
          return itemOrder ? (
            <LearnerLearningObjectivesProvider learningObjectiveIds={learningObjectiveIds}>
              {({ learningObjectives }) => {
                const parentComputedItem = itemId ? buildComputedItem(itemId) : undefined;
                const excludeItemIds = parentComputedItem && removeParentItem ? [parentComputedItem.id] : undefined;
                const maxWeekNumber =
                  parentComputedItem && removeFutureItems ? parentComputedItem.weekNumber : undefined;
                const filteredLearningObjectives = learningObjectives?.map((learningObjective) => {
                  // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                  const computedItems = learningObjectiveToItemIds[learningObjective.id]
                    .sort((a: $TSFixMe, b: $TSFixMe) => itemOrder.indexOf(a) - itemOrder.indexOf(b))
                    .map((computedItemId: $TSFixMe) => buildComputedItem(computedItemId));
                  const filteredComputedItems = buildFilteredComputedItems(
                    computedItems,
                    excludeItemIds,
                    maxWeekNumber
                  );
                  return {
                    ...learningObjective,
                    computedItems: filteredComputedItems,
                  };
                });
                return children({ learningObjectives: filteredLearningObjectives });
              }}
            </LearnerLearningObjectivesProvider>
          ) : (
            <div />
          );
        }}
      </CourseMaterials>
    </div>
  );
};

type ConnectedHOC = <P extends {}>(
  component: React.ComponentType<P & Props>
) => React.ComponentClass<P & Partial<Props>>;

const connected = connectToStores(
  ['CourseStore', 'ProgressStore', 'CourseScheduleStore', 'SessionStore', 'CourseViewGradeStore'],
  ({ CourseStore, ProgressStore, CourseScheduleStore, SessionStore, CourseViewGradeStore }) => ({
    buildComputedItem: (itemId: string) =>
      createComputedItemFromStores({
        itemMetadata: CourseStore.getMaterials().getItemMetadata(itemId),
        CourseStore,
        ProgressStore,
        CourseScheduleStore,
        SessionStore,
        CourseViewGradeStore,
      }),
  })
) as ConnectedHOC;

export default connected(LearningObjectivesWithItemsData);
