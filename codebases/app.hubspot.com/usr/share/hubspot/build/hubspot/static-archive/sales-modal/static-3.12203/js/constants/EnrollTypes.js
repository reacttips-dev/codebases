'use es6';

import PropTypes from 'prop-types';
export var BULK_ENROLL = 'BULK_ENROLL';
export var EDIT = 'EDIT';
export var REENROLL = 'REENROLL';
export var RESUME = 'RESUME';
export var SINGLE_ENROLL = 'SINGLE_ENROLL';
export var VIEW = 'VIEW';
export var EnrollTypes = {
  BULK_ENROLL: BULK_ENROLL,
  EDIT: EDIT,
  REENROLL: REENROLL,
  RESUME: RESUME,
  SINGLE_ENROLL: SINGLE_ENROLL,
  VIEW: VIEW
};
export var EnrollTypePropType = PropTypes.oneOf(Object.keys(EnrollTypes));