import React from 'react';
import { Query, Mutation } from 'react-apollo';
import { ApolloError } from 'apollo-client';
import { Skill } from './SkillTagList';

import {
  queryGetSkillTags,
  queryAllSkillTags,
  GetSkillTagsResult,
  GetAllSkillResult,
  GetSkillTagsVariables,
  queryGetFeedback,
  GetUserFeedbackVariables,
} from '../private/queries';

import { mutationPostFeedback, PostFeedbackFn, PostFeedbackVariables } from '../private/mutations';

function getAssignmentFeedbackId(courseId: string, itemId: string) {
  return `ITEM_SPECIFIC~${courseId}!~${itemId}`;
}

const MAX_TAGS_TO_SHOW = 7;

export type SkillTagResultCallData = {
  loading: boolean;
  error?: ApolloError;

  hasSubmittedBefore: boolean;
  data: {
    shownSkills: Skill[];
    allSkills: string[];
  };
  postFeedback: PostFeedbackFn;
};

type Props = {
  userId: number;
  courseId: string;
  itemId: string;
  children(data: SkillTagResultCallData): JSX.Element;
};

const SkillTagDataProvider = ({ userId, courseId, itemId, children }: Props) => (
  <Mutation<{}, PostFeedbackVariables> mutation={mutationPostFeedback}>
    {(postFeedback) => (
      <Query<{ getFeedback: {} }, GetUserFeedbackVariables>
        fetchPolicy="network-only"
        query={queryGetFeedback}
        variables={{
          userId,
          courseId,
          itemId,
        }}
      >
        {(getUserFeedback) => (
          <Query<GetSkillTagsResult, GetSkillTagsVariables>
            query={queryGetSkillTags}
            variables={{
              id: getAssignmentFeedbackId(courseId, itemId),
            }}
          >
            {(getSkillTagsResult) => {
              return (
                <Query<GetAllSkillResult> query={queryAllSkillTags}>
                  {(getAllSkillResult) => {
                    // Only keep the top 7 skills
                    const taggedSkills =
                      getSkillTagsResult.data?.getSkillTags?.elements[0]?.nostosSkillAssessmentValidation || [];
                    const shownSkills = taggedSkills
                      .sort((s1, s2) => s1.skillOrderDisplay - s2.skillOrderDisplay)
                      .slice(0, MAX_TAGS_TO_SHOW);

                    const getAllSkillTags = getAllSkillResult.data?.getAllSkillTags || [];
                    const allSkills = getAllSkillTags[0]?.skillName || [];

                    return children({
                      loading: getAllSkillResult.loading || getSkillTagsResult.loading || getUserFeedback.loading,
                      error: getAllSkillResult.error || getSkillTagsResult.error,
                      hasSubmittedBefore: !!getUserFeedback.data?.getFeedback,
                      data: {
                        allSkills,
                        shownSkills,
                      },
                      postFeedback,
                    });
                  }}
                </Query>
              );
            }}
          </Query>
        )}
      </Query>
    )}
  </Mutation>
);

export default SkillTagDataProvider;
