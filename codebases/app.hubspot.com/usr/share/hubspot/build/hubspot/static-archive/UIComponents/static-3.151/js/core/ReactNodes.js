'use es6';

import getComponentName from 'react-utils/getComponentName';
/**
 * @param {ReactElement} node
 * @param {RegExp} regex
 * @returns {Boolean} - true if the node has a displayName that matches the given regex
 */

export var nodeDisplayNameMatches = function nodeDisplayNameMatches(node, regex) {
  return !!(node && getComponentName(node.type).match(regex));
};