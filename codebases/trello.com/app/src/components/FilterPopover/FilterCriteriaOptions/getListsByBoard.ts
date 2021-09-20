import { getFilterableCriteriaOption } from './getFilterableCriteriaOption';
import type { FilterCriteriaSourceBoard, FilterCriteriaOptions } from './types';

export const getListsByBoard = (
  boards: FilterCriteriaSourceBoard[],
): FilterCriteriaOptions['listsByBoard'] =>
  boards.reduce((acc, { name, lists }) => {
    const options = lists
      ?.filter(({ closed }) => !closed)
      .map((list) => ({
        ...list,
        ...getFilterableCriteriaOption(list.name, list.id),
      }));

    if (options?.length) {
      acc.push({
        label: name,
        options,
      });
    }
    return acc;
  }, [] as NonNullable<FilterCriteriaOptions['listsByBoard']>);
