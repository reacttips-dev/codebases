'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import * as Alerts from 'customer-data-ui-utilities/alerts/Alerts';
import { CozyCardPreferences } from './CozyCardPreferences';
import { InactiveCardPreferences } from './InactiveCardPreferences';
import { prefix as inactiveCardsPrefix } from '../../../crm_ui/board/cardPreferences/inactiveCards/constants';
import { prefix as cozyCardsPrefix } from '../../../crm_ui/board/cardPreferences/cozyCards/constants';
import { useCardPreferences } from '../../../crm_ui/board/cardPreferences/CardPreferencesContextProvider';
import FormattedMessage from 'I18n/components/FormattedMessage';
import H2 from 'UIComponents/elements/headings/H2';
import HR from 'UIComponents/elements/HR';
import PropTypes from 'prop-types';
import UIButton from 'UIComponents/button/UIButton';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIPanel from 'UIComponents/panel/UIPanel';
import UIPanelBody from 'UIComponents/panel/UIPanelBody';
import UIPanelFooter from 'UIComponents/panel/UIPanelFooter';
import UIPanelHeader from 'UIComponents/panel/UIPanelHeader';
import UIPanelSection from 'UIComponents/panel/UIPanelSection';
import { getHasInactiveCards } from '../../../crm_ui/board/BoardCard/utils/InactiveCardUtils';
import { useSelectedObjectTypeDef } from '../../../crmObjects/hooks/useSelectedObjectTypeDef';
export var EditCardsPanel = function EditCardsPanel(_ref) {
  var onClose = _ref.onClose;

  var _useCardPreferences = useCardPreferences(),
      state = _useCardPreferences.state,
      resetFunctions = _useCardPreferences.resetFunctions,
      saveFunctions = _useCardPreferences.saveFunctions;

  var _useSelectedObjectTyp = useSelectedObjectTypeDef(),
      objectTypeId = _useSelectedObjectTyp.objectTypeId;

  var inactiveCardsStateSlice = state.get(inactiveCardsPrefix);
  var error = inactiveCardsStateSlice.get('error');
  var resetInactiveCards = resetFunctions.get(inactiveCardsPrefix);
  var resetCozyCards = resetFunctions.get(cozyCardsPrefix);

  var resetAll = function resetAll() {
    resetInactiveCards();
    resetCozyCards();
  };

  var hasInactiveCards = getHasInactiveCards(objectTypeId);
  return /*#__PURE__*/_jsxs(UIPanel, {
    "data-selenium-test": "edit-cards-panel",
    children: [/*#__PURE__*/_jsxs(UIPanelHeader, {
      children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
        "data-test-id": "header-close-button",
        onClick: function onClick() {
          onClose();
          resetAll();
        }
      }), /*#__PURE__*/_jsx(H2, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "indexPage.editCardsPanel.header"
        })
      })]
    }), /*#__PURE__*/_jsxs(UIPanelBody, {
      children: [/*#__PURE__*/_jsx(UIPanelSection, {
        children: /*#__PURE__*/_jsx(CozyCardPreferences, {})
      }), hasInactiveCards && /*#__PURE__*/_jsxs(UIPanelSection, {
        children: [/*#__PURE__*/_jsx(HR, {}), /*#__PURE__*/_jsx(InactiveCardPreferences, {})]
      })]
    }), /*#__PURE__*/_jsxs(UIPanelFooter, {
      align: "between",
      children: [/*#__PURE__*/_jsx(UIButton, {
        "data-test-id": "footer-close-button",
        use: "secondary",
        onClick: function onClick() {
          resetAll();
          onClose();
        },
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "indexPage.editCardsPanel.footer.cancelButton"
        })
      }), /*#__PURE__*/_jsx(UIButton, {
        "data-test-id": "footer-save-button",
        use: "primary",
        disabled: !!error,
        onClick: function onClick() {
          var saveCozy = saveFunctions.get('COZY_CARDS')();
          var saveInactive = saveFunctions.get('INACTIVE_CARDS')();
          onClose();
          return Promise.all([saveCozy, saveInactive]).then(function () {
            Alerts.addSuccess('indexPage.editCardsPanel.alertSuccess', {}, {
              'data-test-id': 'card-preference-update-success-alert'
            });
          }, function () {
            Alerts.addError('indexPage.editCardsPanel.alertFailure', {}, {
              'data-test-id': 'card-preference-update-error-alert'
            });
          });
        },
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "indexPage.editCardsPanel.footer.saveButton"
        })
      })]
    })]
  });
};
EditCardsPanel.propTypes = {
  onClose: PropTypes.func.isRequired
};