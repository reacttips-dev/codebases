import { SELECT_CARD, UNSELECT_CARD, RESET_CARDS_STATE } from "./types";

export const selectCard = (payload) => (dispatch) => {
  dispatch({
    type: SELECT_CARD,
    payload: payload,
  });
};

export const unSelectCard = (payload) => (dispatch) => {
  dispatch({
    type: UNSELECT_CARD,
    payload: payload,
  });
};

export const resetCardsSelection = (payload) => (dispatch) => {
  dispatch({
    type: RESET_CARDS_STATE,
  });
};
