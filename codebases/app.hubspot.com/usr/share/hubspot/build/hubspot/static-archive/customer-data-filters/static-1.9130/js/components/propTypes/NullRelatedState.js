'use es6';

import { List } from 'immutable';
import DefaultNullValueRecord from '../../filterQueryFormat/DefaultNullValueRecord';
import PropTypes from 'prop-types';
export default PropTypes.shape({
  conditionBranchPath: PropTypes.instanceOf(List),
  showIncludeObjectsWithNoValueSetByOperator: PropTypes.objectOf(PropTypes.bool),
  showIncludeObjectsWithNoAssociatedObjectsByFilterBranch: PropTypes.objectOf(PropTypes.bool),
  defaultNullValueByOperator: PropTypes.objectOf(DefaultNullValueRecord)
});