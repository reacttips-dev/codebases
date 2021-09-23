'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIScrollingColumn from 'UIComponents/layout/UIScrollingColumn';
import H3 from 'UIComponents/elements/headings/H3';
import SequenceCreateOption from './SequenceCreateOption';
import sequencesLibraryData from 'SequencesUI/library/sequencesLibraryData';
export default createReactClass({
  displayName: "SequenceCreateSidebar",
  propTypes: {
    selectedOption: PropTypes.number.isRequired,
    onSelectOption: PropTypes.func.isRequired
  },
  renderScratchOption: function renderScratchOption() {
    var sequenceData = sequencesLibraryData.first();
    return this.renderLibraryOption(sequenceData, 'start-sequence-from-scratch');
  },
  renderLibraryOption: function renderLibraryOption(sequenceData) {
    var seleniumTestId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'sequence-library-item';
    var _this$props = this.props,
        selectedOption = _this$props.selectedOption,
        onSelectOption = _this$props.onSelectOption;

    var _sequenceData$toObjec = sequenceData.toObject(),
        index = _sequenceData$toObjec.index,
        sequenceName = _sequenceData$toObjec.sequenceName,
        sequenceDescription = _sequenceData$toObjec.sequenceDescription;

    return /*#__PURE__*/_jsx(SequenceCreateOption, {
      seleniumId: seleniumTestId,
      sequenceName: sequenceName,
      sequenceDescription: sequenceDescription,
      index: index,
      selectedOption: selectedOption,
      onSelectOption: onSelectOption
    }, "sequence-create-option-" + index);
  },
  renderLibraryOptions: function renderLibraryOptions() {
    var _this = this;

    return sequencesLibraryData.rest().map(function (sequenceData) {
      return _this.renderLibraryOption(sequenceData);
    });
  },
  renderOptions: function renderOptions() {
    return /*#__PURE__*/_jsxs("div", {
      className: "p-all-10",
      children: [this.renderScratchOption(), /*#__PURE__*/_jsxs("div", {
        className: "p-top-4",
        "data-selenium-test": "sequence-library-list",
        children: [/*#__PURE__*/_jsx(H3, {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "library.sequences.header"
          })
        }), this.renderLibraryOptions()]
      })]
    });
  },
  render: function render() {
    return /*#__PURE__*/_jsx(UIScrollingColumn, {
      style: {
        width: 525
      },
      children: this.renderOptions()
    });
  }
});