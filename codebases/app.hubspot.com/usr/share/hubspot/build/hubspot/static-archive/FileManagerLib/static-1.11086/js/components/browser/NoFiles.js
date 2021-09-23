'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import Small from 'UIComponents/elements/Small';
import UIImage from 'UIComponents/image/UIImage';
import emptyDashboardUrl from 'bender-url!FileManagerImages/images/empty-dashboard.svg';
import { DrawerTypes } from '../../Constants';
import { getFilesUrl } from '../../utils/network';

function getI18nPathByType(isHublVideo) {
  return "FileManagerLib.emptyBrowser." + (isHublVideo ? 'video' : 'default');
}

export default function NoFiles(_ref) {
  var type = _ref.type;
  var isHublVideo = type === DrawerTypes.HUBL_VIDEO;
  var i18nKeyPath = getI18nPathByType(isHublVideo);
  return /*#__PURE__*/_jsxs("div", {
    className: "text-center",
    children: [/*#__PURE__*/_jsx(UIImage, {
      className: "m-y-10",
      width: 180,
      src: emptyDashboardUrl,
      responsive: false
    }), /*#__PURE__*/_jsx("h5", {
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: i18nKeyPath + ".message"
      })
    }), /*#__PURE__*/_jsx("p", {
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: i18nKeyPath + ".uploadHint"
      })
    }), isHublVideo && /*#__PURE__*/_jsx("p", {
      className: "m-top-2",
      children: /*#__PURE__*/_jsx(Small, {
        use: "help",
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: i18nKeyPath + ".noVideos",
          options: {
            href: getFilesUrl()
          }
        })
      })
    })]
  });
}
NoFiles.propTypes = {
  type: PropTypes.oneOf(Object.keys(DrawerTypes))
};