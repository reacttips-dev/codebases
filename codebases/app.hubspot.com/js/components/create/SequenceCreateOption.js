'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import partial from 'transmute/partial';
import UISelectableButton from 'UIComponents/button/UISelectableButton';
import UIIllustration from 'UIComponents/image/UIIllustration';
import H5 from 'UIComponents/elements/headings/H5';

var SequenceCreateOption = function SequenceCreateOption(_ref) {
  var sequenceName = _ref.sequenceName,
      sequenceDescription = _ref.sequenceDescription,
      index = _ref.index,
      selectedOption = _ref.selectedOption,
      onSelectOption = _ref.onSelectOption,
      seleniumId = _ref.seleniumId;
  var selected = index === selectedOption;
  var fromScratch = index === 0;
  return /*#__PURE__*/_jsxs(UISelectableButton, {
    className: "m-x-0 m-bottom-5 p-all-5",
    "data-selenium-test": seleniumId,
    block: true,
    selected: selected,
    onSelectedChange: partial(onSelectOption, index),
    children: [fromScratch && /*#__PURE__*/_jsx(UIIllustration, {
      className: "m-all-0 m-right-3",
      width: 100,
      name: "building"
    }), /*#__PURE__*/_jsxs("div", {
      className: "text-left m-left-2",
      children: [/*#__PURE__*/_jsx(H5, {
        children: sequenceName
      }), /*#__PURE__*/_jsx("p", {
        children: sequenceDescription
      })]
    })]
  });
};

SequenceCreateOption.propTypes = {
  sequenceName: PropTypes.string.isRequired,
  sequenceDescription: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  selectedOption: PropTypes.number.isRequired,
  onSelectOption: PropTypes.func.isRequired,
  seleniumId: PropTypes.string
};
export default SequenceCreateOption;