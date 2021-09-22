// Render-prop component to get item info similar to `withComputedItem`. The main difference is
// that this component uses GraphQL to fetch and store data.
// This component is not fully mirror `withComputedItem` data and designed mostly to use with
// Quizes and Compound Assessments. A lot of extra data is dropped now.
// You can pass optional props `itemId` and `courseSlug`.
// If you don't pass these props, it will try to find it from router `item_id` and `courseSlug`
// props. Unlike `withComputedItem` you don't need to have to pass `itemMetadata` prop to make
// it work.
// It uses GraphQL with Naptime Link to fetch and store data. It will take data from cache
// if you will use this component in different places, it will not reload data from API.
// If Apollo Cache with related object will change (refetch or update cache manually), it will
// trigger rerender child component with updated data.
// It will call children with parameters defined in `ComputedItemProps` type. You can check
// loading param to show loader if needed.
// Example:
// ```
// import ComputedItem from 'bundles/ondemand/lib/ComputedItem';
// ...
// <ComputedItem>
//   {({ item, loading }) => {
//     // render item or loader if loading is true
//   }}
// </ComputedItem>
// ```
// Please slack #learner-fireflies if you want to use or modify this component.

import React from 'react';
import type { ApolloQueryResult } from 'apollo-client';
import CourseMaterials from 'bundles/ondemand/lib/CourseMaterials';
import CourseGradesAndProgresses from 'bundles/ondemand/lib/CourseGradesAndProgresses';

import { ContentSummary } from 'bundles/course-v2/types/ContentSummary';
import { ItemGradeCA } from 'bundles/compound-assessments/lib/withItemGrade';
import { GradingLatePenalty } from 'bundles/course-v2/types/Item';

import connectToRouter from 'js/lib/connectToRouter';

export type ComputedItemType = {
  id: string;
  name: string;
  courseId: string;
  timeCommitment: number;
  courseSlug: string;
  contentSummary?: ContentSummary;
  itemGrade?: ItemGradeCA;
  deadline?: number;
  isCumulativeGraded: boolean;
  isPremiumGradingLocked: boolean;
  gradingLatePenalty?: GradingLatePenalty;
  learningObjectiveIds?: Array<string>;
  refetch: () => Promise<ApolloQueryResult<ComputedItemProps>>;
};

export type ComputedItemProps = {
  loading: boolean;
  item?: ComputedItemType;
};

type InputProps = {
  itemId?: string;
  courseSlug?: string;
};

type Props = {
  itemId: string;
  courseSlug: string;
  children: (props: ComputedItemProps) => JSX.Element;
};

const ComputedItem: React.FC<Props> = ({ itemId, courseSlug, children }) => {
  const computedItem: Partial<ComputedItemType> = {};
  return (
    <CourseMaterials slug={courseSlug}>
      {({
        courseId,
        loading,
        courseMaterialsItems,
        itemToLearningObjectives,
        isCumulativeGraded,
        refetch: refetchCourseMaterials,
      }) => {
        if (loading || !courseId || !courseMaterialsItems) {
          return children({ loading: true });
        }
        const courseMaterialItem = courseMaterialsItems.find((item) => {
          return item.id === itemId;
        });
        computedItem.courseId = courseId;
        computedItem.id = itemId;
        computedItem.courseSlug = courseSlug;
        computedItem.name = courseMaterialItem?.name || '';
        computedItem.timeCommitment = courseMaterialItem?.timeCommitment || 0;
        computedItem.learningObjectiveIds = itemToLearningObjectives?.[itemId]?.learningObjectives;
        computedItem.contentSummary = courseMaterialItem?.contentSummary;
        computedItem.gradingLatePenalty = courseMaterialItem?.contentSummary?.definition?.gradingLatePenalty;
        computedItem.isCumulativeGraded = !!isCumulativeGraded;
        computedItem.isPremiumGradingLocked = !!(
          courseMaterialItem?.isLocked && courseMaterialItem?.itemLockedReasonCode === 'PREMIUM'
        );
        return (
          <CourseGradesAndProgresses courseId={courseId}>
            {({
              loading: viewGradesLoading,
              itemGradesCA,
              itemsProgressMap,
              refetch: refetchCourseGradesAndProgresses,
            }) => {
              if (viewGradesLoading || !itemGradesCA || !itemsProgressMap) {
                return children({ loading: true });
              }
              computedItem.itemGrade = itemGradesCA[itemId];
              computedItem.deadline = itemsProgressMap[itemId]?.deadline;
              // @ts-expect-error react-apollo.d.ts migration
              computedItem.refetch = () => {
                if (refetchCourseMaterials && refetchCourseGradesAndProgresses) {
                  return refetchCourseGradesAndProgresses().then(() => refetchCourseMaterials());
                }
                return Promise.reject();
              };
              return children({ loading: false, item: computedItem as ComputedItemType });
            }}
          </CourseGradesAndProgresses>
        );
      }}
    </CourseMaterials>
  );
};

const ComputedItemWithRouter = connectToRouter<Props, InputProps>((router, { itemId, courseSlug }) => ({
  itemId: itemId || router.params.item_id,
  courseSlug: courseSlug || router.params.courseSlug,
}))(ComputedItem);

export const withComputedItem = (
  BaseComponent: React.ComponentType<InputProps & { computedItem: ComputedItemType }>
) => {
  return (props: InputProps) => {
    return (
      <ComputedItemWithRouter>
        {({ item }: { item: ComputedItemType }) => (item ? <BaseComponent {...props} computedItem={item} /> : null)}
      </ComputedItemWithRouter>
    );
  };
};

export default ComputedItemWithRouter;
