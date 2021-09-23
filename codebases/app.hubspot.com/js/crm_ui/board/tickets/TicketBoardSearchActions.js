'use es6';

import TicketBoardSearchActionTypes from './TicketBoardSearchActionTypes';
import createSearchActions from '../../flux/elasticSearch/createSearchActions';
export default createSearchActions(TicketBoardSearchActionTypes);