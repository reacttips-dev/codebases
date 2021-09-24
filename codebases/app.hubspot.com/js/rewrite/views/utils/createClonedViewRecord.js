'use es6';

import unescapedText from 'I18n/utils/unescapedText';
import ViewRecord from 'customer-data-objects/view/ViewRecord';
import { STANDARD } from 'customer-data-objects/view/ViewTypes';
export var createClonedViewRecord = function createClonedViewRecord(view) {
  return ViewRecord.fromJS({
    name: unescapedText('index.views.modals.clone.clonedViewName', {
      name: view.name
    }),
    columns: view.columns,
    filters: view.filters,
    state: view.state,
    filterGroups: view.filterGroups,
    private: view.private,
    teamId: view.teamId,
    type: STANDARD
  });
};