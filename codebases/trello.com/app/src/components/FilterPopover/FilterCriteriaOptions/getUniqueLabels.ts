import { forNamespace } from '@trello/i18n';
import { getWords } from 'app/common/lib/util/satisfies-filter';
import { sortLabels } from 'app/src/components/Label';
import { getFilterableCriteriaOption } from './getFilterableCriteriaOption';
import type {
  FilterCriteriaSourceBoard,
  LabelFilterCriteriaOption,
} from './types';

const format = forNamespace('labels');

export const getUniqueLabels = (
  boards: FilterCriteriaSourceBoard[],
): LabelFilterCriteriaOption[] => {
  const labels: LabelFilterCriteriaOption[] = [];
  const labelsMap = new Map<string | null, Set<string>>();
  // Store tokenized output for each color, e.g. "green", to be searchable.
  const tokenizedLabelColors: Record<string, string[]> = {};

  boards.forEach((board) => {
    board.labels?.forEach((label) => {
      const color = label.color ?? null;
      const colorSet = labelsMap.get(color);
      // We've seen this label on a different board, skip it.
      if (colorSet?.has(label.name)) {
        return;
      }

      if (color && typeof tokenizedLabelColors[color] === 'undefined') {
        tokenizedLabelColors[color] = getWords(format(color));
      }

      if (!colorSet) {
        labelsMap.set(
          color,
          new Set<string>([label.name]),
        );
      } else if (!colorSet.has(label.name)) {
        colorSet.add(label.name);
      }
      labels.push({
        ...label,
        ...getFilterableCriteriaOption(
          [label.name, ...(color ? tokenizedLabelColors[color] : [])],
          label.id,
        ),
      });
    });
  });

  return sortLabels(labels);
};
