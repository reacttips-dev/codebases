import URI from 'jsuri';
import { forumAnswerBadgeTagType } from 'bundles/discussions/constants';
import { getQuestionApi, getAnswerApi } from 'bundles/discussions/api/forumApiChoiceUtil';

const getApi = (post) => (post.type === 'question' ? getQuestionApi(post.forumType) : getAnswerApi(post.forumType));

export const editThread = (questionId, question, details, reason, dontNotify, forumType) => {
  const uri = new URI(questionId);

  return getQuestionApi(forumType).put(uri.toString(), {
    data: {
      content: { question, details },
      moderationSetting: reason
        ? {
            stateReason: reason,
            sendModerationNotificationToCreator: !dontNotify,
          }
        : undefined,
    },
  });
};

export const editReply = (reply, content) => {
  const uri = new URI(reply.id);

  return getAnswerApi(reply.forumType).put(uri.toString(), {
    data: {
      content,
      moderationSetting: reply.editReason
        ? {
            stateReason: reply.editReason,
            sendModerationNotificationToCreator: !reply.dontNotify,
          }
        : undefined,
    },
  });
};

export const deletePost = (post, reason, dontNotify) => {
  // TODO add noModerationEmail when that is added to the spec
  const uri = new URI(post.id);

  return getApi(post).delete(uri.toString(), {
    data: {
      moderationSetting: reason
        ? {
            stateReason: reason,
            sendModerationNotificationToCreator: !dontNotify,
          }
        : undefined,
    },
  });
};

export const undoDelete = (post, userId) => {
  const uri = new URI().addQueryParam('action', 'undoDelete').addQueryParam('id', post.id);

  return getApi(post).post(uri.toString(), { data: { userId } });
};

export const highlightPost = (post) => {
  const uri = new URI().addQueryParam('id', post.id).addQueryParam('action', 'addForumAnswerBadge');

  return getAnswerApi(post.forumType).post(uri.toString(), {
    data: { forumAnswerBadgeTagType },
  });
};

export const unhighlightPost = (post) => {
  const uri = new URI().addQueryParam('id', post.id).addQueryParam('action', 'removeForumAnswerBadge');

  return getAnswerApi(post.forumType).post(uri.toString(), {
    data: { forumAnswerBadgeTagType },
  });
};

export const moveQuestion = (questionId, courseId, forumId, forumType, userId) => {
  const uri = new URI().addQueryParam('action', 'move').addQueryParam('id', questionId);

  return getQuestionApi(forumType).post(uri.toString(), {
    data: {
      userId,
      moderationSetting: {
        sendModerationNotificationToCreator: true,
      },
      newCourseForumId: courseId + '~' + forumId,
    },
  });
};
