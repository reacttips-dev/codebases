import React from 'react';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import type { ApolloQueryResult } from 'apollo-client';
import user from 'js/lib/user';
import mapItemsWithItemIdFromWeeks from 'bundles/course-teamwork/utils/CourseItemsUtils';

import type { Item } from 'bundles/course-v2/types/Item';
import type { Week } from 'bundles/course-v2/types/Week';
import type { ItemGradeCA } from 'bundles/compound-assessments/lib/withItemGrade';

/* eslint-disable graphql/template-strings */
export const courseGradesAndProgressesQuery = gql`
  query courseGradesAndProgressesWithLinksQuery($id: String!) {
    OnDemandCourseViewGradesV1 @naptime {
      get(id: $id, includes: "items, itemOutcomeOverrides") {
        elements {
          id
        }
        linked {
          onDemandCourseGradeItemOutcomeOverridesV1 {
            courseId
            explanation
            grade
            id
            isPassed
            itemId
            overriderId
            userId
          }
          onDemandCourseViewItemGradesV1 {
            itemId
            id
            courseId
            overallOutcome
            userId
          }
        }
      }
    }
    GuidedCourseSessionProgressesV1 @naptime {
      multiGet(ids: $id) {
        elements {
          id
          weeks
        }
      }
    }
  }
`;

type CourseGradesAndProgressesQueryType = {
  OnDemandCourseViewGradesV1?: {
    get: {
      linked: {
        onDemandCourseViewItemGradesV1: ItemGrade[];
        onDemandCourseGradeItemOutcomeOverridesV1: ItemOutcomeOverrides[];
      };
    };
  };
  GuidedCourseSessionProgressesV1?: {
    multiGet: {
      elements: {
        weeks: Week[];
      }[];
    };
  };
};

/* eslint-enable graphql/template-strings */

type ItemGrade = {
  itemId: string;
  overallOutcome: {
    grade: number;
    isPassed: boolean;
    latePenaltyRatio: {
      definition: {
        ratio: number;
      };
    };
  };
};

type ItemOutcomeOverrides = {
  itemId: string;
};

const getItemGradeCAMap = (
  itemGrades: ItemGrade[],
  itemOutcomeOverrides: ItemOutcomeOverrides[]
): { [id: string]: ItemGradeCA } => {
  const itemOutcomeOverridesMap = itemOutcomeOverrides.reduce(
    (map, itemOutcomeOverride) => ({
      ...map,
      [itemOutcomeOverride.itemId]: {
        ...itemOutcomeOverride,
      },
    }),
    {} as { [id: string]: ItemOutcomeOverrides }
  );
  return itemGrades.reduce(
    (map, itemGrade) => ({
      ...map,
      [itemGrade.itemId]: {
        ...itemGrade.overallOutcome,
        isOverridden: !!itemOutcomeOverridesMap[itemGrade.itemId],
        latePenaltyRatio: itemGrade.overallOutcome?.latePenaltyRatio?.definition?.ratio,
      },
    }),
    {} as { [id: string]: ItemGradeCA }
  );
};

export const CourseGradesAndProgresses = ({
  courseId,
  children,
}: {
  courseId: string;
  children: (x0: {
    loading: boolean;
    itemGradesCA?: { [x: string]: ItemGradeCA };
    itemsProgressMap?: { [x: string]: Item };
    refetch?: () => Promise<ApolloQueryResult<CourseGradesAndProgressesQueryType>>;
  }) => JSX.Element;
}) => {
  return (
    <Query<CourseGradesAndProgressesQueryType>
      query={courseGradesAndProgressesQuery}
      variables={{ id: `${user.get().id}~${courseId}` }}
    >
      {({ loading, data, refetch }) => {
        if (loading) {
          return children({ loading });
        }
        const itemGrades = data?.OnDemandCourseViewGradesV1?.get.linked.onDemandCourseViewItemGradesV1;
        const itemOutcomeOverrides =
          data?.OnDemandCourseViewGradesV1?.get.linked.onDemandCourseGradeItemOutcomeOverridesV1;
        const itemGradesCA = getItemGradeCAMap(itemGrades || [], itemOutcomeOverrides || []);
        const itemsProgressMap = mapItemsWithItemIdFromWeeks(
          data?.GuidedCourseSessionProgressesV1?.multiGet.elements[0]?.weeks
        );
        return children({ loading: false, itemGradesCA, itemsProgressMap, refetch });
      }}
    </Query>
  );
};

export default CourseGradesAndProgresses;
