'use es6';

import { Map as ImmutableMap, List } from 'immutable';
import { propertyLabelTranslator } from 'property-translator/propertyTranslator';
import * as http from '../../request/http';
import toJS from '../../lib/toJS';
export default (function () {
  return http.get('twilio/v1/custom-dispositions', {
    query: {
      includeDeleted: true
    }
  }).then(toJS).then(function (_ref) {
    var callDispositions = _ref.callDispositions;
    return List(callDispositions.map(function (_ref2) {
      var uid = _ref2.uid,
          label = _ref2.label;
      return ImmutableMap({
        value: uid,
        label: propertyLabelTranslator(label, 'reporting-data.properties.call.dispositionTypes')
      });
    }));
  });
});