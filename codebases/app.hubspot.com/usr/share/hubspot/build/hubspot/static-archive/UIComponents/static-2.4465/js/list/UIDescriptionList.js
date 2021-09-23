'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { SLINKY } from 'HubStyleTokens/colors';
import { MICROCOPY_SIZE } from 'HubStyleTokens/sizes';
import { margin as m } from '../styles/spacing';
var DescriptionList = styled.dl.withConfig({
  displayName: "UIDescriptionList__DescriptionList",
  componentId: "u588za-0"
})(["", ";dt{font-size:", ";color:", ";line-height:1.5;}dd{", ";", ";}"], m('y', 0), MICROCOPY_SIZE, SLINKY, m('left', 0), m('bottom', 3)); // eslint-disable-next-line react/prop-types

var UIDescriptionList = function UIDescriptionList(_ref) {
  var __as = _ref.as,
      props = _objectWithoutProperties(_ref, ["as"]);

  return /*#__PURE__*/_jsx(DescriptionList, Object.assign({}, props));
};

UIDescriptionList.displayName = 'UIDescriptionList';
UIDescriptionList.propTypes = {
  children: PropTypes.node
};
export default UIDescriptionList;