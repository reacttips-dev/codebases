'use es6';

import { Map as ImmutableMap } from 'immutable';
import { createSelector } from 'reselect';
import { getTemplateIdsFromSequence } from 'SequencesUI/util/templateUtils';
export var getTemplates = function getTemplates(state) {
  return state.batchTemplates;
};
export var getTemplateIds = function getTemplateIds(state, props) {
  return getTemplateIdsFromSequence(props.sequence);
};
export var getTemplatesById = createSelector([getTemplates, getTemplateIds], function (templates, templateIds) {
  if (!templateIds.size || !templates.size) {
    return ImmutableMap();
  }

  return templateIds.map(function (id) {
    return templates.get(id);
  });
});