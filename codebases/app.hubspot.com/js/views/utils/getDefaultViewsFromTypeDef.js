'use es6';

import { fromJS } from 'immutable';
import ViewRecord from 'customer-data-objects/view/ViewRecord';
import { DEFAULT } from 'customer-data-objects/view/ViewTypes';
import * as ObjectType from '../../lib/ObjectType';
import I18n from 'I18n';
/**
 * @deprecated Prefer the version in the /rewrite directory
 */

export var getDefaultViewsFromTypeDef = function getDefaultViewsFromTypeDef(typeDef) {
  return fromJS({
    all: ViewRecord(fromJS({
      id: 'all',
      type: DEFAULT,
      name: I18n.text('index.defaultViews.allRecords'),
      ownerId: -1,
      columns: ObjectType.getDefaultColumns(typeDef),
      state: {
        sortKey: 'hs_createdate',
        sortColumnName: 'hs_createdate',
        order: 1
      }
    }))
  });
};