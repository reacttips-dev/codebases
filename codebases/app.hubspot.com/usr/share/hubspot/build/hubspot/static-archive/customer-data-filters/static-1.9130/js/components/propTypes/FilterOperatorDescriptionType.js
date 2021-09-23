'use es6';

import { recordOf } from 'react-immutable-proptypes';
import FilterOperatorType from './FilterOperatorType';
import PropTypes from 'prop-types';
export default recordOf({
  filterFamily: PropTypes.string.isRequired,
  operator: FilterOperatorType.isRequired
});