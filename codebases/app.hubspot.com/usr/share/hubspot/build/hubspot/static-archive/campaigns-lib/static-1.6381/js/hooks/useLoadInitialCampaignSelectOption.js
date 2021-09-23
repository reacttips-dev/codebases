'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { useState, useEffect } from 'react';
import { getCrmSearchCampaign } from '../data/CampaignDao';
import { callIfPossible } from 'UIComponents/core/Functions';
export default function useLoadInitialCampaignSelectOptions(_ref) {
  var value = _ref.value,
      hasOpened = _ref.hasOpened,
      multi = _ref.multi,
      onCurrentValueNotFound = _ref.onCurrentValueNotFound;

  var _useState = useState([]),
      _useState2 = _slicedToArray(_useState, 2),
      initialOptions = _useState2[0],
      setInitialOptions = _useState2[1];

  useEffect(function () {
    var hasValue = multi ? value.length > 0 : value;

    if (!hasOpened && hasValue) {
      getCrmSearchCampaign(value).then(function (_ref2) {
        var results = _ref2.results;

        if (results.length > 0) {
          setInitialOptions(results.map(function (currentValueResponse) {
            return Object.assign({}, currentValueResponse, {
              colorHex: currentValueResponse.colorHex,
              text: currentValueResponse.display_name,
              value: currentValueResponse.guid
            });
          }));
        } else {
          callIfPossible(onCurrentValueNotFound());
        }
      });
    }
  }, [hasOpened, value, multi, onCurrentValueNotFound]);
  return initialOptions;
}