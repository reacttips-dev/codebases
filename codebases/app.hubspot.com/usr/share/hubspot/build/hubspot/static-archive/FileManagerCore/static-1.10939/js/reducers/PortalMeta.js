'use es6';

import Immutable from 'immutable';
import * as ActionTypes from '../actions/ActionTypes';
import { RequestStatus, VidyardTosStatus } from '../Constants';
import { getVidyardTosMap, getVidyardTosStatus, getVideoPQLMap, getIsVideoPQLBannerDismissed, getCategoryValues, getCategoryName } from '../utils/portalMeta';
var FileManagerPortalDataDefaultState = Immutable.Map({
  vidyardTosStatus: VidyardTosStatus.NOT_ASKED,
  isVideoPQLBannerDismissed: true,
  updateRequestStatus: RequestStatus.UNINITIALIZED,
  fetchRequestStatus: RequestStatus.UNINITIALIZED,
  categoryValues: Immutable.Map()
});
export default function PortalMeta() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : FileManagerPortalDataDefaultState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var type = action.type,
      vidyardTosStatus = action.vidyardTosStatus,
      portalDataList = action.portalDataList,
      category = action.category,
      apiValue = action.apiValue;

  switch (type) {
    case ActionTypes.FETCH_PORTAL_META_FAILED:
      return state.merge({
        fetchRequestStatus: RequestStatus.FAILED
      });

    case ActionTypes.FETCH_PORTAL_META_SUCCEEDED:
      return state.merge({
        vidyardTosStatus: getVidyardTosStatus(getVidyardTosMap(portalDataList)),
        isVideoPQLBannerDismissed: getIsVideoPQLBannerDismissed(getVideoPQLMap(portalDataList)),
        categoryValues: getCategoryValues(portalDataList),
        fetchRequestStatus: RequestStatus.SUCCEEDED
      });

    case ActionTypes.UPDATE_VIDYARD_TOS_STATUS_ATTEMPTED:
    case ActionTypes.UPDATE_PORTAL_META_ATTEMPTED:
      return state.merge({
        updateRequestStatus: RequestStatus.PENDING
      });

    case ActionTypes.UPDATE_VIDYARD_TOS_STATUS_SUCCEEDED:
      return state.merge({
        vidyardTosStatus: vidyardTosStatus,
        updateRequestStatus: RequestStatus.SUCCEEDED
      });

    case ActionTypes.UPDATE_PORTAL_META_SUCCEEDED:
      {
        var categoryValues = state.get('categoryValues');

        if (typeof category === 'number') {
          categoryValues = categoryValues.set(getCategoryName(category), apiValue);
        }

        return state.merge({
          categoryValues: categoryValues,
          updateRequestStatus: RequestStatus.SUCCEEDED
        });
      }

    case ActionTypes.UPDATE_VIDYARD_TOS_STATUS_FAILED:
    case ActionTypes.UPDATE_PORTAL_META_FAILED:
      return state.merge({
        updateRequestStatus: RequestStatus.FAILED
      });

    default:
      return state;
  }
}