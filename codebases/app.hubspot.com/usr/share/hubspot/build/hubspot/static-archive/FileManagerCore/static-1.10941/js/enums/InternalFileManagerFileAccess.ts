import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _FileAccessValues;

// *****PROTECTED*******
// DO NOT USE OUTSIDE OF FILE MANAGER CODE
export var VISIBLE_IN_APP_PUBLIC_TO_ALL_INDEXABLE = 'VISIBLE_IN_APP_PUBLIC_TO_ALL_INDEXABLE';
export var VISIBLE_IN_APP_PUBLIC_TO_ALL_NOT_INDEXABLE = 'VISIBLE_IN_APP_PUBLIC_TO_ALL_NOT_INDEXABLE';
export var VISIBLE_IN_APP_PRIVATE_NOT_INDEXABLE = 'VISIBLE_IN_APP_PRIVATE_NOT_INDEXABLE';
export var HIDDEN_IN_APP_PRIVATE_NOT_INDEXABLE = 'HIDDEN_IN_APP_PRIVATE_NOT_INDEXABLE';
export var HIDDEN_IN_APP_PUBLIC_TO_ALL_INDEXABLE = 'HIDDEN_IN_APP_PUBLIC_TO_ALL_INDEXABLE';
export var HIDDEN_IN_APP_PUBLIC_TO_ALL_NOT_INDEXABLE = 'HIDDEN_IN_APP_PUBLIC_TO_ALL_NOT_INDEXABLE';
export var HiddenInAppFileAccessList = [HIDDEN_IN_APP_PUBLIC_TO_ALL_INDEXABLE, HIDDEN_IN_APP_PUBLIC_TO_ALL_NOT_INDEXABLE, HIDDEN_IN_APP_PRIVATE_NOT_INDEXABLE];
export var PrivateFileAccess = [VISIBLE_IN_APP_PRIVATE_NOT_INDEXABLE, HIDDEN_IN_APP_PRIVATE_NOT_INDEXABLE];
export var FileAccessValues = (_FileAccessValues = {}, _defineProperty(_FileAccessValues, VISIBLE_IN_APP_PUBLIC_TO_ALL_INDEXABLE, {
  allowsAnonymousAccess: true,
  isIndexable: true,
  hidden: false
}), _defineProperty(_FileAccessValues, VISIBLE_IN_APP_PUBLIC_TO_ALL_NOT_INDEXABLE, {
  allowsAnonymousAccess: true,
  isIndexable: false,
  hidden: false
}), _defineProperty(_FileAccessValues, VISIBLE_IN_APP_PRIVATE_NOT_INDEXABLE, {
  allowsAnonymousAccess: false,
  isIndexable: false,
  hidden: false
}), _defineProperty(_FileAccessValues, HIDDEN_IN_APP_PRIVATE_NOT_INDEXABLE, {
  allowsAnonymousAccess: false,
  isIndexable: false,
  hidden: true
}), _defineProperty(_FileAccessValues, HIDDEN_IN_APP_PUBLIC_TO_ALL_INDEXABLE, {
  allowsAnonymousAccess: true,
  isIndexable: true,
  hidden: true
}), _defineProperty(_FileAccessValues, HIDDEN_IN_APP_PUBLIC_TO_ALL_NOT_INDEXABLE, {
  allowsAnonymousAccess: true,
  isIndexable: false,
  hidden: true
}), _FileAccessValues);