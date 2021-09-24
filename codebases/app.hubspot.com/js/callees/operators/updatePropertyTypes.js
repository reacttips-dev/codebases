'use es6';

import PropTypes from 'prop-types';
export var EDITING = 'EDITING';
export var ADDING = 'ADDING';
export var getIsEditing = function getIsEditing(type) {
  return type === EDITING;
};
export var UpdateTypePropType = PropTypes.oneOf([EDITING, ADDING]);