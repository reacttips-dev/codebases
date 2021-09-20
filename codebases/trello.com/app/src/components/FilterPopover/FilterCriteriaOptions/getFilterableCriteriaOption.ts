import { getWords } from 'app/common/lib/util/satisfies-filter';
import type { FilterableCriteriaOption } from './types';

export const getFilterableCriteriaOption = (
  words: string | string[],
  value: string,
): FilterableCriteriaOption => {
  const strings = Array.isArray(words) ? words : [words];
  const filterableWords = strings.flatMap(getWords);
  return {
    filterableWords,
    label: filterableWords.join(' '),
    value,
  };
};
