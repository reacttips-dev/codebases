'use es6';

import { recordOf } from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
export default recordOf({
  error: PropTypes.bool.isRequired,
  message: PropTypes.node.isRequired,
  opts: PropTypes.object.isRequired
});