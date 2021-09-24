'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { INACTIVE_LIMIT_UNITS } from '../../../crm_ui/board/cardPreferences/inactiveCards/constants';
import { prefix as inactiveCardsPrefix } from '../../../crm_ui/board/cardPreferences/inactiveCards/constants';
import { useCardPreferences } from '../../../crm_ui/board/cardPreferences/CardPreferencesContextProvider';
import FormattedMessage from 'I18n/components/FormattedMessage';
import I18n from 'I18n';
import UIFieldset from 'UIComponents/form/UIFieldset';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UIHelpIcon from 'UIComponents/icon/UIHelpIcon';
import UIImage from 'UIComponents/image/UIImage';
import UIInputGroup from 'UIComponents/form/UIInputGroup';
import UIMultiColumn from 'UIComponents/layout/UIMultiColumn';
import UIMultiColumnGroup from 'UIComponents/layout/UIMultiColumnGroup';
import UIMultiColumnItem from 'UIComponents/layout/UIMultiColumnItem';
import UINumberInput from 'UIComponents/input/UINumberInput';
import UIOverlay from 'UIComponents/overlay/UIOverlay';
import UISelect from 'UIComponents/input/UISelect';
import UIToggle from 'UIComponents/input/UIToggle';
import boardTourImage from 'bender-url!../images/board.svg';
import H5 from 'UIComponents/elements/headings/H5';
export var InactiveCardPreferences = function InactiveCardPreferences() {
  var _useCardPreferences = useCardPreferences(),
      state = _useCardPreferences.state,
      actions = _useCardPreferences.actions;

  var inactiveCardsStateSlice = state.get(inactiveCardsPrefix);
  var isTurnedOn = inactiveCardsStateSlice.get('ISTURNEDON');
  var unit = inactiveCardsStateSlice.get('UNIT');
  var value = inactiveCardsStateSlice.get('VALUE');
  var inactiveCardsActionSlice = actions.get(inactiveCardsPrefix);
  var setIsTurnedOn = inactiveCardsActionSlice.get('setIsTurnedOn');
  var setUnit = inactiveCardsActionSlice.get('setUnit');
  var setValue = inactiveCardsActionSlice.get('setValue');
  var error = inactiveCardsStateSlice.get('error');
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsxs(H5, {
      children: [/*#__PURE__*/_jsx(FormattedMessage, {
        message: "indexPage.editCardsPanel.inactiveCardsSection.header"
      }), ' ', /*#__PURE__*/_jsx(UIHelpIcon, {
        title: /*#__PURE__*/_jsxs("span", {
          children: [/*#__PURE__*/_jsx(FormattedMessage, {
            message: "indexPage.editCardsPanel.inactiveCardsSection.helpText"
          }), /*#__PURE__*/_jsx(UIImage, {
            src: boardTourImage,
            className: "p-top-2"
          })]
        }),
        tooltipPlacement: "bottom"
      })]
    }), /*#__PURE__*/_jsx(UIMultiColumn, {
      flush: true,
      children: /*#__PURE__*/_jsxs(UIMultiColumnGroup, {
        children: [/*#__PURE__*/_jsx(UIMultiColumnItem, {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "indexPage.editCardsPanel.inactiveCardsSection.turnOnAndOff.description"
          })
        }), /*#__PURE__*/_jsx(UIMultiColumnItem, {
          children: /*#__PURE__*/_jsx(UIToggle, {
            "data-test-id": "inactive-is-turned-on-input",
            "data-selenium-checked": isTurnedOn,
            size: "small",
            checked: isTurnedOn,
            onChange: function onChange(e) {
              return setIsTurnedOn(e.target.checked);
            }
          })
        })]
      })
    }), /*#__PURE__*/_jsx(UIFieldset, {
      overlay: !isTurnedOn ? /*#__PURE__*/_jsx(UIOverlay, {
        contextual: true,
        use: "light",
        width: 350
      }) : undefined,
      children: /*#__PURE__*/_jsxs(UIInputGroup, {
        label: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "indexPage.editCardsPanel.inactiveCardsSection.setLimit.header"
        }),
        use: "itemBoth",
        children: [/*#__PURE__*/_jsx(UIFormControl, {
          error: !!error,
          validationMessage: error && /*#__PURE__*/_jsx(FormattedMessage, {
            message: error
          }),
          children: /*#__PURE__*/_jsx(UINumberInput, {
            "data-test-id": "inactive-limit-input",
            onChange: function onChange(e) {
              return setValue(e.target.value);
            },
            value: value
          })
        }), /*#__PURE__*/_jsx(UIFormControl, {
          children: /*#__PURE__*/_jsx(UISelect, {
            "data-test-id": "inactive-limit-unit-input",
            options: [{
              value: INACTIVE_LIMIT_UNITS.DAYS,
              text: I18n.text('indexPage.editCardsPanel.inactiveCardsSection.units.days', {
                count: value || 0
              })
            }, {
              value: INACTIVE_LIMIT_UNITS.WEEKS,
              text: I18n.text('indexPage.editCardsPanel.inactiveCardsSection.units.weeks', {
                count: value || 0
              })
            }],
            clearable: false,
            onChange: function onChange(e) {
              return setUnit(e.target.value);
            },
            value: unit
          })
        })]
      })
    })]
  });
};