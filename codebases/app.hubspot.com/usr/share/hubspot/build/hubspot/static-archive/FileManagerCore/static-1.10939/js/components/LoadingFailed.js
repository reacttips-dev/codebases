'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import I18n from 'I18n';
import classnames from 'classnames';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import UIIllustration from 'UIComponents/image/UIIllustration';
import UILink from 'UIComponents/link/UILink';
export default function LoadingFailed(props) {
  var className = props.className;
  return /*#__PURE__*/_jsxs("div", {
    className: classnames('loading-failed text-center', className),
    children: [/*#__PURE__*/_jsx(UIIllustration, {
      className: "m-y-10",
      name: "errors/general",
      width: 100
    }), /*#__PURE__*/_jsx("h4", {
      children: I18n.text('FileManagerCore.loadFailed.message')
    }), /*#__PURE__*/_jsxs("p", {
      children: [I18n.text('FileManagerCore.loadFailed.moreInfo'), /*#__PURE__*/_jsx("br", {}), /*#__PURE__*/_jsx(FormattedReactMessage, {
        message: "FileManagerCore.loadFailed.tryAgain",
        options: {
          refreshPageLink: /*#__PURE__*/_jsx(UILink, {
            href: "",
            children: I18n.text('FileManagerCore.loadFailed.refreshPageLink')
          }),
          loginLink: /*#__PURE__*/_jsx(UILink, {
            href: "/login",
            children: I18n.text('FileManagerCore.loadFailed.loginLink')
          })
        }
      })]
    }), /*#__PURE__*/_jsx("p", {
      children: I18n.text('FileManagerCore.loadFailed.help')
    })]
  });
}
LoadingFailed.propTypes = {
  className: PropTypes.string
};