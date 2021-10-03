import {
  SELECT_CARD,
  UNSELECT_CARD,
  RESET_CARDS_STATE,
} from "../_actions/types";

export const initialState = {
  isPanelShowing: false,
  selectedCards: [],
};

export default function (state = initialState, action) {
  let selectedCards = [...state.selectedCards];

  switch (action.type) {
    case RESET_CARDS_STATE:
      return initialState;
    case SELECT_CARD:
      selectedCards = [...selectedCards, action.payload];
      return {
        ...state,
        isPanelShowing: selectedCards.length > 0,
        selectedCards,
      };
    case UNSELECT_CARD:
      if (action.payload.id) {
        selectedCards = selectedCards.filter(
          (item) => item.id !== action.payload.id
        );
      } else if (action.payload.content.meta.id) {
        selectedCards = selectedCards.filter(
          (item) => item.content.meta.id !== action.payload.content.meta.id
        );
      }
      return {
        ...state,
        isPanelShowing: selectedCards.length > 0,
        selectedCards,
      };
    default:
      return state;
  }
}
