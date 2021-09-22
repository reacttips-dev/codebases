import Q from 'q';
import URI from 'jsuri';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import { questionSorts } from 'bundles/discussions/constants';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import { getQuestionApi } from 'bundles/discussions/api/forumApiChoiceUtil';
import {
  getParamsForForumType,
  questionFields,
  questionIncludes,
  profilesFields,
  /* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
} from 'bundles/discussions/utils/forumsApiUtils';

/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import OnDemandCourseForumsV1 from 'bundles/naptimejs/resources/onDemandCourseForums.v1';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import OnDemandMentorForumsV1 from 'bundles/naptimejs/resources/onDemandMentorForums.v1';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import GroupForumsV1 from 'bundles/naptimejs/resources/groupForums.v1';
import { ForumTypeName } from 'bundles/discussions/lib/types';

const allQuestionFields = [questionFields.join(','), `onDemandSocialProfiles.v1(${profilesFields.join(',')})`].join(
  ','
);
type ForumTypes = OnDemandCourseForumsV1 | OnDemandMentorForumsV1 | GroupForumsV1;

export const load = ({
  sort,
  answered,
  pageNum,
  filterQueryString,
  limit = 15,
  forumType,
  forumId,
  userId,
  creatorId,
  includeDeleted,
}: {
  sort: questionSorts;
  answered: boolean;
  pageNum: number;
  filterQueryString: string;
  limit: number;
  forumType: ForumTypes;
  forumId: string;
  userId: number;
  creatorId: string;
  includeDeleted: boolean;
}) => {
  const uri = new URI()
    .addQueryParam('userId', userId)
    .addQueryParam('shouldAggregate', 'true')
    .addQueryParam('includeDeleted', includeDeleted ? 'true' : 'false')
    .addQueryParam('sort', sort || questionSorts?.mostRecentSort)
    .addQueryParam('fields', allQuestionFields)
    .addQueryParam('includes', questionIncludes.join(','))
    .addQueryParam('limit', limit);

  if (answered) {
    uri.addQueryParam('answered', answered);
  }
  const additionalParams = getParamsForForumType(forumType, forumId);
  Object.keys(additionalParams).forEach((key) => {
    uri.addQueryParam(key, additionalParams[key]);
  });

  if (filterQueryString) {
    uri.addQueryParam('sessionFilter', filterQueryString);
  }

  if (pageNum - 1 > 0) {
    uri.addQueryParam('start', (pageNum - 1) * limit);
  }

  if (creatorId) {
    uri.addQueryParam('creatorId', creatorId);
  }

  return Q(getQuestionApi(forumType).get(uri.toString()));
};

export const add = (options: any, forumType: ForumTypes) => {
  const uri = new URI()
    .addQueryParam('fields', allQuestionFields)
    .addQueryParam('includes', questionIncludes.join(','));
  return Q(getQuestionApi(forumType).post(uri.toString(), { data: options }));
};

export const getQuestionsById = ({ questionIds, forumType }: { questionIds: string[]; forumType: ForumTypeName }) => {
  const uri = new URI().addQueryParam('ids', questionIds.join(',')).addQueryParam('fields', 'content').toString();

  return Q(getQuestionApi(forumType).get(uri));
};
