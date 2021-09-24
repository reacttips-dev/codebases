'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UICheckbox from 'UIComponents/input/UICheckbox';
import UISearchableSelectInput from 'UIComponents/input/UISearchableSelectInput';
import UIButton from 'UIComponents/button/UIButton';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UIFormActions from 'UIComponents/form/UIFormActions';

var DeckSelectPopoverForm = function DeckSelectPopoverForm(_ref) {
  var selectedDeckId = _ref.selectedDeckId,
      requireEmail = _ref.requireEmail,
      deckOptions = _ref.deckOptions,
      displayText = _ref.displayText,
      includeLinkPreview = _ref.includeLinkPreview,
      toggleLinkPreview = _ref.toggleLinkPreview,
      handleDeckSelect = _ref.handleDeckSelect,
      toggleRequireEmail = _ref.toggleRequireEmail,
      handleConfirm = _ref.handleConfirm,
      handleCancel = _ref.handleCancel;
  return /*#__PURE__*/_jsxs("div", {
    className: "p-all-4",
    children: [/*#__PURE__*/_jsx(UIFormControl, {
      label: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "draftPlugins.documents.decksModal.selectDocument"
      }),
      children: /*#__PURE__*/_jsx(UISearchableSelectInput, {
        className: "template-decks-select",
        "data-test-id": "decks-select",
        defaultOpen: false,
        menuWidth: 386,
        onChange: handleDeckSelect,
        options: deckOptions
      })
    }), displayText, /*#__PURE__*/_jsx(UICheckbox, {
      className: "m-y-4 display-block",
      "data-test-id": "require-email",
      checked: requireEmail,
      onChange: toggleRequireEmail,
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "draftPlugins.documents.decksModal.requireEmail"
      })
    }), /*#__PURE__*/_jsx(UICheckbox, {
      className: "m-y-4 display-block",
      "data-test-id": "include-link-preview",
      checked: includeLinkPreview,
      onChange: toggleLinkPreview,
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "draftPlugins.documents.decksModal.includeLinkPreview"
      })
    }), /*#__PURE__*/_jsxs(UIFormActions, {
      children: [/*#__PURE__*/_jsx(UIButton, {
        use: "tertiary",
        "data-test-id": "insert-deck",
        size: "small",
        onClick: handleConfirm,
        disabled: !selectedDeckId,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "draftPlugins.documents.decksModal.insertButton"
        })
      }), /*#__PURE__*/_jsx(UIButton, {
        use: "tertiary-light",
        size: "small",
        onClick: handleCancel,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "draftPlugins.documents.decksModal.cancelButton"
        })
      })]
    })]
  });
};

DeckSelectPopoverForm.propTypes = {
  selectedDeckId: PropTypes.number,
  requireEmail: PropTypes.bool.isRequired,
  deckOptions: PropTypes.array.isRequired,
  displayText: PropTypes.node,
  includeLinkPreview: PropTypes.bool.isRequired,
  toggleLinkPreview: PropTypes.func.isRequired,
  handleDeckSelect: PropTypes.func.isRequired,
  toggleRequireEmail: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired
};
export default DeckSelectPopoverForm;