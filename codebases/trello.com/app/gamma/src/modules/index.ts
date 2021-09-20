/* eslint-disable import/no-default-export */
import { combineReducers } from 'redux';
import models from './state/models';
import ui from './state/ui';
import sockets from './sockets';

import { State } from './types';

export default combineReducers<State>({
  models,
  ui,
  sockets,
});
