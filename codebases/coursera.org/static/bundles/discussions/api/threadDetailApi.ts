import { getQuestionApi, getAnswerApi } from 'bundles/discussions/api/forumApiChoiceUtil';
import URI from 'jsuri';
import {
  comments,
  defaults,
  gradedDiscussionPromptTypes,
  naptimeForumTypes,
  answerSorts,
} from 'bundles/discussions/constants';
import {
  getAnswerApiName,
  answerFields,
  answerIncludes,
  questionIncludes,
  questionFields,
  profilesFields,
} from 'bundles/discussions/utils/forumsApiUtils';
import { ForumTypeName } from 'bundles/discussions/lib/types';
import { CmlContent } from 'bundles/cml/types/Content';

const COMMENT_LIMIT = comments.limitPerPage;

enum ForumQuestionIdType {
  mentorForumQuestionId,
  groupForumQuestionId,
  courseItemForumQuestionId,
  courseForumQuestionId,
}

enum ParentForumAnswerIdType {
  parentCourseItemForumAnswerId,
  parentForumAnswerId,
}

export type optionsType = {
  data: {
    content: CmlContent;
    questionFollowOverrideOption: string;
    ForumQuestionIdType: string;
    ParentForumAnswerIdType: string;
  };
};

/*
 * 'contextId' is courseId for mentor and course forums, and groupId for group forums.
 */
const getAnswerParams = (forumType: ForumTypeName, userId: number | string, contextId: string, questionId: string) => {
  if (forumType === naptimeForumTypes.mentorForumType) {
    return {
      userMentorForumQuestionId: [userId, contextId, questionId].join('~'),
    };
  } else if (forumType === naptimeForumTypes.groupForumType) {
    return {
      userGroupForumQuestionId: [userId, contextId, questionId].join('~'),
    };
  } else if (forumType === naptimeForumTypes.gradedDiscussionPrompt) {
    return {
      userCourseItemQuestionId: [userId, questionId].join('~'),
    };
  }
  return {
    userCourseQuestionId: [userId, contextId, questionId].join('~'),
  };
};

const getByParentAnswerParams = (forumType: ForumTypeName, userForumAnswerId: string) => {
  if (forumType === naptimeForumTypes.mentorForumType) {
    return {
      userMentorForumAnswerId: userForumAnswerId,
    };
  } else if (forumType === naptimeForumTypes.groupForumType) {
    return {
      userGroupForumAnswerId: userForumAnswerId,
    };
  } else if (forumType === naptimeForumTypes.gradedDiscussionPrompt) {
    return {
      userCourseItemAnswerId: userForumAnswerId,
    };
  }
  return {
    userCourseForumAnswerId: userForumAnswerId,
  };
};

const getQuestionIncludesWithAnswers = (apiName: string) => ['posts', `${apiName}(${answerIncludes.join(',')})`];
const customQuestionFields = questionFields.concat(['forumAnswerBadgeTagMap']);

const getAllAnswerFields = (apiName: string) => [
  answerFields.join(','),
  `onDemandSocialProfiles.v1(${profilesFields.join(',')})`,
  `${apiName}(${answerFields.join(',')})`,
];

const getAllQuestionFields = (apiName: string) => [
  customQuestionFields.join(','),
  `onDemandSocialProfiles.v1(${profilesFields.join(',')})`,
  `${apiName}(${answerFields.join(',')})`,
];

export const getQuestion = ({
  questionId,
  userId,
  contextId,
  forumType,
  sort,
  page,
}: {
  questionId: string;
  userId: number | string;
  contextId: string;
  forumType: ForumTypeName;
  sort: defaults;
  page: number;
}) => {
  let includes = questionIncludes.slice();
  // if we are loading the first page with default sort, we can get it from this API instead of making two separate
  // calls.
  if (page === 1 && sort === defaults.detailSort) {
    includes = includes.concat(getQuestionIncludesWithAnswers(getAnswerApiName(forumType)));
  }

  const questionUri = new URI([userId, contextId, questionId].join('~'))
    .addQueryParam('includes', includes.join(','))
    .addQueryParam('fields', getAllQuestionFields(getAnswerApiName(forumType)).join(','));

  return getQuestionApi(forumType).get(questionUri.toString());
};

export const getAnswersWithComments = ({
  questionId,
  userId,
  contextId,
  forumType,
  sort,
  page,
  limit,
  includeDeleted,
  forumTypeSetting,
}: {
  questionId: string;
  userId: number | string;
  contextId: string;
  forumType: ForumTypeName;
  sort: defaults;
  page: number;
  limit: number;
  includeDeleted: boolean;
  forumTypeSetting: any;
}) => {
  const answerLimit = limit || 15;

  let forumQuestionParamQuery;
  let limitQuery;

  if (forumType === naptimeForumTypes.gradedDiscussionPrompt) {
    forumQuestionParamQuery =
      forumTypeSetting === gradedDiscussionPromptTypes.allPosts ? 'forumQuestionId' : 'parentAnswersWithUserActivity';
    limitQuery = 'childrenForumAnswersLimit';
  } else {
    forumQuestionParamQuery = 'byForumQuestionId';
    limitQuery = 'limit';
  }

  const uri = new URI()
    .addQueryParam('q', forumQuestionParamQuery)
    .addQueryParam('includeDeleted', includeDeleted ? 'true' : 'false')
    .addQueryParam('fields', getAllAnswerFields(getAnswerApiName(forumType)).join(','))
    .addQueryParam('includes', answerIncludes.join(','))
    .addQueryParam(limitQuery, answerLimit);

  const params = getAnswerParams(forumType, userId, contextId, questionId);
  Object.keys(params).forEach((key) => {
    uri.addQueryParam(key, params[key]);
  });

  if (sort) {
    uri.addQueryParam('sort', sort);
  }

  if (page - 1 > 0) {
    uri.addQueryParam('start', (page - 1) * limit);
  }

  return getAnswerApi(forumType).get(uri.toString());
};

export const getComments = ({
  userForumAnswerId,
  forumType,
  includeDeleted,
  startPage,
  endPage,
  commentLimit = COMMENT_LIMIT,
}: {
  userForumAnswerId: string;
  forumType: ForumTypeName;
  includeDeleted: boolean;
  startPage: number;
  endPage: number;
  commentLimit: number;
}) => {
  const parentAnswerIdQuery =
    forumType === naptimeForumTypes.gradedDiscussionPrompt ? 'parentAnswerId' : 'byParentForumAnswerId';

  const uri = new URI()
    .addQueryParam('q', parentAnswerIdQuery)
    .addQueryParam('includeDeleted', includeDeleted ? 'true' : 'false')
    .addQueryParam('fields', getAllAnswerFields(getAnswerApiName(forumType)).join(','))
    .addQueryParam('includes', answerIncludes.join(','))
    .addQueryParam('sort', answerSorts.newestSort)
    .addQueryParam('limit', (endPage - startPage + 1) * commentLimit);

  if (startPage) {
    uri.addQueryParam('start', (startPage - 1) * commentLimit);
  }

  const params = getByParentAnswerParams(forumType, userForumAnswerId);
  Object.keys(params).forEach((key) => {
    uri.addQueryParam(key, params[key]);
  });

  return getAnswerApi(forumType).get(uri.toString());
};

export const savePost = (options: optionsType, forumType: ForumTypeName) => {
  const uri = new URI()
    .addQueryParam('fields', getAllAnswerFields(getAnswerApiName(forumType)).join(','))
    .addQueryParam('includes', answerIncludes.join(','));
  return getAnswerApi(forumType).post(uri.toString(), options);
};
