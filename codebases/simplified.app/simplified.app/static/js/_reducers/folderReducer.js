import {
  SET_FOLDERS,
  RESET_FOLDERS_STATE,
  ADD_FOLDER,
  RENAME_FOLDER,
  REMOVE_FOLDER,
  REMOVE_FOLDER_ITEM,
  ADD_FOLDER_ITEMS,
} from "../_actions/types";

export const initialState = {
  folders: [],
  hasMore: null,
  loaded: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case RESET_FOLDERS_STATE:
      return {
        ...initialState,
      };
    case SET_FOLDERS:
      return {
        ...state,
        hasMore: action.payload.hasMore,
        folders: [...action.payload.data],
        loaded: true,
      };
    case ADD_FOLDER:
      return {
        ...state,
        folders: [...state.folders, action.payload],
        loaded: true,
      };
    case ADD_FOLDER_ITEMS:
      return {
        ...state,
        folders: state.folders.map((folder) => {
          if (folder.id === action.payload.folderId) {
            folder.story_contents = [
              ...folder.story_contents,
              ...action.payload.items,
            ];
          }
          return folder;
        }),
        loaded: true,
      };
    case RENAME_FOLDER:
      return {
        ...state,
        folders: state.folders.map((folder) => {
          if (folder.id === action.payload.id) {
            folder.name = action.payload.name;
          }
          return folder;
        }),
        loaded: true,
      };
    case REMOVE_FOLDER:
      return {
        ...state,
        folders: state.folders.filter(
          (folder) => folder.id !== action.payload.id
        ),
        loaded: true,
      };
    case REMOVE_FOLDER_ITEM:
      return {
        ...state,
        folders: state.folders.map((folder) => {
          if (folder.id === action.payload.folderId) {
            folder.story_contents = folder.story_contents.filter(
              (content) => content.id !== action.payload.contentId
            );
            folder.asset_contents = folder.asset_contents.filter(
              (content) => content.id !== action.payload.contentId
            );
            folder.template_contents = folder.template_contents.filter(
              (content) => content.id !== action.payload.contentId
            );
            folder.component_contents = folder.component_contents.filter(
              (content) => content.id !== action.payload.contentId
            );
          }
          return folder;
        }),
        loaded: true,
      };
    default:
      return state;
  }
}
