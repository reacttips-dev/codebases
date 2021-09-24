'use es6';

import { createSelector } from 'reselect';
import { buildPotentialResponders } from 'conversations-internal-schema/widget-data/operators/buildPotentialResponders';
import { getSendFromResponders } from '../../responders/selectors/getSendFromResponders';
import { getAgentRespondersList } from './getAgentRespondersList';
export var getPotentialResponders = createSelector([getSendFromResponders, getAgentRespondersList], buildPotentialResponders);