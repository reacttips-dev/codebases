'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import Confetti from './Confetti';
import FormattedMessage from 'I18n/components/FormattedMessage';
import H2 from 'UIComponents/elements/headings/H2';
import I18n from 'I18n';
import PropTypes from 'prop-types';
import UIButton from 'UIComponents/button/UIButton';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import UIDialogHeaderImage from 'UIComponents/dialog/UIDialogHeaderImage';
import UIIllustration from 'UIComponents/image/UIIllustration';
import UIModal from 'UIComponents/dialog/UIModal';

var CustomObjectAdminCelebrationModalPresentational = function CustomObjectAdminCelebrationModalPresentational(_ref) {
  var objectNamePluralForm = _ref.objectNamePluralForm,
      onClose = _ref.onClose,
      doShow = _ref.doShow;

  if (!doShow) {
    return null;
  }

  return /*#__PURE__*/_jsxs(UIModal, {
    use: "info",
    width: 540,
    children: [/*#__PURE__*/_jsx(UIDialogHeaderImage, {
      offsetBottom: -23,
      offsetTop: 56,
      children: /*#__PURE__*/_jsx(UIIllustration, {
        alt: I18n.text('index.illustrationAltText.customObjectsButton'),
        name: "custom-objects-button",
        width: 190
      })
    }), /*#__PURE__*/_jsx(Confetti, {}), /*#__PURE__*/_jsxs(UIDialogHeader, {
      children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
        onClick: onClose
      }), /*#__PURE__*/_jsx(H2, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "index.onboarding.customObjects.adminCelebrationModal.header"
        })
      })]
    }), /*#__PURE__*/_jsxs(UIDialogBody, {
      children: [/*#__PURE__*/_jsx("div", {
        children: /*#__PURE__*/_jsx("b", {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "index.onboarding.customObjects.adminCelebrationModal.header2"
          })
        })
      }), /*#__PURE__*/_jsx(FormattedMessage, {
        message: "index.onboarding.customObjects.adminCelebrationModal.body",
        options: {
          objectNamePluralForm: objectNamePluralForm
        }
      })]
    }), /*#__PURE__*/_jsx(UIDialogFooter, {
      align: "center",
      children: /*#__PURE__*/_jsx(UIButton, {
        use: "primary",
        onClick: onClose,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "index.onboarding.customObjects.adminCelebrationModal.button"
        })
      })
    })]
  });
};

CustomObjectAdminCelebrationModalPresentational.propTypes = {
  doShow: PropTypes.bool,
  objectNamePluralForm: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
};
export default CustomObjectAdminCelebrationModalPresentational;