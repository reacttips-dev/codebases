'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import * as colors from 'HubStyleTokens/colors';
import UIIconCircle from 'UIComponents/icon/UIIconCircle';
export default function VideoIconOverlay() {
  return /*#__PURE__*/_jsx("div", {
    className: "video-icon-overlay align-center justify-center",
    children: /*#__PURE__*/_jsx(UIIconCircle, {
      name: "playerPlay",
      color: colors.OLAF,
      backgroundColor: colors.OBSIDIAN,
      borderWidth: 0,
      size: 9,
      padding: 0.2,
      iconClassName: "m-right-0"
    })
  });
}