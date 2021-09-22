import React from 'react';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { ApolloError } from 'apollo-client';
import { tupleToStringKey } from 'js/lib/stringKeyTuple';
import { SkillImprovement } from './types';

export const SkillsPostAssessmentQuery = gql`
  query G3SkillsPostAssessmentQuery($userId: String!, $courseItemId: String!) {
    SimpleSkillScoresV1 @naptime {
      byUserAndCourseItemId(userId: $userId, courseItemId: $courseItemId) {
        elements {
          id
          readableScore
          skill {
            id
            name
          }
        }
      }
    }
  }
`;

type SimpleSkillScoresResults = {
  SimpleSkillScoresV1?: {
    byUserAndCourseItemId?: {
      elements?: SkillImprovement[];
    };
  };
};

type ChildrenProps = {
  loading?: boolean;
  error?: ApolloError;
  improvements: SkillImprovement[];
};

type Props = {
  courseId: string;
  itemId: string;
  userId: number;
  children: (props: ChildrenProps) => React.ReactElement | null;
};

const SkillPostAssesmentDataProvider = ({ children, userId, courseId, itemId }: Props) => {
  return (
    <Query<SimpleSkillScoresResults>
      query={SkillsPostAssessmentQuery}
      variables={{
        userId,
        courseItemId: tupleToStringKey([courseId, itemId]),
      }}
    >
      {({ loading, error, data }) => {
        if (loading) return children({ loading, improvements: [] });
        if (error) return children({ error, improvements: [] });

        const scoresData = data?.SimpleSkillScoresV1;

        const improvements = scoresData?.byUserAndCourseItemId?.elements || [];
        return children({ improvements });
      }}
    </Query>
  );
};

export default SkillPostAssesmentDataProvider;
