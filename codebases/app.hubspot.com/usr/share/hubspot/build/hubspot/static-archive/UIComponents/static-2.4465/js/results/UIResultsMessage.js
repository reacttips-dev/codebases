'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { isValidElement } from 'react';
import styled from 'styled-components';
import { getComponentPropType } from '../utils/propTypes/componentProp';
import createLazyPropType from '../utils/propTypes/createLazyPropType';
import H2 from '../elements/headings/H2';
import lazyEval from '../utils/lazyEval';
import UIIllustration from '../image/UIIllustration';
import UISection from '../section/UISection';
import { getIllustrationNamePropType } from '../utils/propTypes/illustrationName';
var MessageOuter = styled(UISection).withConfig({
  displayName: "UIResultsMessage__MessageOuter",
  componentId: "iar5ts-0"
})(["text-align:center;"]);
var MessageImage = styled(UIIllustration).withConfig({
  displayName: "UIResultsMessage__MessageImage",
  componentId: "iar5ts-1"
})(["margin-bottom:40px;"]);
var defaultIllustrationProps = {
  width: 175
};

var renderTitle = function renderTitle(title) {
  if (!title) return null;
  if ( /*#__PURE__*/isValidElement(title)) return title;
  return /*#__PURE__*/_jsx(H2, {
    children: lazyEval(title)
  });
};

var renderImage = function renderImage(illustration, illustrationProps, Image) {
  if (!illustration && !Image) return null;
  return /*#__PURE__*/_jsx(Image, Object.assign({
    name: illustration
  }, defaultIllustrationProps, {}, illustrationProps));
};

export default function UIResultsMessage(props) {
  var Body = props.Body,
      children = props.children,
      illustration = props.illustration,
      illustrationProps = props.illustrationProps,
      Image = props.Image,
      title = props.title,
      rest = _objectWithoutProperties(props, ["Body", "children", "illustration", "illustrationProps", "Image", "title"]);

  return /*#__PURE__*/_jsxs(MessageOuter, Object.assign({}, rest, {
    role: "alert",
    use: "island",
    children: [renderImage(illustration, illustrationProps, Image), renderTitle(title), /*#__PURE__*/_jsx(Body, {
      children: children
    })]
  }));
}
UIResultsMessage.propTypes = {
  Body: PropTypes.elementType,
  children: PropTypes.node,
  illustration: getIllustrationNamePropType(),
  illustrationProps: PropTypes.object,
  Image: getComponentPropType(UIIllustration),
  title: createLazyPropType(PropTypes.node)
};
UIResultsMessage.defaultProps = {
  Body: 'div',
  Image: MessageImage,
  illustrationProps: defaultIllustrationProps
};
UIResultsMessage.displayName = 'UIResultsMessage';