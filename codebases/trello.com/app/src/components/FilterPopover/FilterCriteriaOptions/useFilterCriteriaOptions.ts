import { useMemo } from 'react';
import { getSatisfiesWordFilter } from 'app/common/lib/util/satisfies-filter';
import { getDueOptions } from './getDueOptions';
import { getListsByBoard } from './getListsByBoard';
import { getUniqueLabels } from './getUniqueLabels';
import { getUniqueMembers } from './getUniqueMembers';
import type {
  FilterCriteriaSourceBoard,
  FilterableCriteriaOption,
  FilterCriteriaOptions,
} from './types';

interface UseFilterCriteriaOptionsArgs {
  boards?: FilterCriteriaSourceBoard[];
  searchQuery?: string;
}

type UseFilterCriteriaOptionsResult = FilterCriteriaOptions | undefined;

/**
 * Aggregates filter criteria options (e.g. lists, labels, members),
 * and potentially executes text matching search queries against them.
 */
export const useFilterCriteriaOptions = ({
  boards,
  searchQuery,
}: UseFilterCriteriaOptionsArgs): UseFilterCriteriaOptionsResult => {
  const allOptions: UseFilterCriteriaOptionsResult = useMemo(() => {
    if (!boards?.length) {
      return;
    }
    return {
      due: getDueOptions(),
      listsByBoard: getListsByBoard(boards),
      labels: getUniqueLabels(boards),
      members: getUniqueMembers(boards),
    };
  }, [boards]);

  return useMemo(() => {
    if (!allOptions || !searchQuery) {
      return allOptions;
    }
    const satisfiesWordFilter = getSatisfiesWordFilter(searchQuery);
    if (!satisfiesWordFilter) {
      return allOptions;
    }

    const filterCriteria = <T extends FilterableCriteriaOption>(
      options?: T[],
    ): T[] | undefined => {
      const filtered = options?.filter(({ filterableWords }) =>
        satisfiesWordFilter(filterableWords),
      );
      return filtered?.length ? filtered : undefined;
    };

    const listsByBoard = allOptions.listsByBoard?.reduce(
      (acc, { label, options }) => {
        const filteredLists = filterCriteria(options);
        if (filteredLists) {
          acc.push({ label, options: filteredLists });
        }
        return acc;
      },
      [] as NonNullable<FilterCriteriaOptions['listsByBoard']>,
    );

    return {
      // DueFilterCriteriaOption overrides FilterableCriteriaOption.value
      // to cast it explicitly to a BoardDueFilterString.
      due: filterCriteria(
        allOptions.due as FilterableCriteriaOption[],
      ) as FilterCriteriaOptions['due'],
      listsByBoard: listsByBoard?.length ? listsByBoard : undefined,
      labels: filterCriteria(allOptions.labels),
      members: filterCriteria(allOptions.members),
    };
  }, [allOptions, searchQuery]);
};
