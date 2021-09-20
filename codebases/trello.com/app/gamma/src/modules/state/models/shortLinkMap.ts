/* eslint-disable import/no-default-export */
import { createReducer } from '@trello/redux';

export interface ShortLinkMapState {
  [id: string]: string;
}

const initialState: ShortLinkMapState = {};

export default createReducer(initialState, {});
