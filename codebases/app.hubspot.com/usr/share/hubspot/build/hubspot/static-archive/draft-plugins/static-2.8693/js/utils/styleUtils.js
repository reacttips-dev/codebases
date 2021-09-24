'use es6';

import { Modifier } from 'draft-js';
export var applyStyles = function applyStyles(contentState, selection, styles) {
  return styles.reduce(function (updatedContentState, style) {
    return Modifier.applyInlineStyle(updatedContentState, selection, style);
  }, contentState);
};
export var removeStyles = function removeStyles(contentState, selection, allInlineStyles) {
  return allInlineStyles.reduce(function (updatedContentState, style) {
    return Modifier.removeInlineStyle(updatedContentState, selection, style);
  }, contentState);
};