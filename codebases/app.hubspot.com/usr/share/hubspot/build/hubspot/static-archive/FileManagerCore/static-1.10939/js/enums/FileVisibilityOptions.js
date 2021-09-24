'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _FileVisibilityOption, _FileVisibilityOption2;

var VISIBLE_TO_ALL = 'VISIBLE_TO_ALL';
var VISIBLE_TO_USERS_HIDDEN_FROM_SEARCH_ENGINES = 'VISIBLE_TO_USERS_HIDDEN_FROM_SEARCH_ENGINES';
var HIDDEN_FROM_ALL = 'HIDDEN_FROM_ALL';
export var FileVisibilityOptionNames = (_FileVisibilityOption = {}, _defineProperty(_FileVisibilityOption, VISIBLE_TO_ALL, VISIBLE_TO_ALL), _defineProperty(_FileVisibilityOption, VISIBLE_TO_USERS_HIDDEN_FROM_SEARCH_ENGINES, VISIBLE_TO_USERS_HIDDEN_FROM_SEARCH_ENGINES), _defineProperty(_FileVisibilityOption, HIDDEN_FROM_ALL, HIDDEN_FROM_ALL), _FileVisibilityOption);
export var FileVisibilityOptions = (_FileVisibilityOption2 = {}, _defineProperty(_FileVisibilityOption2, VISIBLE_TO_ALL, {
  allow_anonymous_access: true,
  is_indexable: true
}), _defineProperty(_FileVisibilityOption2, VISIBLE_TO_USERS_HIDDEN_FROM_SEARCH_ENGINES, {
  allow_anonymous_access: true,
  is_indexable: false
}), _defineProperty(_FileVisibilityOption2, HIDDEN_FROM_ALL, {
  allow_anonymous_access: false,
  is_indexable: false
}), _FileVisibilityOption2);