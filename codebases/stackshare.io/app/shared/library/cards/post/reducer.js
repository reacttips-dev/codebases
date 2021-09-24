import {
  POST_TOGGLE_COMMENTS,
  POST_OPEN_COMPOSER,
  POST_CLOSE_COMPOSER,
  POST_SET_NEW_COMMENT,
  POST_ADD_ACTIVE_REPLY,
  POST_REMOVE_ACTIVE_REPLY,
  POST_TOGGLE_DELETE_MODAL,
  POST_TOGGLE_EDIT_MODE,
  POST_TOGGLE_EDIT_MODE_PERMALINK,
  POST_TOGGLE_SHOW_FIRST_RUN,
  POST_TOGGLE_SHOW_UPVOTE_HINT,
  POST_TOGGLE_SHOW_ADVICE_COMPOSER
} from './actions';
const reducer = (state, action) => {
  switch (action.type) {
    case POST_TOGGLE_COMMENTS: {
      return {...state, commentsVisible: action.visible};
    }
    case POST_OPEN_COMPOSER: {
      return {...state, composerExpanded: true};
    }
    case POST_CLOSE_COMPOSER: {
      return {...state, composerExpanded: false};
    }
    case POST_SET_NEW_COMMENT: {
      return {...state, newComment: action.newComment};
    }
    case POST_ADD_ACTIVE_REPLY: {
      let {activeReplies} = state;
      return {...state, activeReplies: activeReplies.add(action.key)};
    }
    case POST_REMOVE_ACTIVE_REPLY: {
      let {activeReplies} = state;
      activeReplies.delete(action.key);
      return {...state, activeReplies};
    }
    case POST_TOGGLE_DELETE_MODAL: {
      return {...state, showDeleteModal: action.visible};
    }
    case POST_TOGGLE_EDIT_MODE: {
      return {...state, editMode: action.value};
    }
    case POST_TOGGLE_EDIT_MODE_PERMALINK: {
      return {...state, editModePermalink: action.value};
    }
    case POST_TOGGLE_SHOW_FIRST_RUN: {
      return {...state, showFirstRun: action.value};
    }
    case POST_TOGGLE_SHOW_UPVOTE_HINT: {
      return {...state, showUpvoteHint: action.value};
    }
    case POST_TOGGLE_SHOW_ADVICE_COMPOSER: {
      return {...state, showAdviceComposer: action.value};
    }
    default:
      return state;
  }
};

export default reducer;
