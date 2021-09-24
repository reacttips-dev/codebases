'use es6';

import PropTypes from 'prop-types';
export default PropTypes.oneOfType([PropTypes.func, PropTypes.shape({
  current: PropTypes.elementType
})]);