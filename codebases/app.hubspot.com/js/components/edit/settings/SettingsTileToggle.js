'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import Small from 'UIComponents/elements/Small';
import UIBox from 'UIComponents/layout/UIBox';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIFormLabel from 'UIComponents/form/UIFormLabel';
import UITile from 'UIComponents/tile/UITile';
import UITileSection from 'UIComponents/tile/UITileSection';
import UIToggle from 'UIComponents/input/UIToggle';
import EditSequenceTooltip from 'SequencesUI/components/edit/EditSequenceTooltip';

var SettingsTileToggle = function SettingsTileToggle(_ref) {
  var labelNode = _ref.labelNode,
      helpNode = _ref.helpNode,
      inputId = _ref.inputId,
      readOnly = _ref.readOnly,
      checked = _ref.checked,
      onChange = _ref.onChange,
      distance = _ref.distance,
      additionalTileSection = _ref.additionalTileSection,
      toggleProps = _objectWithoutProperties(_ref, ["labelNode", "helpNode", "inputId", "readOnly", "checked", "onChange", "distance", "additionalTileSection"]);

  return /*#__PURE__*/_jsxs(UITile, {
    compact: true,
    distance: distance,
    children: [/*#__PURE__*/_jsx(UITileSection, {
      children: /*#__PURE__*/_jsxs(UIFlex, {
        justify: "between",
        align: "start",
        children: [/*#__PURE__*/_jsxs(UIBox, {
          children: [/*#__PURE__*/_jsx(EditSequenceTooltip, {
            children: /*#__PURE__*/_jsx(UIFormLabel, {
              htmlFor: inputId,
              readOnly: readOnly,
              className: "p-top-0",
              children: /*#__PURE__*/_jsx("b", {
                children: labelNode
              })
            })
          }), /*#__PURE__*/_jsx(Small, {
            use: "help",
            className: "display-block",
            children: helpNode
          })]
        }), /*#__PURE__*/_jsx(EditSequenceTooltip, {
          children: /*#__PURE__*/_jsx(UIToggle, Object.assign({
            "data-test-id": inputId,
            id: inputId,
            readOnly: readOnly,
            checked: checked,
            onChange: onChange
          }, toggleProps))
        })]
      })
    }), additionalTileSection]
  });
};

SettingsTileToggle.propTypes = {
  labelNode: PropTypes.node.isRequired,
  helpNode: PropTypes.node.isRequired,
  inputId: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
  distance: PropTypes.string,
  additionalTileSection: PropTypes.node
};
export default SettingsTileToggle;