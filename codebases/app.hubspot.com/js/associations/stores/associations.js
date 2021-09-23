'use es6';

import { combineReducers } from 'redux';
import updateUASAssociations from './updateUASAssociations';
export default combineReducers({
  updateUASAssociations: updateUASAssociations
});