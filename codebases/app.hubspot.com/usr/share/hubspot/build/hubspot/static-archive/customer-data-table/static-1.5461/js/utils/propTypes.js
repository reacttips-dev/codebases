'use es6';

import PropTypes from 'prop-types'; // part of react-tables 'state'

export var pageRowsType = PropTypes.arrayOf(PropTypes.shape({
  _index: PropTypes.number,
  _nestingLevel: PropTypes.number,
  _original: PropTypes.object,
  // this is the item passed to the row
  _selector: PropTypes.string,
  _viewIndex: PropTypes.number
}));