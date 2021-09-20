const locale = require('locale');

import type { Options } from './i18n.types';
import { makeFormat } from './makeFormat';

export const forTemplate = (
  namespace: string,
  {
    shouldEscapeStrings = true,
    returnBlankForMissingStrings = false,
    canOmitSubstitutions = false,
  }: Options = {},
) =>
  makeFormat(
    ['templates', namespace],
    locale,
    'templates/en.json',
    shouldEscapeStrings,
    returnBlankForMissingStrings,
    canOmitSubstitutions,
  );
