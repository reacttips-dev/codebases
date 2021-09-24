'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import I18n from 'I18n';
import UIAccordionItem from 'UIComponents/accordion/UIAccordionItem';
import UIList from 'UIComponents/list/UIList';
import Small from 'UIComponents/elements/Small';

var toI18nText = function toI18nText(name, opts) {
  return I18n.text("draftSmartDetections.suggestions.rules.bodyQuestionCountDescription." + name, opts);
};

var QuestionCountDescription = function QuestionCountDescription(_ref) {
  var questionCount = _ref.questionCount;
  return /*#__PURE__*/_jsxs("div", {
    children: [/*#__PURE__*/_jsx("p", {
      className: "m-bottom-1",
      children: toI18nText('questionCount', {
        questionCount: questionCount
      })
    }), /*#__PURE__*/_jsx(UIAccordionItem, {
      title: I18n.text('draftSmartDetections.suggestions.viewExamples'),
      contentClassName: "m-top-0",
      children: /*#__PURE__*/_jsxs(UIList, {
        styled: true,
        childClassName: "m-bottom-3 m-x-0",
        className: "m-all-0 p-all-0",
        children: [/*#__PURE__*/_jsx(Small, {
          children: toI18nText('improvetWorkFlow')
        }), /*#__PURE__*/_jsx(Small, {
          children: toI18nText('rightNow')
        }), /*#__PURE__*/_jsx(Small, {
          children: toI18nText('lookingToGrow')
        })]
      })
    })]
  });
};

QuestionCountDescription.propTypes = {
  questionCount: PropTypes.number.isRequired
};
export default QuestionCountDescription;