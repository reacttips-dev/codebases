'use es6';

import { tinymcePasteIdentifierTag } from '../constants/paste';
import { googleDocImportIdentifierTag } from '../constants/googleDocs';
import convertGoogleToHTML, { convertGoogleDocToHTML } from './convertGoogleToHTML';
import convertMSWordToHTML from './convertMSWordToHTML';
import convertEvernoteToHTML from './convertEvernoteToHTML';
import { compose } from '../utils/iterables';
import { getGenericPasteProcessingConverter } from './genericPasteProcessingConverter';
import { processEntities } from './processEntities';
var DOCS_IMPORT_TEST = googleDocImportIdentifierTag;
var DOCS_TEST = new RegExp("id=\"docs-internal-guid");
var WORD_TEST = /<meta name=ProgId content=Word\.Document>/;
var EVERNOTE_TEST = /style=("|')-.[a-z]-clipboard:true;"/i;
var TINYMCE_TEST = tinymcePasteIdentifierTag;
var UNKNOWN = 'unknown';
export var converterNames = {
  CONVERT_GOOGLE_IMPORT_TO_HTML: 'googleImport',
  CONVERT_GOOGLE_TO_HTML: 'google',
  CONVERT_MSWORD_TO_HTML: 'msword',
  CONVERT_EVERNOTE_TO_HTML: 'evernote',
  TINYMCE: 'tinymce'
};
var pasteSourceMap = [{
  test: DOCS_IMPORT_TEST,
  converter: convertGoogleDocToHTML,
  converterName: converterNames.CONVERT_GOOGLE_IMPORT_TO_HTML
}, {
  test: DOCS_TEST,
  converter: convertGoogleToHTML,
  converterName: converterNames.CONVERT_GOOGLE_TO_HTML
}, {
  test: WORD_TEST,
  converter: convertMSWordToHTML,
  converterName: converterNames.CONVERT_MSWORD_TO_HTML
}, {
  test: EVERNOTE_TEST,
  converter: convertEvernoteToHTML,
  converterName: converterNames.CONVERT_EVERNOTE_TO_HTML
}, {
  test: TINYMCE_TEST,
  converter: function converter(x) {
    return x;
  },
  converterName: converterNames.TINYMCE
}];
export var getBaseConverterForHTML = function getBaseConverterForHTML(html) {
  return pasteSourceMap.find(function (pasteSource) {
    return html.match(pasteSource.test);
  }) || {
    converter: function converter(x) {
      return x;
    },
    converterName: UNKNOWN
  };
};
export var getPastePreProcessWithConfig = function getPastePreProcessWithConfig() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      formatTransformMap = _ref.formatTransformMap,
      clearAllStyles = _ref.clearAllStyles,
      defaultStylesMap = _ref.defaultStylesMap,
      defaultAttributesMap = _ref.defaultAttributesMap;

  return function () {
    var html = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    var _getBaseConverterForH = getBaseConverterForHTML(html),
        converter = _getBaseConverterForH.converter,
        converterName = _getBaseConverterForH.converterName; // Add as many converters that take in one {html} arg as wanted


    var composedConverter = compose(processEntities, getGenericPasteProcessingConverter(formatTransformMap, clearAllStyles || converterName === UNKNOWN, defaultStylesMap, defaultAttributesMap), converter);
    return {
      converter: composedConverter,
      converterName: converterName
    };
  };
};