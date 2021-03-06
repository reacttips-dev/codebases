'use es6';

import uniqueActionTypes from 'crm_data/flux/uniqueActionTypes';
export default uniqueActionTypes({
  RESIZED_COLUMN: 'RESIZED_COLUMN',
  VIEW_INITIALIZE_OBJECT_TYPE: 'VIEW_INITIALIZE_OBJECT_TYPE',
  VIEW_COLUMN_FAVORITES_UPDATED: 'VIEW_COLUMN_FAVORITES_UPDATED',
  VIEW_COLUMNS_CHANGED: 'VIEW_COLUMNS_CHANGED',
  VIEW_CREATED: 'VIEW_CREATED',
  VIEW_DRAFT_RESTORED: 'VIEW_DRAFT_RESTORED',
  VIEW_FILTER_GROUPS_CHANGED: 'VIEW_FILTER_GROUPS_CHANGED',
  VIEW_FILTERS_CHANGED: 'VIEW_FILTERS_CHANGED',
  VIEW_FILTERS_FIXED: 'VIEW_FILTERS_FIXED',
  VIEW_PIPELINE_CHANGED: 'VIEW_PIPELINE_CHANGED',
  VIEW_RENAMED: 'VIEW_RENAMED',
  VIEW_RESET: 'VIEW_RESET',
  VIEW_SAVED: 'VIEW_SAVED',
  VIEW_SORTED: 'VIEW_SORTED',
  VIEW_UPDATED: 'VIEW_UPDATED',
  VIEWS_UPDATED: 'VIEWS_UPDATED',
  VIEW_RESET_FILTERS: 'VIEW_RESET_FILTERS'
});