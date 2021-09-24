'use es6';

import _taggedTemplateLiteralLoose from "@babel/runtime/helpers/esm/taggedTemplateLiteralLoose";

function _templateObject() {
  var data = _taggedTemplateLiteralLoose(["\n  *, ::after, ::before {\n    box-sizing: border-box;\n  }\n  ", "\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

import { createGlobalStyle } from 'styled-components';
import { getGlobalTypographyStyles } from './utils/getGlobalTypographyStyles';
var VizExGlobalStyle = createGlobalStyle(_templateObject(), getGlobalTypographyStyles);
export default VizExGlobalStyle;