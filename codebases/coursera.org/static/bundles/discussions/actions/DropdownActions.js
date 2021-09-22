import {
  editThread as editThreadApi,
  editReply as editReplyApi,
  deletePost as deletePostApi,
  undoDelete as undoDeleteApi,
  highlightPost as highlightPostApi,
  unhighlightPost as unhighlightPostApi,
} from 'bundles/discussions/api/threadActionsApiUtil';
import { flagPost as flagPostApi, unflagPost as unflagPostApi } from 'bundles/discussions/api/flagApi';

export const editThread = (
  actionContext,
  { id, questionId, question, details, reason, handleSuccess, handleFailure, dontNotify, forumType }
) => {
  editThreadApi(id, question, details, reason, dontNotify, forumType)
    .then((resp) => {
      handleSuccess(resp);
      actionContext.dispatch('EDIT_THREAD', { questionId, question, details });
    })
    .fail(handleFailure)
    .done();
};

export const editReply = (actionContext, { reply, content, handleFailure, onSuccess }) => {
  editReplyApi(reply, content)
    .then((resp) => {
      actionContext.dispatch('EDIT_REPLY', { reply, content });
      actionContext.dispatch('HIDE_REPLY_EDITOR', { reply });
      onSuccess();
    })
    .fail(handleFailure)
    .done();
};

export const showReplyEditor = (actionContext, { reply, reason, dontNotify }) => {
  actionContext.dispatch('SHOW_REPLY_EDITOR', { reply, reason, dontNotify });
};

export const hideReplyEditor = (actionContext, { reply }) => {
  actionContext.dispatch('HIDE_REPLY_EDITOR', { reply });
};

export const deletePost = (actionContext, { post, reason, handleSuccess, handleFailure, dontNotify }) => {
  deletePostApi(post, reason, dontNotify)
    .then((resp) => {
      handleSuccess(resp);
      if (reason) {
        actionContext.dispatch('SOFT_DELETE_POST', { post });
      } else {
        actionContext.dispatch('DELETE_POST', { post });
      }
    })
    .fail(handleFailure)
    .done();
};

export const undoDelete = (actionContext, { post, handleFailure, onSuccess }) => {
  undoDeleteApi(post)
    .then(() => {
      actionContext.dispatch('UNDO_DELETE', { post });
      onSuccess();
    })
    .fail(handleFailure)
    .done();
};

export const flagPost = (actionContext, { post, handleSuccess, handleFailure }) => {
  flagPostApi(post)
    .then(() => {
      actionContext.dispatch('FLAG_POST', { post });
      handleSuccess();
    })
    .fail(handleFailure)
    .done();
};

export const unflagPost = (actionContext, { post, handleSuccess, handleFailure }) => {
  unflagPostApi(post)
    .then((resp) => {
      actionContext.dispatch('UNFLAG_POST', { post });
      handleSuccess();
    })
    .fail(handleFailure)
    .done();
};

export const highlightPost = (actionContext, { post }) => {
  highlightPostApi(post)
    .then(() => {
      actionContext.dispatch('HIGHLIGHT', { post });
    })
    .done();
};

export const unhighlightPost = (actionContext, { post }) => {
  unhighlightPostApi(post)
    .then(() => {
      actionContext.dispatch('UNHIGHLIGHT', { post });
    })
    .done();
};

export const showAdminDetails = (actionContext, { post }) => {
  actionContext.dispatch('SHOW_ADMIN_DETAILS', { post });
};

export const hideAdminDetails = (actionContext, { post }) => {
  actionContext.dispatch('HIDE_ADMIN_DETAILS', { post });
};
