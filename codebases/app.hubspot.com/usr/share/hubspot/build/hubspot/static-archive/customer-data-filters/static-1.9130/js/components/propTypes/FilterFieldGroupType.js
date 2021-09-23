'use es6';

import { listOf, recordOf } from 'react-immutable-proptypes';
import FilterFieldType from './FilterFieldType';
import PropTypes from 'prop-types';
export default recordOf({
  displayName: PropTypes.string.isRequired,
  displayOrder: PropTypes.number.isRequired,
  hubspotDefined: PropTypes.bool,
  name: PropTypes.string.isRequired,
  properties: listOf(FilterFieldType.isRequired).isRequired
});