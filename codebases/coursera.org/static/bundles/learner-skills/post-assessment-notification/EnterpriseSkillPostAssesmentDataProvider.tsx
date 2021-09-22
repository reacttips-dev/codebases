import React from 'react';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import {
  ProgramCurriculumProductsV1EnrollmentByUserAndCourseQueryVariables as QueryVariables,
  ProgramCurriculumProductsV1EnrollmentByUserAndCourseQuery as QueryResult,
} from 'bundles/naptimejs/resources/__generated__/ProgramCurriculumProductsV1';

import { EnterpriseTargetSkillProfilesV1 as SkillSet } from 'bundles/naptimejs/resources/__generated__/EnterpriseTargetSkillProfilesV1';

export const EnterpriseSkillsPostAssessmentQuery = gql`
  query EnterpriseSkillsPostAssessmentQuery($userId: String!, $courseId: String!) {
    ProgramCurriculumProductsV1 @naptime {
      enrollmentByUserAndCourse(
        userId: $userId
        courseId: $courseId
        includes: "programs,targetSkillProfiles,targetSkillProfileUserStates"
      ) {
        elements {
          id
        }
        linked {
          enterpriseProgramsV1 {
            id
            metadata {
              slug
              linkedTargetSkillProfileIds
            }
          }
          enterpriseTargetSkillProfilesV1 {
            id
            slug
            title
            targetSkillProficiencies {
              skillId
              targetProficiency
            }
          }
          targetSkillProfileUserStatesV1 {
            id
            state
          }
        }
      }
    }
  }
`;

export type EnterpriseSkillsPostAssessmentData = {
  savedSkillSet?: SkillSet;
  savedSkillSetProgramUrl?: string;
};

export type ChildrenProps = {
  isEnterpriseUser: boolean;
  isEnterpriseUserWithSkillsEnabled: boolean;
  loading: boolean;
} & EnterpriseSkillsPostAssessmentData;

type Props = {
  userId: number;
  courseId: string;
  children: (props: ChildrenProps) => React.ReactElement | null;
};

/**
 * WARNING: this component's sole purpose is to provide enterprise specific data for post assessment skills notification
 * It is not meant to be reused and is planned to be combined with SkillsPostAssessmentDataProvider once Enterprise and Consumer share the same data source
 */
const EnterpriseSkillPostAssesmentDataProvider = ({ userId, courseId, children }: Props) => {
  return (
    <Query<QueryResult, QueryVariables>
      query={EnterpriseSkillsPostAssessmentQuery}
      variables={{
        userId: userId.toString(),
        courseId,
      }}
    >
      {({ loading, error, data }) => {
        // Make errors non blocking
        if (error)
          return children({ isEnterpriseUser: false, isEnterpriseUserWithSkillsEnabled: false, loading: false });

        const enrollmentData = data?.ProgramCurriculumProductsV1?.enrollmentByUserAndCourse?.elements;
        const linkedData = data?.ProgramCurriculumProductsV1?.enrollmentByUserAndCourse?.linked;
        const isEnterpriseUser = (enrollmentData?.length || 0) > 0;
        const programMetadata = linkedData?.enterpriseProgramsV1?.[0]?.metadata;
        const targetSkillProfile = linkedData?.enterpriseTargetSkillProfilesV1?.[0];
        const targetSkillProfileUserState = linkedData?.targetSkillProfileUserStatesV1?.[0];

        const isEnterpriseUserWithSkillsEnabled = (programMetadata?.linkedTargetSkillProfileIds || []).length > 0;

        const savedSkillSet = targetSkillProfileUserState?.state === 'SAVED' ? targetSkillProfile : undefined;

        const programSlug = programMetadata?.slug;
        const savedSkillSetSlug = savedSkillSet?.slug;
        const savedSkillSetProgramUrl =
          programSlug && savedSkillSetSlug ? `/programs/${programSlug}/skillsets/${savedSkillSetSlug}` : undefined;

        return children({
          isEnterpriseUser,
          isEnterpriseUserWithSkillsEnabled,
          loading,
          savedSkillSet,
          savedSkillSetProgramUrl,
        });
      }}
    </Query>
  );
};

export default EnterpriseSkillPostAssesmentDataProvider;
