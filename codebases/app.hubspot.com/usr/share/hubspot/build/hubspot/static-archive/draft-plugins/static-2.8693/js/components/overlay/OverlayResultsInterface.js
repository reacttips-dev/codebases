'use es6';

import PropTypes from 'prop-types';
export default {
  search: PropTypes.string.isRequired,
  offset: PropTypes.number.isRequired,
  length: PropTypes.number.isRequired,
  results: PropTypes.array.isRequired,
  selection: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  toggleForcedOverlayFocus: PropTypes.func.isRequired
};