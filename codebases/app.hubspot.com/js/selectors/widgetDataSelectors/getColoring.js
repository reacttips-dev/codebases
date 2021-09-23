'use es6';

import { createSelector } from 'reselect';
import { getColoring as getColoringOperator } from 'conversations-internal-schema/widget-data/operators/widgetDataGetters';
import { getLatestWidgetData } from '../../widget-data/selectors/getLatestWidgetData';
export var getColoring = createSelector(getLatestWidgetData, getColoringOperator);