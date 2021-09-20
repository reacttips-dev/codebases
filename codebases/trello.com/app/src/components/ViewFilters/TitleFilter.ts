import {
  getWords,
  reWordSeparators,
} from 'app/common/lib/util/satisfies-filter';
import {
  BoardTableViewFilter,
  CardFilterCriteria,
} from './filters/BoardTableViewFilter';

import { FilterableCard } from './types';

export class TitleFilter implements BoardTableViewFilter {
  public title: string;

  constructor(value?: string) {
    this.title = value || '';
  }

  filterLength(): number {
    return this.title === '' ? 0 : 1;
  }

  isEmpty(): boolean {
    return this.filterLength() === 0;
  }

  setTitle(value: string | null) {
    this.title = value || '';
  }

  clear() {
    this.setTitle('');
  }

  toUrlParams(): {
    [key: string]: string | null;
  } {
    return { title: this.title || null };
  }

  satisfiesTitleFilter(filterableWords: FilterableCard['words']): boolean {
    // Want to match at least one word from our search
    const searchWords = getWords(this.title);

    if (searchWords.length > 0) {
      const actualWordsSet = new Set(filterableWords);

      const endsWithPartialWord = !reWordSeparators.test(
        this.title[this.title.length - 1],
      );

      const completeWords = endsWithPartialWord
        ? searchWords.slice(0, searchWords.length - 1)
        : searchWords;

      const partialWord = endsWithPartialWord
        ? searchWords[searchWords.length - 1]
        : undefined;

      const matchesAnyWord =
        completeWords.some((word) => actualWordsSet.has(word)) ||
        (partialWord &&
          filterableWords.some((word) => word.startsWith(partialWord)));

      return !!matchesAnyWord;
    }

    return true;
  }

  fromUrlParams({ title }: { [key: string]: string | null }): void {
    this.setTitle(title);
  }

  serializeToView() {
    return {};
  }

  deserializeFromView(view: CardFilterCriteria) {}
}
