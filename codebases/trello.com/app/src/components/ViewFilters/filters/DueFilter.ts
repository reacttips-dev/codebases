import moment from 'moment';
import { FilterableCard } from 'app/src/components/ViewFilters/types';
import {
  BoardTableViewFilter,
  CardFilterCriteria,
  DateType,
} from './BoardTableViewFilter';

export enum SortingOption {
  Ascending,
  Descending,
}

export const DAY_MILLIS = 86400000;

export enum RangeFilter {
  None = 0,
  NextDay = DAY_MILLIS,
  NextWeek = DAY_MILLIS * 7,
  NextMonth = DAY_MILLIS * 30,
  HasNoDueDate = 4,
}

export enum CompleteFilter {
  None,
  Complete,
  Incomplete,
}

export type DueFilterValue =
  | RangeFilter
  | CompleteFilter
  | boolean
  | SortingOption;

export const DUE_FILTER_OPTIONS = [
  'day',
  'week',
  'month',
  'overdue',
  'notdue',
  'complete',
  'incomplete',
] as const;

export type BoardDueFilterString = typeof DUE_FILTER_OPTIONS[number] | null;

const dueMap: Record<
  Extract<BoardDueFilterString, 'day' | 'week' | 'month'>,
  number
> = {
  day: 1,
  week: 7,
  month: 28,
};

interface DueFilterParameters {
  range?: RangeFilter;
  complete?: CompleteFilter;
  overdue?: boolean;
}

export class DueFilter implements BoardTableViewFilter {
  public rangeFilter: RangeFilter;
  public completeFilter: CompleteFilter;
  public overdue: boolean;

  constructor({
    range = RangeFilter.None,
    complete = CompleteFilter.None,
    overdue = false,
  }: DueFilterParameters = {}) {
    this.rangeFilter = range;
    this.completeFilter = complete;
    this.overdue = overdue;
  }

  filterLength(): number {
    const urlParams = this.toUrlParams();
    const dueLength = urlParams['due']?.split(',').length;
    const dueCompleteLength = urlParams['dueComplete'] ? 1 : 0;
    return (dueLength ? dueLength : 0) + dueCompleteLength;
  }

  isEmpty(): boolean {
    return (
      this.rangeFilter === RangeFilter.None &&
      this.completeFilter === CompleteFilter.None &&
      !this.overdue
    );
  }

  clear() {
    this.setRangeFilter(RangeFilter.None);
    this.setCompleteFilter(CompleteFilter.None);
    this.setOverdue(false);
  }

  setRangeFilter(value: RangeFilter) {
    this.rangeFilter = value;

    if (this.rangeFilter === RangeFilter.HasNoDueDate) {
      this.overdue = false;
      this.completeFilter = CompleteFilter.None;
    }

    return this;
  }

  setCompleteFilter(value: CompleteFilter) {
    this.completeFilter = value;

    if (this.completeFilter === CompleteFilter.Complete && this.overdue) {
      this.overdue = false;
    }

    if (
      this.completeFilter !== CompleteFilter.None &&
      this.rangeFilter === RangeFilter.HasNoDueDate
    ) {
      this.rangeFilter = RangeFilter.None;
    }

    return this;
  }

  setOverdue(value: boolean) {
    this.overdue = value;

    if (this.overdue) {
      if (this.completeFilter === CompleteFilter.Complete) {
        this.completeFilter = CompleteFilter.None;
      }

      if (this.rangeFilter === RangeFilter.HasNoDueDate) {
        this.rangeFilter = RangeFilter.None;
      }
    }

    return this;
  }

  getMinDue() {
    switch (this.rangeFilter) {
      case RangeFilter.NextDay:
      case RangeFilter.NextWeek:
      case RangeFilter.NextMonth:
        return moment().toISOString();
      case RangeFilter.HasNoDueDate:
      case RangeFilter.None:
      default:
        return null;
    }
  }

