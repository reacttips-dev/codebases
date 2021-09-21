import { combineReducers } from 'redux';
import types from './types';

/* State Shape
{
    isSupportDetailsModalShowing: bool,
    isShowingHowSponsorshipsWorksModal: bool,
}
*/

const isSupportDetailsModalShowingReducer = (state = false, action) => {
  switch (action.type) {
    case types.OPEN_SUPPORT_DETAILS_MODAL:
      return true;
    case types.CLOSE_SUPPORT_DETAILS_MODAL:
      return false;
    default:
      return state;
  }
};

const isShowingHowSponsorshipsWorksModalReducer = (state = false, action) => {
  switch (action.type) {
    case types.SET_IS_SHOWING_HOW_SPONSORSHIPS_WORKS_MODAL:
      return action.payload.isShowingHowSponsorshipsWorksModal;
    default:
      return state;
  }
};

const reducer = combineReducers({
  isSupportDetailsModalShowing: isSupportDetailsModalShowingReducer,
  isShowingHowSponsorshipsWorksModal: isShowingHowSponsorshipsWorksModalReducer,
});

export default reducer;
