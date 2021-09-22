import React from 'react';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import type { ApolloQueryResult } from 'apollo-client';
import { ContentSummary } from 'bundles/course-v2/types/ContentSummary';
import { GradingLatePenalty } from 'bundles/course-v2/types/Item';

/* eslint-disable graphql/template-strings */
export const courseMaterialsQuery = gql`
  query CourseMaterialsQuery($slug: String!) {
    OnDemandCourseMaterialsV2 @naptime {
      slug(slug: $slug, showHidden: true, showLockedItems: true, includes: "items, gradePolicy") {
        elements {
          id
          itemToLearningObjectives
        }
        linked {
          onDemandCourseMaterialItemsV2 {
            id
            name
            slug
            trackId
            timeCommitment
            contentSummary
            isLocked
            lockableByItem
            itemLockedReasonCode
            lockedStatus
            itemLockSummary
          }
          onDemandCourseMaterialGradePolicyV1 {
            id
            orgCourseraOndemandCoursematerialCumulativeGradePolicy
          }
        }
      }
    }
  }
`;
/* eslint-enable graphql/template-strings */

type CourseMaterialsQueryType = {
  OnDemandCourseMaterialsV2: {
    slug?: {
      elements?: {
        id: string;
        itemToLearningObjectives: {
          itemId: string;
          learningObjectives: string[];
        }[];
      }[];
      linked?: {
        onDemandCourseMaterialItemsV2: CourseMaterialItem[];
        onDemandCourseMaterialGradePolicyV1: {
          orgCourseraOndemandCoursematerialCumulativeGradePolicy: boolean;
        }[];
      };
    };
  };
};

export type CourseMaterialItem = {
  id: string;
  name: string;
  trackId: string;
  timeCommitment: number;
  contentSummary: ContentSummary & {
    definition: {
      gradingLatePenalty?: GradingLatePenalty;
    };
  };
  isLocked: boolean;
  itemLockedReasonCode: string;
};

export type ItemToLearningObjectives = {
  [key: string]: {
    itemId: string;
    learningObjectives: Array<string>;
  };
};

type OutputProps = {
  courseId?: string;
  loading: boolean;
  courseMaterialsItems?: Array<CourseMaterialItem>;
  itemToLearningObjectives?: ItemToLearningObjectives;
  isCumulativeGraded?: boolean;
  refetch?: () => Promise<ApolloQueryResult<CourseMaterialsQueryType>>;
};

export const CourseMaterials = ({
  slug,
  children,
}: {
  slug: string;
  children: (props: OutputProps) => JSX.Element;
}) => {
  return (
    <Query<CourseMaterialsQueryType> query={courseMaterialsQuery} variables={{ slug }}>
      {({ loading, data, refetch }) => {
        if (loading) {
          return children({ loading });
        }
        const courseId = data?.OnDemandCourseMaterialsV2?.slug?.elements?.[0]?.id;
        const courseMaterialsItems = data?.OnDemandCourseMaterialsV2?.slug?.linked?.onDemandCourseMaterialItemsV2;
        const itemToLearningObjectives = data?.OnDemandCourseMaterialsV2?.slug?.elements?.[0]?.itemToLearningObjectives?.reduce(
          (accum, curr) => ({
            ...accum,
            [curr.itemId]: curr,
          }),
          {} as ItemToLearningObjectives
        );
        const isCumulativeGraded = !!data?.OnDemandCourseMaterialsV2?.slug?.linked
          ?.onDemandCourseMaterialGradePolicyV1?.[0]?.orgCourseraOndemandCoursematerialCumulativeGradePolicy;
        return children({
          loading: false,
          courseId,
          courseMaterialsItems,
          itemToLearningObjectives,
          isCumulativeGraded,
          refetch,
        });
      }}
    </Query>
  );
};

export default CourseMaterials;
