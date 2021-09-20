import {
  BoardTableViewFilter,
  CardFilterCriteria,
  SortFields,
  SortType,
} from './BoardTableViewFilter';

export class SortFilter
  extends Array<SortType>
  implements BoardTableViewFilter {
  enableSorts(sortArray: Array<SortType>) {
    sortArray.forEach((sort) => {
      this.push(sort);
    });
    return this;
  }

  filterLength(): number {
    return this.length;
  }

  isEmpty(): boolean {
    return this.filterLength() === 0;
  }

  toUrlParams(): {
    [key: string]: string | null;
  } {
    const sortString = [...this].join(',');
    return { sort: sortString || null };
  }

  fromUrlParams({ sort: sortString }: { [key: string]: string | null } = {}) {
    const validatedSortArray =
      sortString
        ?.split(',')
        .filter((filter) => this.isValidSortField(filter)) || [];
    validatedSortArray.forEach((sortField: SortType) => {
      this.push(sortField);
    });
  }

  /**
   * Check whether a sort is enabled, regardless of its direction.
   * example:
   * sortFilter is: ['-due']
   * sortFilter.isEnabled('due') -> true
   * sortFilter.isEnabled('-due') -> true
   *
   * @param filter - string to check;
   * @returns boolean indicating whether the sort string is enabled
   */
  isEnabled(filter: string) {
    if (!this.isValidSortField(filter)) {
      return false;
    }

    const trimmedFilter =
      filter[0] === '-' ? filter.slice(1, filter.length) : filter;

    return this.find((enabledFilter) => enabledFilter.includes(trimmedFilter))
      ? true
      : false;
  }

  disable(filter: SortType): SortFilter {
    const trimmedFilter =
      filter[0] === '-' ? filter.slice(1, filter.length) : filter;

    const newSortFilter = this.filter(
      (enabledFilter) => !enabledFilter.includes(trimmedFilter),
    );

    return new SortFilter().enableSorts(newSortFilter);
  }

  enable(filter: SortType): SortFilter {
    if (!this.isEnabled(filter)) {
      this.push(filter);
    }
    return new SortFilter().enableSorts(this);
  }

  toggle(filter: SortType): SortFilter {
    if (this.isEnabled(filter)) {
      this.disable(filter);
    } else {
      this.enable(filter);
    }

    // Returns a new instance so that we can use it for `setState`.
    return new SortFilter().enableSorts(this);
  }

  /**
   * Validate that a string conforms to a valid sortable field.
   *
   * Checks the length of the filter string and whether it exists in the VALID_FIELDS_ARRAY
   *
   * @param sortFieldString: string
   * @returns boolean
   */
  isValidSortField(sortFieldString: string): sortFieldString is SortType {
    if (!(sortFieldString?.length > 1)) {
      return false;
    }
    const sliceIndexStart = sortFieldString[0] === '-' ? 1 : 0;

    return (
      sortFieldString?.length > 1 &&
      (SortFields as readonly string[]).includes(
        sortFieldString.slice(sliceIndexStart, sortFieldString.length),
      )
    );
  }

  serializeToView() {
    return {
      sort: [...this],
    };
  }

  deserializeFromView(cardFilterCriteria: CardFilterCriteria) {
    const sortArray = cardFilterCriteria.sort || [];
    sortArray.forEach((sort) => {
      if (this.isValidSortField(sort)) {
        this.push(sort);
      }
    });
  }
}
