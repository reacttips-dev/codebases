const locale = require('locale');

import type { Options } from './i18n.types';
import { makeFormat } from './makeFormat';

export const forEntities = (
  namespace: string,
  { shouldEscapeStrings = true }: Options = {},
) =>
  makeFormat(
    [namespace],
    locale,
    `en.json in ${namespace}`,
    shouldEscapeStrings,
  );
