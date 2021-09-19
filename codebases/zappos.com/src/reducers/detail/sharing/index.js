import { combineReducers } from 'redux';

import productNotify from 'reducers/detail/sharing/productNotify';
import reportAnError from 'reducers/detail/sharing/reportAnError';
import tellAFriend from 'reducers/detail/sharing/tellAFriend';

export default combineReducers({
  productNotify,
  reportAnError,
  tellAFriend
});
