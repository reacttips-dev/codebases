'use es6';

import DealBoardSearchActionTypes from './DealBoardSearchActionTypes';
import createSearchActions from '../../flux/elasticSearch/createSearchActions';
export default createSearchActions(DealBoardSearchActionTypes);