'use es6';

import { createSelector } from 'reselect';
import { getLatestWidgetData } from '../../widget-data/selectors/getLatestWidgetData';
import { getAvailabilityOptions } from '../operators/getAvailabilityOptions';
export var getWidgetAvailabilityOptions = createSelector([getLatestWidgetData], getAvailabilityOptions);