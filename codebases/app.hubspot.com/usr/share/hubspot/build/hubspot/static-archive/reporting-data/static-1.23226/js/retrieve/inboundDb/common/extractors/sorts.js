'use es6';

import { List } from 'immutable';
import extractor from '../../../../config/extractor';
export default (function () {
  return extractor(function (config) {
    return config.getIn(['sort'], List()).toJS();
  }, null);
});