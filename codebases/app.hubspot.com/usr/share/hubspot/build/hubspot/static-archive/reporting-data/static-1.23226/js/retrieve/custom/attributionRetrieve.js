'use es6';

import { fromJS } from 'immutable';
import { ATTRIBUTION } from '../../constants/dataTypes';
import { load } from '../../dataTypeDefinitions';
export default {
  match: function match(config) {
    return config.get('dataType') === ATTRIBUTION;
  },
  retrieve: function retrieve(config) {
    return load(ATTRIBUTION).then(function (module) {
      return module.get('use')(config);
    }).then(fromJS).then(function (nested) {
      return {
        dataConfig: config,
        dataset: nested,
        response: null
      };
    });
  }
};