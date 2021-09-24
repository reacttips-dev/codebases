'use es6';

import { Map as ImmutableMap, List } from 'immutable';
import toJS from 'transmute/toJS';
import memoizeOne from 'react-utils/memoizeOne';
import CustomPropertyHelper from '../../../crm_ui/utils/CustomPropertyHelper';
import { ObjectTypeFromIds } from 'customer-data-objects/constants/ObjectTypeIds'; // Logic pulled from ViewToElasticSearchQuery
// https://git.hubteam.com/HubSpot/CRM/blob/8ce0583ea15e4b4d8363612e52d21896945b21c8/crm_ui/static/js/utils/ViewToElasticSearchQuery.js#L33-L77

export var getSortsFromView = memoizeOne(function (view, typeDef) {
  if (!view || !typeDef) {
    return [];
  }

  var objectTypeId = typeDef.objectTypeId,
      createDatePropertyName = typeDef.createDatePropertyName;
  var viewState = view.get('state') || ImmutableMap();
  var sortColumnName = viewState.get('sortColumnName');
  var sortKey = viewState.get('sortKey');
  var sortOptions; // This code overrides the sort settings for specific properties
  // on specific object types.
  // TODO: That logic should be moved from CustomPropertyHelper into this file.

  var legacyObjectType = ObjectTypeFromIds[objectTypeId];
  var extraProperties = CustomPropertyHelper.get(legacyObjectType || objectTypeId, sortColumnName);

  if (extraProperties) {
    sortKey = extraProperties.get('sortValue') || sortKey;
    sortOptions = toJS(extraProperties.get('sortOptions'));
  }

  var order = viewState.get('order') === -1 ? 'ASC' : 'DESC';
  var sorts = [];

  if (List.isList(sortKey) || Array.isArray(sortKey)) {
    sortKey.forEach(function (property) {
      return sorts.push(Object.assign({
        property: property,
        order: order
      }, sortOptions));
    });
  } else if (sortKey) {
    sorts.push(Object.assign({
      property: sortKey,
      order: order
    }, sortOptions));
  }

  if (!sorts.find(function (_ref) {
    var property = _ref.property;
    return property === createDatePropertyName;
  })) {
    sorts.push({
      property: createDatePropertyName,
      order: 'DESC'
    });
  }

  sorts.push({
    property: 'hs_object_id',
    order: 'DESC'
  });
  return sorts;
});