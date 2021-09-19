import {
  ADD_OOS_ITEM,
  ADD_TO_HEART_ID_LIST,
  CLEAR_HEART_LIST,
  CLEAR_HEARTS,
  DELETE_IMAGE,
  RECEIVE_ALL_LISTS,
  RECEIVE_COLLECTION_PRODUCT_DETAIL,
  RECEIVE_HEARTS,
  RECEIVE_HEARTS_IDS,
  RECEIVE_LIST_HEARTS,
  RECEIVE_LIST_INFO,
  RECEIVE_SPECIFIC_ITEMID_LISTS,
  REMOVE_FROM_HEART_ID_LIST,
  REMOVE_HEARTS,
  TOGGLE_HEARTING_LOGIN_MODAL,
  TOGGLE_INFLUENCER_COLLECTION_VISIBILITY,
  UPDATE_LIST
} from 'constants/reduxActions';

export const initialState = {
  hearts: null,
  oosHearts: [],
  heartsStyleIds: [],
  collections: [],
  heartLoginPrompt: { isOpen: false, id: null }
};

export default function hearts(state = initialState, action) {
  const {
    type,
    hearts,
    heartsStyleIds,
    nextPageToken,
    collectionNextPageToken,
    concat,
    styleId,
    itemId,
    open,
    id,
    list,
    lists,
    itemIdLists,
    listId,
    colorId,
    product,
    toPublic,
    itemIdsToRemove
  } = action;

  switch (type) {
    case RECEIVE_HEARTS:
      const newHearts = concat
        ? [...state.hearts, ...hearts]
        : hearts;
      const heartsFilteredOOS = newHearts.filter(({ quantity }) => quantity);
      return {
        ...state,
        hearts: newHearts,
        heartsStyleIds: newHearts.map(product => product.styleId),
        heartsFilteredOOS, // filtered out "Out of Stock" items
        heartsFilteredOOSAndAsin: heartsFilteredOOS.filter(({ asin }) => asin), // filtered out "Out of Stock" and "No Asin"
        nextPageToken
      };
    case RECEIVE_LIST_HEARTS:
      return {
        ...state,
        collections: state.collections.concat({
          listId,
          hearts,
          nextPageToken
        })
      };
    case CLEAR_HEART_LIST:
      return {
        ...state, collections: []
      };
    case RECEIVE_HEARTS_IDS:
      return {
        ...state,
        heartsStyleIds: heartsStyleIds.map(product => product.itemId)
      };
    case REMOVE_FROM_HEART_ID_LIST:
      return {
        ...state,
        heartsStyleIds: state.heartsStyleIds.filter(item => item !== styleId)
      };
    case ADD_TO_HEART_ID_LIST:
      return {
        ...state,
        heartsStyleIds: [ styleId, ...state.heartsStyleIds ]
      };
    case ADD_OOS_ITEM:
      return {
        ...state,
        oosHearts: state.oosHearts.concat(itemId)
      };
    case CLEAR_HEARTS:
      return {
        ...state,
        hearts : null,
        heartsStyleIds: null,
        nextPageToken: null,
        list: {}
      };
    case TOGGLE_HEARTING_LOGIN_MODAL:
      return {
        ...state,
        heartLoginPrompt: {
          isOpen: open,
          // Maintain the old ID even when closed. That way we can avoid a pesky race condition.
          // https://github01.zappos.net/mweb/marty/issues/11608
          id: id || state.heartLoginPrompt.id
        }
      };
    case RECEIVE_LIST_INFO:
      const { metadata = {} } = list;
      const { headerLayout } = metadata;
      return {
        ...state,
        list: {
          ...list,
          metadata: {
            ...metadata,
            headerLayout: headerLayout !== 0 ? headerLayout : 1
          }
        }
      };
    case RECEIVE_COLLECTION_PRODUCT_DETAIL:
      const newState = Object.assign({}, state, product, {
        colorId,
        selectedSizing: {},
        validation: { dimensions: {} }
      });

      for (const dim of product.detail.sizing.dimensions) {
        if (dim.units[0].values.length === 1) {
          newState.selectedSizing[`d${dim.id}`] = dim.units[0].values[0].id;
        }
      }

      return newState;
    case RECEIVE_ALL_LISTS:
      const newLists = concat ? { lists: [...state.lists, ...lists ], collectionNextPageToken } : { lists, collectionNextPageToken };
      return { ...state, ...newLists };
    case RECEIVE_SPECIFIC_ITEMID_LISTS:
      return { ...state, itemIdLists: [...itemIdLists.ids] };
    case TOGGLE_INFLUENCER_COLLECTION_VISIBILITY:
      let updatedState = { ...state };
      const { list: currentList, lists: currentLists } = updatedState;
      if (currentList !== undefined && currentList.listId === listId) { // Action from Collection Page
        updatedState = {
          ...updatedState,
          list: {
            ...currentList,
            metadata: {
              ...currentList.metadata,
              public: toPublic
            }
          }
        };
      }

      if (Array.isArray(currentLists) && currentLists.length) { // Action from Collections Page
        const index = currentLists.findIndex(list => list.listId === listId);

        if (index !== -1) {
          const updatedListItem = {
            ...currentLists[index],
            metadata: {
              ...currentLists[index].metadata,
              public: toPublic
            }
          };

          const updatedLists = [
            ...currentLists.slice(0, index),
            updatedListItem,
            ...currentLists.slice(index + 1)
          ];

          updatedState = {
            ...updatedState,
            lists: updatedLists
          };
        }
      }
      return updatedState;

    case UPDATE_LIST:
      let revisedState = { ...state };
      revisedState = {
        ...revisedState,
        list: {
          ...state.list,
          ...list,
          metadata: {
            ...state.list.metadata,
            ...list.metadata
          }
        }
      };

      // Updating 'lists' field as well for consistency
      const { lists: collectionLists } = revisedState;
      if (Array.isArray(collectionLists) && collectionLists.length) {
        const index = collectionLists.findIndex(collection => collection.listId === list.listId);

        if (index !== -1) {
          const updatedListItem = {
            ...collectionLists[index],
            ...list,
            metadata: {
              ...collectionLists[index].metadata,
              ...list.metadata
            }
          };

          const updatedLists = [
            ...collectionLists.slice(0, index),
            updatedListItem,
            ...collectionLists.slice(index + 1)
          ];

          revisedState = {
            ...revisedState,
            lists: updatedLists
          };
        }
      }
      return revisedState;
    case DELETE_IMAGE:
      return {
        ...state,
        list: {
          ...state.list,
          metadata: {
            ...state.list.metadata,
            images: []
          }
        }
      };
    case REMOVE_HEARTS:
      const updatedHearts = state.hearts.filter(({ itemId }) => !itemIdsToRemove.includes(itemId));
      return {
        ...state,
        hearts: updatedHearts
      };
    default:
      return state;
  }
}
