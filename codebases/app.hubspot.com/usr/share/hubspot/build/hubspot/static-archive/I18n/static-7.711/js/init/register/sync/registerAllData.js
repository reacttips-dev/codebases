'use es6';

import registerBasicData from './registerBasicData';
import '../../moment/moment-and-timezone-init';
import '../../moment/standardMomentLocales';
export default (function (Provider) {
  return registerBasicData(Provider);
});