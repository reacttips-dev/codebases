'use es6';

import I18n from 'I18n';
import Immutable from 'immutable';
import unescapedText from 'I18n/utils/unescapedText';
import * as FolderValidationErrors from '../enums/FolderValidationErrors';
import getDoesStringOnlyContainSpaces from './getDoesStringOnlyContainSpaces'; // eslint-disable-next-line

var invalidFolderCharsRegExp = /[#\?&'";:\*\^!\$\|\/%@]/g;

function getI18nKey(suffix) {
  return "FileManagerCore.folderNameValidation." + suffix;
}

export default function validateFolderName(folderName) {
  if (getDoesStringOnlyContainSpaces(folderName)) {
    return {
      code: FolderValidationErrors.ONLY_WHITESPACES,
      message: I18n.text(getI18nKey('invalidNameOnlyWhitespace'))
    };
  }

  if (folderName.length > 100) {
    return {
      code: FolderValidationErrors.TOO_LONG,
      message: I18n.text(getI18nKey('tooLong'))
    };
  }

  var matches = folderName.match(invalidFolderCharsRegExp);

  if (matches) {
    var uniqueMatches = new Immutable.Set(matches);
    var invalidChars = uniqueMatches.join('');
    return {
      code: FolderValidationErrors.INVALID_CHARS,
      message: unescapedText(invalidChars.includes('"') ? getI18nKey('invalidCharsSingleQuote') : getI18nKey('invalidCharsDoubleQuote'), {
        invalidChars: invalidChars
      })
    };
  }

  return null;
}