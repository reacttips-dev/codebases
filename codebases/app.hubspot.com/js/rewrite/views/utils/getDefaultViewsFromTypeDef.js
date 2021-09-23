'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { fromJS } from 'immutable';
import unescapedText from 'I18n/utils/unescapedText';
import ViewRecord from 'customer-data-objects/view/ViewRecord';
import { DEFAULT } from 'customer-data-objects/view/ViewTypes';
import { getDefaultViewColumnsFromTypeDef } from './getDefaultViewColumnsFromTypeDef';
import { ALL } from '../constants/DefaultViews';
import { CALL_TYPE_ID, COMPANY_TYPE_ID, CONTACT_TYPE_ID, DEAL_TYPE_ID, TICKET_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import { getCallsDefaultViews } from './getCallsDefaultViews';
import { getLegacyStandardObjectDefaultViews } from './getLegacyStandardObjectDefaultViews';
import memoize from 'transmute/memoize';
export var getDefaultViewsFromTypeDef = memoize(function (typeDef) {
  var objectTypeId = typeDef.objectTypeId;

  if ([CONTACT_TYPE_ID, COMPANY_TYPE_ID, DEAL_TYPE_ID, TICKET_TYPE_ID].includes(objectTypeId)) {
    return getLegacyStandardObjectDefaultViews(objectTypeId);
  }

  if (objectTypeId === CALL_TYPE_ID) {
    return getCallsDefaultViews();
  }

  var columns = getDefaultViewColumnsFromTypeDef(typeDef);
  return fromJS(_defineProperty({}, ALL, ViewRecord(fromJS({
    id: ALL,
    type: DEFAULT,
    name: unescapedText('index.defaultViews.allRecords'),
    ownerId: -1,
    columns: columns,
    state: {
      sortKey: 'hs_createdate',
      sortColumnName: 'hs_createdate',
      order: 1
    }
  }))));
});