'use es6';

import { ObjectTypesToIds } from 'customer-data-objects/constants/ObjectTypeIds';
import CrmRecordCardViewsStore from 'crm_data/cards/CrmRecordCardViewsStore';
import { VIEW_LOCATION_OBJECT_BOARD } from 'crm_data/cards/CrmRecordCardConstants';
import { getPropertyNamesFromCustomRecordView } from 'crm_data/cards/CrmRecordCardViewsUtils';
import { LOADING, isLoading } from 'crm_data/flux/LoadingStatus'; // Because of card customization, we must append the properties the
// user's admin has elected to be displayed on the board cards before
// we make a fetch. If we do not do this, the cards will show up with
// no values on them

export var getCardPropertiesDep = {
  stores: [CrmRecordCardViewsStore],
  deref: function deref(_ref) {
    var objectType = _ref.objectType;
    var objectTypeId = ObjectTypesToIds[objectType] || objectType;
    var cardViews = CrmRecordCardViewsStore.get({
      objectTypeId: objectTypeId,
      location: VIEW_LOCATION_OBJECT_BOARD
    });

    if (isLoading(cardViews)) {
      return LOADING;
    }

    return getPropertyNamesFromCustomRecordView(cardViews);
  }
};