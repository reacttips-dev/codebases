function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import { stateFromElement } from 'draft-js-import-element';
import parseHTML from './parseHTML';
var defaultOptions = {};
export default function stateFromHTML(html, options) {
  var _ref = options || defaultOptions,
      parser = _ref.parser,
      otherOptions = _objectWithoutProperties(_ref, ["parser"]);

  if (parser == null) {
    parser = parseHTML;
  }

  var element = parser(html);
  return stateFromElement(element, otherOptions);
}