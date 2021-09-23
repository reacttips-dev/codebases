'use es6';

import { Record } from 'immutable';
import { UNINITIALIZED } from '../constants/ThirdPartyStatus';
var ThirdPartyCalling = Record({
  isLoggedIn: false,
  status: UNINITIALIZED
});
export default ThirdPartyCalling;