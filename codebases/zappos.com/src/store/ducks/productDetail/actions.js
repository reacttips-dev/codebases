import { STOCK_SELECTION_COMPLETED } from './types';

export const stockSelectionCompleted = payload => ({
  type: STOCK_SELECTION_COMPLETED,
  ...payload
});
