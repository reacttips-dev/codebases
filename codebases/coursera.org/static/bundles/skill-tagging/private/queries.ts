import gql from 'graphql-tag';
import { Skill } from '../components/SkillTagList';

/* eslint-disable graphql/template-strings */

const queryGetSkillTags = gql`
  query getSkillTags($id: String!) {
    getSkillTags(id: $id, input: {})
      @rest(
        type: "getSkillTags"
        path: "skillTags.v1?q=getSkillTags&skillTagValidationId={args.id}&fields=nostosSkillAssessmentValidation"
        method: "GET"
      ) {
      elements
    }
  }
`;
const queryAllSkillTags = gql`
  query getAllSkillTags {
    getAllSkillTags(input: {})
      @rest(type: "getAllSkillTags", path: "skillTags.v1?action=getAllSkillTags", method: "POST") {
      skillName
    }
  }
`;
const queryGetFeedback = gql`
  query getFeedback($userId: Integer!, $courseId: String!, $itemId: String!) {
    getFeedback(userId: $userId, courseId: $courseId, itemId: $itemId)
      @rest(
        type: "getFeedback"
        path: "skillTagsFeedback.v1/ITEM_SPECIFIC~{args.userId}!~{args.courseId}!~{args.itemId}"
        method: "GET"
      ) {
      elements
    }
  }
`;

export type GetUserFeedbackVariables = {
  userId: number;
  courseId: string;
  itemId: string;
};

export type GetSkillTagsVariables = {
  id: string;
};

export type GetSkillTagsResult = {
  getSkillTags?: {
    elements: {
      nostosSkillAssessmentValidation: Skill[];
    }[];
  };
};

export type GetAllSkillResult = {
  getAllSkillTags: { skillName: string[] }[];
};

export { queryGetSkillTags, queryAllSkillTags, queryGetFeedback };
