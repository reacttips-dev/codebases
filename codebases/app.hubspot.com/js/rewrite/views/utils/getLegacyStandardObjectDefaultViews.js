'use es6';

import { Map as ImmutableMap } from 'immutable';
import unescapedText from 'I18n/utils/unescapedText';
import ViewRecord from 'customer-data-objects/view/ViewRecord';
import get from 'transmute/get';
import ViewDefaults from 'crm_universal/view/ViewDefaults';
import { denormalizeTypeId } from '../../utils/denormalizeTypeId';
import memoize from 'transmute/memoize'; // This code takes the default views defined for a given object type in crm_universal and hydrates them as ViewRecords with translated names.
// Adapted from from https://git.hubteam.com/HubSpot/CRM/blob/6ae896aa6be730bb4685a2320e57ab96a4b9a032/crm_ui/static/js/flux/views/ViewsStore.js#L41-L63

export var getLegacyStandardObjectDefaultViews = memoize(function (objectTypeId) {
  var objectType = denormalizeTypeId(objectTypeId);
  var defaults = ViewDefaults[objectType];
  return defaults.reduce(function (defaultViews, view) {
    var translationKey = get('translationKey', view);
    var viewId = get('id', view);
    var name = translationKey ? unescapedText(translationKey) : viewId;
    var viewRecord = ViewRecord.fromJS(Object.assign({}, view, {
      name: name,
      ownerId: -1
    }));
    var stringViewId = String(viewId);
    return defaultViews.set(stringViewId, viewRecord);
  }, ImmutableMap());
});