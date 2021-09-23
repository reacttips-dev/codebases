import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import styled from 'styled-components';
import PortalIdParser from 'PortalIdParser';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIButton from 'UIComponents/button/UIButton';
import UITourNextButton from 'ui-shepherd-react/button/UITourNextButton';
import UITourBackButton from 'ui-shepherd-react/button/UITourBackButton';
import { propTypeForSizes, toShorthandSize // @ts-expect-error dependency missing types
} from 'UIComponents/utils/propTypes/tshirtSize';
import OnboardingTourFinishButton from './OnboardingTourFinishButton';
import { FINISH, NEXT } from '../constants/TourActions';
var ButtonsWrapper = styled.div.withConfig({
  displayName: "OnboardingTourButtons__ButtonsWrapper",
  componentId: "yr77wp-0"
})(["margin-bottom:-8px;margin-right:-8px;"]);
export default function OnboardingTourButtons(_ref) {
  var beforeBackClickHandler = _ref.beforeBackClickHandler,
      buttons = _ref.buttons,
      buttonSize = _ref.buttonSize,
      completeActionKey = _ref.completeActionKey,
      enableBackButton = _ref.enableBackButton;
  return /*#__PURE__*/_jsx(ButtonsWrapper, {
    children: /*#__PURE__*/_jsxs(UIFlex, {
      justify: "between",
      wrap: "wrap",
      children: [enableBackButton && /*#__PURE__*/_jsx(UITourBackButton, {
        beforeBack: beforeBackClickHandler,
        className: "m-left-0 m-bottom-2 p-left-3",
        size: toShorthandSize(buttonSize),
        use: "tertiary-light"
      }), buttons.map(function (button, index) {
        var action = button.action,
            disableTaskCompletionModal = button.disableTaskCompletionModal,
            text = button.text,
            url = button.url;
        var buttonProps = {
          className: 'm-left-0 m-bottom-2 m-right-2',
          href: url && url.replace('%portalId%', String(PortalIdParser.get())),
          size: toShorthandSize(buttonSize),
          use: !index ? 'primary' : undefined
        };

        if (action === NEXT) {
          return /*#__PURE__*/_jsx(UITourNextButton, Object.assign({
            "data-test-id": NEXT + "-onboarding-step-button"
          }, buttonProps, {
            children: text
          }), index);
        }

        if (action === FINISH) {
          var shouldOpenTaskCompletionModal = completeActionKey && !url && !disableTaskCompletionModal;
          return /*#__PURE__*/_jsx(OnboardingTourFinishButton, Object.assign({
            "data-test-id": FINISH + "-onboarding-step-button",
            taskKey: shouldOpenTaskCompletionModal ? completeActionKey : undefined
          }, buttonProps, {
            children: text
          }), index);
        }

        return /*#__PURE__*/_jsx(UIButton, Object.assign({
          "data-test-id": "onboarding-step-button"
        }, buttonProps, {
          children: text
        }), index);
      })]
    })
  });
}
OnboardingTourButtons.defaultProps = {
  buttonSize: 'md'
};
OnboardingTourButtons.propTypes = {
  beforeBackClickHandler: PropTypes.func,
  buttonSize: propTypeForSizes(['sm', 'md'], ['default']),
  buttons: PropTypes.arrayOf(PropTypes.object).isRequired,
  completeActionKey: PropTypes.string,
  enableBackButton: PropTypes.bool
};