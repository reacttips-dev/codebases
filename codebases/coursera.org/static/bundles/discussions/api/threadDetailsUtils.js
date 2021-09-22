import Q from 'q';
import URI from 'jsuri';
import API from 'bundles/phoenix/lib/apiWrapper';
import { getQuestionApi } from 'bundles/discussions/api/forumApiChoiceUtil';

const answerPositionAPI = API('/api/courseForumAnswerPositions.v1/', {
  type: 'rest',
});

export const closeThread = (questionId, forumType) => {
  const uri = new URI().addQueryParam('action', 'close').addQueryParam('id', questionId);
  return getQuestionApi(forumType).post(uri.toString(), {
    data: {
      moderationSetting: {
        stateReason: 'inappropriate',
        sendModerationNotificationToCreator: false,
      },
    },
  });
};

export const uncloseThread = (questionId, forumType) => {
  const uri = new URI().addQueryParam('action', 'undoClose').addQueryParam('id', questionId);
  return getQuestionApi(forumType).post(uri.toString());
};

export const pinThread = (questionId, forumType) => {
  const uri = new URI().addQueryParam('action', 'pin').addQueryParam('id', questionId);
  return getQuestionApi(forumType).post(uri.toString());
};

export const unpinThread = (questionId, forumType) => {
  const uri = new URI().addQueryParam('action', 'unpin').addQueryParam('id', questionId);
  return getQuestionApi(forumType).post(uri.toString());
};

export const getAnswerPosition = (courseForumAnswerId, sort, pageSize) => {
  const uri = new URI()
    .addQueryParam('q', 'position')
    .addQueryParam('id', courseForumAnswerId)
    .addQueryParam('sort', sort);
  return Q(answerPositionAPI.get(uri.toString())).then((resp) => {
    const position = resp.elements.length > 0 ? resp.elements[0].position : -1;
    const pageNumber = position >= 0 ? Math.floor(position / pageSize) + 1 : 1;
    return pageNumber;
  });
};
