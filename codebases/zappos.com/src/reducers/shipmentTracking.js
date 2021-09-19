import {
  RECEIVE_SHIPMENT_TRACKING,
  RECEIVE_SHIPMENT_TRACKING_ERROR,
  REQUEST_SHIPMENT_TRACKING,
  RESET_SHIPMENT_TRACKING
} from 'constants/reduxActions';

const initialState = {
  trackingInfo: [],
  hasFetchError: false,
  isLoading: false
};

export default function shipmentTracking(state = initialState, action) {
  const {
    type,
    trackingInfo
  } = action;

  switch (type) {
    case REQUEST_SHIPMENT_TRACKING:
      return { ...state, isLoading: true };

    // concatenate shipment tracking if on order detail page w/ multiple shipments
    case RECEIVE_SHIPMENT_TRACKING:
      const newTrackingInfo = state.trackingInfo.concat([trackingInfo]);
      return {
        ...state,
        trackingInfo: newTrackingInfo,
        isLoading: false
      };

    case RECEIVE_SHIPMENT_TRACKING_ERROR:
      return {
        ...state,
        trackingInfo: [{ tracking: { events: [] } }], // still load tracking page but with empty events
        isLoading: false,
        hasFetchError: true
      };

    case RESET_SHIPMENT_TRACKING:
      return { ...state, trackingInfo: [], isLoading: false };

    default:
      return state;
  }
}
