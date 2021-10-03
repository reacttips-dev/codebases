import {
  GET_STORIES,
  RESET_STORIES,
  DELETE_STORY,
  GET_TEMPLATES,
  GET_TEMPLATES_VIEW_ALL,
  RESET_TEMPLATES_VIEW_ALL,
  RECENT_STORIES,
  DELETED_RECENT_STORY,
} from "../_actions/types";

export const initialState = {
  payload: [],
  templatePayload: [],
  loaded: false,
  loadMore: true,
  page: 1,
  templatesPage: 1,
  templatesViewAllPage: 1,
  recent: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case RESET_STORIES:
      return initialState;
    case GET_STORIES:
      let payload =
        state.page === 1
          ? action.payload
          : {
              ...action.payload,
              results: state.payload.results.concat(action.payload.results),
            };
      return {
        ...state,
        payload: payload,
        loaded: true,
        page: state.page + 1,
        loadMore: action.loadMore,
      };
    case DELETE_STORY:
      return {
        ...state,
        payload: {
          ...state.payload,
          count: state.payload.count - 1,
          results: state.payload.results.filter(
            (item) => item.id !== action.payload
          ),
        },
      };
    case GET_TEMPLATES_VIEW_ALL:
      let templatesViewAllpayload =
        state.page === 1
          ? action.payload
          : state.payload.concat(action.payload);
      return {
        payload: templatesViewAllpayload,
        loaded: true,
        loadMore: action.loadMore,
        templatesViewAllPage: state.templatesViewAllPage + 1,
        recent: state.recent,
      };
    case GET_TEMPLATES:
      let templatePayload = action.payload.map((element) => ({
        ...element,
        groupKey: action.groupKey,
      }));
      templatePayload =
        state.templatesPage === 1
          ? templatePayload
          : state.templatePayload.concat(templatePayload);
      return {
        ...state,
        templatePayload: templatePayload,
        loaded: true,
        loadMore: action.loadMore,
        templatesPage: state.templatesPage + 1,
      };
    case RESET_TEMPLATES_VIEW_ALL:
      return initialState;
    case RECENT_STORIES:
      return {
        ...state,
        recent: action.payload,
      };
    case DELETED_RECENT_STORY:
      return {
        ...state,
        recent: {
          ...state.recent,
          count: state.count - 1,
          results: state.recent.results.filter(
            (item) => item.id !== action.payload
          ),
        },
      };
    default:
      return state;
  }
}
