import React from 'react';
import store from 'js/lib/coursera.store';
import { AuthorProfile, Contributor } from 'bundles/discussions/lib/types';
import { extractForumPostId } from '../../../__helpers__/forumPostDataHelpers';
import { CreatorType, ForumPost, ForumPostLookupProps, ForumQuestionsV1Resource } from '../__types__';
import ForumPostModel from '../models/ForumQuestion';
import { getAssignmentPostItemLink } from 'bundles/discussions/utils/discussionsUrl';

type ForumQuestionsDataProviderResponse = {
  forumPost?: ForumPost & CreatorType;
  contributors?: Contributor[];
  replies?: (ForumPost & CreatorType)[];
};

function extractCreator(response: ForumQuestionsV1Resource, creatorId: number): AuthorProfile | undefined {
  if (!response.ForumQuestionsV1Resource.linked || !response.ForumQuestionsV1Resource.linked.onDemandSocialProfilesV1) {
    return undefined;
  }
  return response.ForumQuestionsV1Resource.linked?.onDemandSocialProfilesV1?.find(
    (contributor: AuthorProfile) => contributor && contributor.userId === creatorId
  );
}

function extractForumPost(response: ForumQuestionsV1Resource): ForumPost & { creator?: AuthorProfile } {
  const forumPost: ForumPost = response.ForumQuestionsV1Resource.elements[0];
  const creatorId = response.ForumQuestionsV1Resource.elements[0].creatorId;
  const deepLink = getAssignmentPostItemLink(forumPost.forumId, forumPost.forumQuestionId);
  const creator: AuthorProfile | undefined = extractCreator(response, creatorId);
  return { ...forumPost, creator, deepLink };
}

const parseTabsApiResponse = (response: ForumQuestionsV1Resource): ForumQuestionsDataProviderResponse => {
  if (!response || (response && !('ForumQuestionsV1Resource' in response))) {
    return {} as ForumQuestionsDataProviderResponse;
  }

  return {
    forumPost: extractForumPost(response),
  } as ForumQuestionsDataProviderResponse;
};

const ForumQuestionsProvider: React.FC<ForumPostLookupProps> = ({ forumQuestionId, children }) => {
  const { courseId, userId } = store.get('discussionsV2Context');
  return (
    <ForumPostModel.Query userId={userId} courseId={courseId} forumQuestionId={forumQuestionId}>
      {(props) => {
        const content: ForumPost = {
          content: { details: props.question?.content?.question },
          courseId,
          createdAt: 0,
          creatorId: 0,
          definition: { dtdId: props.question?.content?.question?.definition?.dtdId },
          id: props.questionId,
          forumQuestionId: forumQuestionId,
          showEditor: props.showEditor,
          isFlagged: false,
          isUpvoted: false,
          totalAnswerCount: 0,
          typeName: 'cml',
          upvoteCount: 0,
          userId: 0,
          question: props.question?.content?.question?.definition?.value,
          dontNotify: props.dontNotify,
          editReason: props.editReason,
          questionId: extractForumPostId(forumQuestionId),
        };

        const forumQuestion = parseTabsApiResponse({
          ForumQuestionsV1Resource: {
            elements: [content],
            linked: { onDemandCourseForumAnswersV1: [], onDemandSocialProfilesV1: [] },
          },
        });
        return children({ loading: false, error: undefined, data: forumQuestion });
      }}
    </ForumPostModel.Query>
  );
};
export default ForumQuestionsProvider;
