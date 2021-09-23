'use es6';

import { iterableOf, recordOf } from 'react-immutable-proptypes';
import FilterOperatorType from './FilterOperatorType';
import PropTypes from 'prop-types';
var FilterFamilyType = recordOf({
  conditions: iterableOf(FilterOperatorType.isRequired).isRequired,
  filterFamily: PropTypes.string.isRequired
});
export var AndGroupType = recordOf({
  conditions: iterableOf(PropTypes.oneOfType([FilterFamilyType.isRequired, FilterOperatorType.isRequired]).isRequired)
});
export var OrGroupType = recordOf({
  conditions: iterableOf(AndGroupType.isRequired).isRequired
});
export default PropTypes.oneOfType([AndGroupType.isRequired, FilterOperatorType.isRequired, OrGroupType.isRequired]);