'use es6';

import { Map as ImmutableMap } from 'immutable';
import { Promise } from '../lib/promise'; // this is a placeholder made necessary by the fact that
// getProperties is called at the pipeline level
// and throws if a property getter does not exist
// but the signature varies by data type, so shouldn't be called at that level

export var getPropertyGroups = function getPropertyGroups() {
  return Promise.resolve(ImmutableMap());
};
export var getProperties = function getProperties() {
  return Promise.resolve(ImmutableMap());
};