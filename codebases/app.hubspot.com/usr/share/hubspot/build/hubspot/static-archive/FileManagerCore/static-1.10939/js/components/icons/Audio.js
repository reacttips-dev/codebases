'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { EERIE } from 'HubStyleTokens/colors';
import UIIcon from 'UIComponents/icon/UIIcon';
export default function Audio(props) {
  return /*#__PURE__*/_jsx(UIIcon, Object.assign({
    color: EERIE
  }, props, {
    name: "audioFile"
  }));
}