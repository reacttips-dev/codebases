'use es6';

import { Map as ImmutableMap } from 'immutable';
import uniqueId from 'transmute/uniqueId';
import * as Atom from 'atom';
export var TOKEN_PREFIX = 'unsaved-';
export var universalEditableAreas = Atom.atom(ImmutableMap());
export var previewEditableAreas = Atom.atom(ImmutableMap());
export function register(editableAreas, subscription) {
  var unsavedToken = uniqueId(TOKEN_PREFIX);
  Atom.swap(editableAreas, function (current) {
    return current.set(unsavedToken, subscription);
  });
  return unsavedToken;
}
export function update(editableAreas, unsavedToken, subscription) {
  Atom.swap(editableAreas, function (current) {
    return current.set(unsavedToken, subscription);
  });
  return unsavedToken;
}
export function unregister(editableAreas, unsavedToken) {
  Atom.swap(editableAreas, function (current) {
    return current.remove(unsavedToken);
  });
}