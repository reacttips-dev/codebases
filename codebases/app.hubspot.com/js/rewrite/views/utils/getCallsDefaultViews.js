'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { fromJS } from 'immutable';
import unescapedText from 'I18n/utils/unescapedText';
import ViewRecord from 'customer-data-objects/view/ViewRecord';
import { DEFAULT } from 'customer-data-objects/view/ViewTypes';
import { ALL } from '../constants/DefaultViews';
import once from 'transmute/once'; // We want to filter out calls without a recording by default since they're mostly useless
// on the calls index (and to keep parity with mobile). So we've changed the default view
// generated for calls to include this filter, to allow users to remove if they wish.
// See https://hubspot.slack.com/archives/C01DC2C7M7B/p1612468587001200
// HACK: We're piggybacking on the 'all' default view here because the BE will only accept
// default viewIds from a very specific set (see ViewIdMapping for the list). If the BE
// is changed to allow any default viewId without validation or defaults are moved to the BE,
// we can change this up to use a different id.

export var getCallsDefaultViews = once(function () {
  var defaultColumns = ['hs_call_title', 'hs_timestamp', 'hubspot_owner_id', 'hs_body_preview', 'hs_call_disposition'].map(function (name) {
    return {
      name: name
    };
  });
  return fromJS(_defineProperty({}, ALL, ViewRecord(fromJS({
    id: ALL,
    type: DEFAULT,
    name: unescapedText('index.defaultViews.recordedCalls'),
    ownerId: -1,
    columns: defaultColumns,
    state: {
      sortKey: 'hs_createdate',
      sortColumnName: 'hs_createdate',
      order: 1
    },
    filters: [{
      operator: 'HAS_PROPERTY',
      property: 'hs_call_recording_url'
    }]
  }))));
});