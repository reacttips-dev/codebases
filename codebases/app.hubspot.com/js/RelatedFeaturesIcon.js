'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { EERIE } from 'HubStyleTokens/colors';
import UIIcon from 'UIComponents/icon/UIIcon';

function RelatedFeaturesIcon(_ref) {
  var name = _ref.name;
  return /*#__PURE__*/_jsx(UIIcon, {
    name: name,
    size: 20,
    className: "m-right-3",
    color: EERIE
  });
}

export default RelatedFeaturesIcon;