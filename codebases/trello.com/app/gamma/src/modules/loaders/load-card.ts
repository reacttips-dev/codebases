import API from 'app/gamma/src/api';
import { Action, actionCreator } from '@trello/redux';

import { CardResponse } from 'app/gamma/src/types/responses';
import { StandardThunkAction } from '../../types';
import { BOARD_FIELDS_MINIMAL, CARD_FIELDS_MINIMAL } from './fields';

import { loadBoard } from './load-board';
import { Dispatch } from 'app/gamma/src/types';

// Action types
export const LOAD_CARD_REQUEST = Symbol('loaders/LOAD_CARD_REQUEST');
export const LOAD_CARD_SUCCESS = Symbol('loaders/LOAD_CARD_SUCCESS');
export const LOAD_CARD_ERROR = Symbol('loaders/LOAD_CARD_ERROR');

export type LoadCardRequestAction = Action<typeof LOAD_CARD_REQUEST, string>;
export type LoadCardSuccessAction = Action<
  typeof LOAD_CARD_SUCCESS,
  CardResponse
>;
export type LoadCardErrorAction = Action<typeof LOAD_CARD_ERROR, Error>;

// Action creators
const loadCardRequest = actionCreator<LoadCardRequestAction>(LOAD_CARD_REQUEST);
const loadCardSuccess = actionCreator<LoadCardSuccessAction>(LOAD_CARD_SUCCESS);
const loadCardError = actionCreator<LoadCardErrorAction>(LOAD_CARD_ERROR);

const CARD_ACTIONS = [
  'addAttachmentToCard',
  'addChecklistToCard',
  'addMemberToCard',
  'commentCard',
  'convertToCardFromCheckItem',
  'copyCard',
  'copyCommentCard',
  'createCard',
  'deleteAttachmentFromCard',
  'emailCard',
  'moveCardFromBoard',
  'moveCardToBoard',
  'removeChecklistFromCard',
  'removeMemberFromCard',
  'updateCard:closed',
  'updateCard:due',
  'updateCard:idList',
  'updateCheckItemStateOnCard',
].join(',');

export const loadCard = (
  idCard: string,
  shouldLoadBoard: boolean,
): StandardThunkAction => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(loadCardRequest(idCard));

      const card = await API.client.rest.get<CardResponse>(`cards/${idCard}`, {
        query: {
          actions: CARD_ACTIONS,
          actions_display: true,
          actions_limit: 50,
          attachments: true,
          checklists: 'all',
          fields: CARD_FIELDS_MINIMAL,
        },
      });

      if (shouldLoadBoard) {
        dispatch(loadBoard(card.idBoard));
      }

      dispatch(loadCardSuccess(card));
    } catch (err) {
      dispatch(loadCardError(err));
    }
  };
};

export const loadCanonicalCard = (idCard: string): StandardThunkAction => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(loadCardRequest(idCard));

      const card = await API.client.rest.get<CardResponse>(`cards/${idCard}`, {
        query: {
          board: true,
          board_fields: BOARD_FIELDS_MINIMAL,
          customFields: true,
          customFieldItems: true,
          list: true,
        },
      });

      dispatch(loadCardSuccess(card));
    } catch (err) {
      dispatch(loadCardError(err));
    }
  };
};
