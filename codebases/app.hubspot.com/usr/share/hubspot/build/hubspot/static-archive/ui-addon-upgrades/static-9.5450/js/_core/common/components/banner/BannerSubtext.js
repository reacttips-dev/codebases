'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { getProductNameText } from 'ui-addon-upgrades/_core/common/adapters/getProductNameText';

var BannerSubtext = function BannerSubtext(_ref) {
  var subText = _ref.subText,
      upgradeProduct = _ref.upgradeProduct;
  return /*#__PURE__*/_jsxs(Fragment, {
    children: [subText, /*#__PURE__*/_jsx(FormattedMessage, {
      className: "m-left-1",
      message: "upgrades.message.productName",
      options: {
        productName: getProductNameText(upgradeProduct)
      }
    })]
  });
};

BannerSubtext.propTypes = {
  subText: PropTypes.node.isRequired,
  upgradeProduct: PropTypes.string.isRequired
};
export default BannerSubtext;