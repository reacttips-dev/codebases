'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import I18n from 'I18n';
import PropTypes from 'prop-types';
import UIImage from 'UIComponents/image/UIImage';
import UISelect from 'UIComponents/input/UISelect';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import canvaLogoUrl from 'bender-url!FileManagerImages/images/canva-logo.png';
import { CANVA_DEFAULT_TEMPLATES, CANVA_TEMPLATES } from '../constants/Canva';

var CanvaCreateButton = function CanvaCreateButton(_ref) {
  var disabledReason = _ref.disabledReason,
      isDisabled = _ref.isDisabled,
      isDownloading = _ref.isDownloading,
      loadingButton = _ref.loadingButton,
      openCanva = _ref.openCanva,
      specificCanvaTemplates = _ref.specificCanvaTemplates;
  var templates = specificCanvaTemplates || CANVA_DEFAULT_TEMPLATES;
  return /*#__PURE__*/_jsx(UITooltip, {
    title: disabledReason,
    children: isDownloading ? loadingButton : /*#__PURE__*/_jsx(UISelect, {
      className: "m-x-2",
      disabled: isDisabled,
      menuWidth: 312,
      onChange: function onChange(e) {
        return openCanva(e.target.value);
      },
      buttonUse: "tertiary-light",
      buttonSize: "small",
      placeholder: /*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx(UIImage, {
          alt: I18n.text('FileManagerCore.actions.addFromCanva'),
          className: "m-x-1",
          height: 20,
          responsive: false,
          src: canvaLogoUrl,
          draggable: false
        }), /*#__PURE__*/_jsx(FormattedMessage, {
          className: "canva-button-text m-x-1",
          message: "FileManagerCore.actions.addFromCanva"
        })]
      }),
      placement: "top left",
      value: "",
      options: templates.map(function (t) {
        return {
          text: I18n.text("FileManagerCore.canva.typeLabels." + t),
          value: t
        };
      })
    })
  });
};

CanvaCreateButton.propTypes = {
  disabledReason: PropTypes.node,
  isDisabled: PropTypes.bool.isRequired,
  isDownloading: PropTypes.bool.isRequired,
  loadingButton: PropTypes.node.isRequired,
  openCanva: PropTypes.func.isRequired,
  specificCanvaTemplates: PropTypes.arrayOf(PropTypes.oneOf(CANVA_TEMPLATES))
};
export default CanvaCreateButton;