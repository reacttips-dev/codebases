const locale = require('locale');

import type { Options } from './i18n.types';
import { makeFormat } from './makeFormat';

export const forNamespace = (
  ns: string | string[] = [],
  {
    shouldEscapeStrings = true,
    returnBlankForMissingStrings = false,
    canOmitSubstitutions = false,
  }: Options = {},
) =>
  makeFormat(
    Array.isArray(ns) ? ns : [ns],
    locale,
    'en.json in strings files',
    shouldEscapeStrings,
    returnBlankForMissingStrings,
    canOmitSubstitutions,
  );
