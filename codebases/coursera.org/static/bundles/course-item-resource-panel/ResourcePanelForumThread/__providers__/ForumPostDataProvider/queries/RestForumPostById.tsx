import React from 'react';
import store from 'js/lib/coursera.store';
import { getAssignmentPostItemLink } from 'bundles/course-item-resource-panel/ResourcePanelForumThread/__helpers__/forumLinkHelpers';
import {
  AuthorProfile,
  Contributor,
  CreatorType,
  ForumPost,
  ForumPostLookupProps,
  ForumQuestionsV1Resource,
} from '../__types__';
import ForumPostModel from '../models/ForumQuestion';

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

function extractForumPost(response: ForumQuestionsV1Resource): ForumPost & CreatorType {
  const forumPost: ForumPost = response.ForumQuestionsV1Resource.elements[0];
  const creatorId = response.ForumQuestionsV1Resource.elements[0].creatorId;
  const deepLink = getAssignmentPostItemLink(forumPost.forumId, forumPost.forumQuestionId);
  return { ...forumPost, creator: extractCreator(response, creatorId), deepLink };
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
  const { courseId, userId } = store.get('resourcePanelContext');
  return (
    <ForumPostModel.Query userId={userId} courseId={courseId} forumQuestionId={forumQuestionId}>
      {({ loading, error, data }) => {
        if (loading || error) return children({ loading, error });

        if (data) {
          const resourcePanelTabs = parseTabsApiResponse(data);
          return children({ loading: false, error, data: resourcePanelTabs });
        } else {
          return null;
        }
      }}
    </ForumPostModel.Query>
  );
};
export default ForumQuestionsProvider;
