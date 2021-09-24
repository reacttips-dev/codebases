'use es6';

import PropTypes from 'prop-types';
/**
 * PropType function that can be used with React components to validate objects
 * shaped like a "SimpleDate"
 *
 * type SimpleDate = {
 *   year: number;
 *   month: number;
 *   date: number;
 * };
 */

export var SimpleDateType = PropTypes.shape({
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  date: PropTypes.number.isRequired
});