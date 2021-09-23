'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { BOTTOM_PANEL, STYLES, prefix as cozyCardsPrefix } from '../../../crm_ui/board/cardPreferences/cozyCards/constants';
import { CozyCardIllustrationOptions } from './CozyCardIllustrationOptions';
import { useCardPreferences } from '../../../crm_ui/board/cardPreferences/CardPreferencesContextProvider';
import bottomPanelIllustration from 'bender-url!crm-index-ui/board/editCardsPanel/images/avatar_illustration.svg';
import compactIllustration from 'bender-url!crm-index-ui/board/editCardsPanel/images/compact_illustration.svg';
import defaultIllustration from 'bender-url!crm-index-ui/board/editCardsPanel/images/default_illustration.svg';
import FormattedMessage from 'I18n/components/FormattedMessage';
import H5 from 'UIComponents/elements/headings/H5';
import UICheckbox from 'UIComponents/input/UICheckbox';
import UIHelpIcon from 'UIComponents/icon/UIHelpIcon';
import UIImage from 'UIComponents/image/UIImage';
import { getHasAssociationsAndPriority } from '../../../crm_ui/board/BoardCard/utils/getHasAssociationsAndPriority';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
export var CozyCardPreferences = function CozyCardPreferences() {
  var _useCardPreferences = useCardPreferences(),
      state = _useCardPreferences.state,
      actions = _useCardPreferences.actions;

  var cozyStateSlice = state.get(cozyCardsPrefix);
  var isCozy = cozyStateSlice.get('STYLE') === STYLES.COZY;
  var isDisplayingBottomPanel = cozyStateSlice.get('BOTTOM_PANEL') === BOTTOM_PANEL.WITH_PANEL;
  var cozyActionsSlice = actions.get(cozyCardsPrefix);
  var setStyle = cozyActionsSlice.get('setStyle');
  var setBottomPanel = cozyActionsSlice.get('setBottomPanel');
  var objectTypeId = useSelectedObjectTypeId();
  var isAssociationsAndPriorityVisible = getHasAssociationsAndPriority(objectTypeId);
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(H5, {
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "indexPage.editCardsPanel.cozyCardsSection.header"
      })
    }), /*#__PURE__*/_jsx(CozyCardIllustrationOptions, {
      options: [{
        illustration: defaultIllustration,
        label: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "indexPage.editCardsPanel.cozyCardsSection.options.defaultOption"
        }),
        selected: !isCozy,
        onSelect: function onSelect() {
          setStyle(STYLES.COMFORTABLE);
        },
        key: 'default-option',
        testSelector: 'cozy-cards-radio-default'
      }, {
        illustration: compactIllustration,
        label: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "indexPage.editCardsPanel.cozyCardsSection.options.cozy"
        }),
        selected: isCozy,
        onSelect: function onSelect() {
          setStyle(STYLES.COZY);
        },
        key: 'cozy-option',
        testSelector: 'cozy-cards-radio-cozy'
      }]
    }), isAssociationsAndPriorityVisible && /*#__PURE__*/_jsx(UICheckbox, {
      "data-test-id": "bottom-panel-is-shown-input",
      onChange: function onChange(evt) {
        var val = evt.target.checked ? BOTTOM_PANEL.WITH_PANEL : BOTTOM_PANEL.WITHOUT_PANEL;
        setBottomPanel(val);
      },
      checked: isDisplayingBottomPanel,
      children: /*#__PURE__*/_jsx(UIHelpIcon, {
        title: /*#__PURE__*/_jsx(UIImage, {
          src: bottomPanelIllustration
        }),
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "indexPage.editCardsPanel.cozyCardsSection.bottomPanel.description"
        })
      })
    })]
  });
};