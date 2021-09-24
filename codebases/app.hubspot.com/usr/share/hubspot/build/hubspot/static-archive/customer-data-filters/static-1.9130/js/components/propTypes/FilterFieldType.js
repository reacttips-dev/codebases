'use es6';

import { recordOf } from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
export default recordOf({
  hubspotDefined: PropTypes.bool,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
});