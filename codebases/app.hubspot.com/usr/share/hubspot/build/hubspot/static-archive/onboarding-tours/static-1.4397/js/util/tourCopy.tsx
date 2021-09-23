import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UILink from 'UIComponents/link/UILink';
import { externalLinkClicked } from './tourTracking';
import { getStepId } from './tourTransformer';
/**
 * Given a tour, this function will populate that tour with copy given that the copy is formatted correctly.
 * @param {tourConfig} tour
 */

export var populateTourWithCopy = function populateTourWithCopy(tour) {
  var i18nPrefix = tour.i18nPrefix;

  if (tour.recommendNextTour) {
    tour.recommendNextTour.title = I18n.text(i18nPrefix + ".recommendNextTour.title");
    tour.recommendNextTour.text = I18n.text(i18nPrefix + ".recommendNextTour.text");
    tour.recommendNextTour.cta = I18n.text(i18nPrefix + ".recommendNextTour.cta");
  }

  tour.steps.forEach(function (step, stepIndex) {
    var stepNumber = stepIndex + 1;

    if (step.text) {
      step.text = /*#__PURE__*/_jsx(FormattedHTMLMessage, {
        message: i18nPrefix + ".step" + stepNumber + ".text"
      });
    }

    if (step.externalStepLink) {
      step.externalStepLink = /*#__PURE__*/_jsx(UILink, {
        external: true,
        href: step.externalStepLink,
        onClick: function onClick() {
          return externalLinkClicked(getStepId(stepIndex), tour.alias);
        },
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: i18nPrefix + ".step" + stepNumber + ".externalStepLink"
        })
      });
    }

    if (step.title) {
      step.title = I18n.text(i18nPrefix + ".step" + stepNumber + ".title");
    }

    if (step.actionText) {
      step.actionText = I18n.text(i18nPrefix + ".step" + stepNumber + ".actionText");
    }

    if (typeof step.showMeHowClickHandler === 'function') {
      step.showMeHowText = /*#__PURE__*/_jsx(FormattedJSXMessage, {
        elements: {
          Link: function Link(props) {
            return /*#__PURE__*/_jsx(UILink, Object.assign({}, props, {
              onClick: step.showMeHowClickHandler
            }));
          }
        },
        message: i18nPrefix + ".step" + stepNumber + ".showMeHow_jsx"
      });
    }

    if (step.buttons) {
      step.buttons.forEach(function (button, buttonIndex) {
        var buttonNumber = buttonIndex + 1;

        if (button.text) {
          button.text = I18n.text(i18nPrefix + ".step" + stepNumber + ".button" + buttonNumber);
        } else if (button.commonText) {
          button.text = I18n.text("onboarding-tours.tours.common.button." + button.commonText);
        }
      });
    }
  });
  return tour;
};