  getMaxDue() {
    switch (this.rangeFilter) {
      case RangeFilter.NextDay:
        return moment().add(1, 'days').toISOString();
      case RangeFilter.NextWeek:
        return moment().add(7, 'days').toISOString();
      case RangeFilter.NextMonth:
        return moment().add(30, 'days').toISOString();
      case RangeFilter.HasNoDueDate:
      case RangeFilter.None:
      default:
        return null;
    }
  }

  getDueComplete(): boolean | null {
    if (this.overdue && this.completeFilter === CompleteFilter.None) {
      return null;
    }

    if (this.completeFilter === CompleteFilter.None) {
      return null;
    }

    return this.completeFilter === CompleteFilter.Complete;
  }

  getOverdue(): boolean {
    return Boolean(this.overdue);
  }

  satisfiesDueFilter({
    due,
    complete,
  }: {
    due: FilterableCard['due'];
    complete: FilterableCard['complete'];
  }): boolean {
    if (this.isEmpty()) {
      return true;
    }

    const now = new Date();

    const dueString = this.toBoardString();
    const isCardComplete = complete === CompleteFilter.Complete;

    if (dueString) {
      switch (dueString) {
        case 'complete':
          if (!isCardComplete) return false;
          break;
        case 'incomplete':
          if (complete !== CompleteFilter.Incomplete) return false;
          break;
        case 'notdue':
          if (due !== null) return false;
          break;
        case 'overdue':
          if (due === null || isCardComplete || moment(due).isAfter(now)) {
            return false;
          }
          break;
        default: {
          if (!due || isCardComplete) {
            return false;
          }
          const maxDate = moment().add(dueMap[dueString], 'day');
          if (!moment(due).isBetween(now, maxDate)) {
            return false;
          }

          break;
        }
      }
    }

    return true;
  }

  toBoardString(): BoardDueFilterString {
    switch (this.rangeFilter) {
      case RangeFilter.NextDay:
        return 'day';
      case RangeFilter.NextWeek:
        return 'week';
      case RangeFilter.NextMonth:
        return 'month';
      case RangeFilter.HasNoDueDate:
        return 'notdue';
      default:
        break;
    }

    switch (this.completeFilter) {
      case CompleteFilter.Complete:
        return 'complete';
      case CompleteFilter.Incomplete:
        return 'incomplete';
      default:
        break;
    }
    if (this.overdue) {
      return 'overdue';
    }

    return null;
  }

  toUrlParams(): {
    [key: string]: string | null;
  } {
    const rangeString = (() => {
      // eslint-disable-next-line default-case
      switch (this.rangeFilter) {
        case RangeFilter.NextDay:
          return 'day';
        case RangeFilter.NextWeek:
          return 'week';
        case RangeFilter.NextMonth:
          return 'month';
        case RangeFilter.HasNoDueDate:
          return 'none'; // <-- this is a little weird, compared to the enum naming
        case RangeFilter.None:
          return null;
      }
    })();
    const overdueString = this.overdue ? 'overdue' : null;
    const dueArray = [rangeString, overdueString].filter((s) => s !== null);
    const due = dueArray.join(',') || null;

    const dueComplete = (() => {
      // eslint-disable-next-line default-case
      switch (this.completeFilter) {
        case CompleteFilter.None:
          return null;
        case CompleteFilter.Complete:
          return 'true';
        case CompleteFilter.Incomplete:
          return 'false';
      }
    })();

    return {
      due,
      dueComplete,
    };
  }

  fromBoardString(boardString: BoardDueFilterString) {
    this.clear();
    switch (boardString) {
      case 'day':
        this.setRangeFilter(RangeFilter.NextDay);
        break;
      case 'week':
        this.setRangeFilter(RangeFilter.NextWeek);
        break;
      case 'month':
        this.setRangeFilter(RangeFilter.NextMonth);
        break;
      case 'notdue':
        this.setRangeFilter(RangeFilter.HasNoDueDate);
        break;
      case 'complete':
        this.setCompleteFilter(CompleteFilter.Complete);
        break;
      case 'incomplete':
        this.setCompleteFilter(CompleteFilter.Incomplete);
        break;
      case 'overdue':
        this.setOverdue(true);
        break;
      default:
        break;
    }
  }

