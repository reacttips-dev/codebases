'use es6';

import { combineReducers } from 'redux';
import decks from './decks';
import folders from './folders';
import permissions from './permissions';
import properties from './properties';
import template from './template';
import templateUsage from './templateUsage';
export default combineReducers({
  decks: decks,
  folders: folders,
  permissions: permissions,
  properties: properties,
  template: template,
  templateUsage: templateUsage
});