  fromUrlParams({ due, dueComplete }: { [key: string]: string | null }) {
    const [first, second] = due?.split(',') || [];
    const overdue = second === 'overdue' || (!second && first === 'overdue');
    const rangeString = first !== 'overdue' ? first : null;

    switch (rangeString) {
      case 'day':
        this.setRangeFilter(RangeFilter.NextDay);
        break;
      case 'week':
        this.setRangeFilter(RangeFilter.NextWeek);
        break;
      case 'month':
        this.setRangeFilter(RangeFilter.NextMonth);
        break;
      case 'none':
        this.setRangeFilter(RangeFilter.HasNoDueDate);
        break;
      default:
        this.setRangeFilter(RangeFilter.None);
        break;
    }

    this.setOverdue(overdue);

    switch (dueComplete) {
      case 'true':
      case '1':
        this.setCompleteFilter(CompleteFilter.Complete);
        break;
      case 'false':
      case '0':
        this.setCompleteFilter(CompleteFilter.Incomplete);
        break;
      default:
        this.setCompleteFilter(CompleteFilter.None);
        break;
    }
  }

  serializeToView() {
    const overdue = this.getOverdue();
    const rangeFilter = this.rangeFilter;
    let start,
      end = null;

    if (
      [
        RangeFilter.NextDay,
        RangeFilter.NextWeek,
        RangeFilter.NextMonth,
      ].includes(rangeFilter)
    ) {
      start = { dateType: DateType.RELATIVE, value: 0 };
      end = { dateType: DateType.RELATIVE, value: rangeFilter };
    }

    if (overdue) {
      start = null;
      // Only set the end range if not already set by the rangeFilter
      end = end
        ? end
        : {
            dateType: DateType.RELATIVE,
            value: 0,
          };
    }

    const due =
      start || end
        ? {
            start,
            end,
          }
        : null;
    return {
      due,
      dueComplete: this.getDueComplete(),
    };
  }

  deserializeFromView(cardFilterCriteria: CardFilterCriteria) {
    if (cardFilterCriteria.due?.start === null) {
      this.setOverdue(true);
    }
    switch (cardFilterCriteria.due?.end?.value) {
      case RangeFilter.NextDay:
        this.setRangeFilter(RangeFilter.NextDay);
        break;
      case RangeFilter.NextWeek:
        this.setRangeFilter(RangeFilter.NextWeek);
        break;
      case RangeFilter.NextMonth:
        this.setRangeFilter(RangeFilter.NextMonth);
        break;
      default:
        this.setRangeFilter(RangeFilter.None);
        break;
    }

    switch (cardFilterCriteria.dueComplete) {
      case true:
        this.setCompleteFilter(CompleteFilter.Complete);
        break;
      case false:
        this.setCompleteFilter(CompleteFilter.Incomplete);
        break;
      default:
        this.setCompleteFilter(CompleteFilter.None);
    }
  }

  /**
   * Parse a DueFilter into valid MBAPI query parameters
   *
   * due will be of the form 2021-07-26T20:24:00.182Z...2021-08-01T20:24:00.182Z where up to two ISOStrings are separated by ...
   *
   * @returns {due: string, dueComplete: boolean|null}
   */
  toMbapiFormat(): { due: string; dueComplete: boolean | null } {
    const dueComplete = this.getOverdue() ? false : this.getDueComplete();
    const startOfRange = this.getOverdue() ? '' : this.getMinDue();
    const endOfRange = this.getOverdue()
      ? this.getMaxDue() || new Date().toISOString()
      : this.getMaxDue();
    const due =
      startOfRange || endOfRange ? `${startOfRange || ''}...${endOfRange}` : '';
    return { due, dueComplete };
  }
}
